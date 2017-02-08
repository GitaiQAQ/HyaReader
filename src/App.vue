<template lang="jade">
  div
    hya-reader
    a#forkme_banner(href="https://github.com/GitaiQAQ/HyaReader") View on GitHub
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
<style lang="stylus">
.page
  &:hover
    d
#forkme_banner
    display: block;
    text-decoration: none;
    position: absolute;
    top: 0;
    right: 10px;
    z-index: 10;
    padding: 10px 50px 10px 10px;
    color: #fff;
    background: url(//pages-themes.github.io/slate/assets/images/blacktocat.png) #0090ff no-repeat 95% 50%;
    font-weight: 700;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
</style>