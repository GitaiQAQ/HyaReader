<template lang="jade">
  .content(:id="'page_' + index", v-html="compiledMarkdown", :style="{ marginTop: offsetTop + 'em'}")
</template>

<script>
export default {
  name: 'Reader',
  props: ['index'],
  computed: {
    page() {
      return this.$store.state.book.pages[this.index];
    },
    offsetTop() {
      if (!this.page) return 0;
      if (!this.page[0]) return 0;
      return this.page[0].offset * this.$store.state.reader.lineHeight;
    },
    compiledMarkdown() {
      if (!this.page) return undefined;
      return this.page.map(v => v.html).join('\n');
    },
  },
};
</script>

