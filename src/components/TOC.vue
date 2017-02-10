<template lang="jade">
  ul
    li(v-for="item in toc", :key="item.pagination")
      a(:href="'#page_' + item.pagination") {{ item.title }}
      span {{ item.pagination }}
</template>

<script>
export default {
  name: 'hya-toc',
  computed: {
    toc() {
      return this.$store.getters.toc;
    },
  },
};
</script>

<style lang="stylus">
.toc
  position: absolute;
  margin: auto;
  max-width: 44em;
  z-index: 4;
  .hd
    > h2
      text-align: center;
      margin-bottom: 1.875em;
  .bd
    overflow: scroll;
  li
    > a
      display: block;
      color: #666;
      height: 2.375em;
      line-height: 2.375em;
      padding: 0 3em 0 1em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    > span
      float: right;
      margin-top: -2em;
      color: #777;
</style>