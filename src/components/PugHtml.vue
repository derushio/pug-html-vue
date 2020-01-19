<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import { VNode } from 'vue/types/vnode';
import { CreateElement } from 'vue/types/vue';
import { RenderContext } from 'vue/types/options';

import * as lex from 'pug-lexer';
import * as parse from 'pug-parser';
import * as generateCode from 'pug-code-gen';
import * as wrap from 'pug-runtime/wrap';

import ArrayUtil from '@/utils/ArrayUtil';

@Component({
    render(createElement: CreateElement): VNode {
        const self = this as any;

        try {
            const html = self.html;
            const template = `<div class='pug-html padding'>${html}</div>`;
            const elem = createElement({template,
                data: () => { vars: {
                    // empty
                } },
                methods: {
                    gen(key: string, value: any) {
                        if (this.vars[key] == null) {
                            this.$set(this.vars, key, value);
                        }
                    },
                    array(key: string, num: number) {
                        this.gen(key, ArrayUtil.range(num).map(() => null));
                    },
                    percent(array: boolean[]): number {
                        return array.reduce((prev, value) => {
                            if (value) {
                                // 一つ分足す
                                return prev + (1 / array.length) * 100;
                            }

                            return prev;
                        }, 0);
                    },
                },
            });
            return elem;
        } catch {
            return createElement('div', 'Error!!');
        }
    },
})
export default class PugHtml extends Vue {
    @Prop({ type: String, default: () => '', required: true })
    protected document!: string;

    protected lastPuged = '';
    protected lastScrollTop = 0;

    protected updated(): void {
        this.$el.scrollTop = this.lastScrollTop;
    }

    protected checkLex(lexed: any[]) {
        for (const v of lexed) {
            if (v.type === 'attribute' &&
                    /(?=[^a-z])(?=[^A-Z])(?=[^!#$%&*+-@])/.test(v.name)) {
                return false;
            }
        }

        return true;
    }

    protected get html(): string {
        if (this.$el != null) {
            this.lastScrollTop = this.$el.scrollTop;
        }

        try {
            const lexed =lex(this.document!);
            if (!this.checkLex(lexed)) {
                throw new Error('lex error');
            }

            const puged = wrap(generateCode(parse(lexed), PugHtml.name, {
                compileDebug: false,
                pretty: true,
                inlineRuntimeFunctions: false,
                templateName: PugHtml.name,
            }))();

            this.lastPuged = puged;
            return puged;
        } catch {
            return this.lastPuged;
        }
    }
}

</script>

<style lang='stylus'>
.pug-html
    width: 100%
    overflow-x: hidden
    overflow-y: auto

    h1
        font-size: 1.5em
    h2
        font-size: 1.3em
        border-bottom: 1px solid $black
    h3
        font-size: 1.3em
    h4
        font-size: 1.2em
    h5
        font-size: 1.1em
    h6
        font-size: 1.0em

    h1, h2, h3, h4, h5, h6, p
        margin-bottom: 0.25em

    ul
        & > li
            margin-left: 0

            &:before
                content: '-'
                margin-right: 0.5rem

            ul, ol
                margin-left: 2rem

    ol
        & > li
            margin-left: 1rem

            &:before
                content: ''
                margin-right: 0

            ul, ol
                margin-left: 1rem

    .code
        display: none

</style>
