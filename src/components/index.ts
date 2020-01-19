import Vue, { PluginObject } from 'vue';
import PugHtml from '@/components/PugHtml.vue';

export const components = [ PugHtml ];

export const installers = components.map((component) => {
    return {
        install: (MyVue: typeof Vue) => {
            MyVue.component(component.name, component);
        },
    };
}) as Array<PluginObject<{}>>;
