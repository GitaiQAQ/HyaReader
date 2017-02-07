<template lang="jade">
  hya-reader
</template>

<script>
import { markdown } from 'markdown';
import frontMatter from 'front-matter';

import HyaReader from './components/Reader';

export default {
  name: 'app',
  components: {
    HyaReader,
  },
  methods: {
    fetch(url) {
      this.$http.get(url)
        .then(response => response.text())
        .then((text) => {
          const data = frontMatter(text);
          this.$store.commit('UPDATE_BOOK_META', { meta: data.attributes });
          const mdTree = markdown.parse(data.body);
          const htmlTree = markdown.toHTMLTree(mdTree);
          const result = markdown.renderJsonML(JSON.parse(JSON.stringify(htmlTree)));
          this.$store.commit('UPDATE_BOOK_HTML', { html: result.join('\n\n') });
          this.$store.commit('UPDATE_BOOK_TREE', { tree: result.map(
            (v, k) => ({ html: v, el: htmlTree[k + 1] })) });
        });
    },
  },
  mounted() {
    this.fetch(this.$store.state.book.url);
  },
};
</script>
