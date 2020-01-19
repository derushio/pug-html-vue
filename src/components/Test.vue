<template lang='pug'>
.pug-html
    p test
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class PugHtml extends Vue {}
</script>

<style lang='stylus' scoped>
.pug-html
    p
        color: red;
</style>
