<template lang="jade">
  .content(v-html="book.html")
</template>

<script>
export default {
  name: 'page-render',
  props: ['fontSize', 'lineHeight', 'contentHeight'],
  data() {
    return {
      toc: [],
      pages: [[]],
    };
  },
  computed: {
    book() {
      return this.$store.state.book;
    },
  },
  methods: {
    pageByHeight() {
      const lineHeight = this.fontSize * this.lineHeight;
      const contentHeight = this.contentHeight / this.lineHeight;
      let pagination = 0;
      let pageHeight = 0;
      const $this = this;

      function isPlaceholder(oElTreeel) {
        if (typeof oElTreeel === 'string') return 0;
        // let numOfImg = 0;
        const elTree = JSON.parse(JSON.stringify(oElTreeel));
        const tag = elTree.shift();
        if (tag === 'img') return 2;// numOfImg += 1;
        else if (tag === 'h1') {
          $this.toc.push({
            pagination,
            title: elTree.shift(),
          });
          return 1;
        }
        if (elTree.length && typeof elTree[0] === 'object' && !(elTree[0] instanceof Array)) elTree.shift();
        while (elTree.length) {
          // numOfImg += isPlaceholder(elTree.shift());
          const rt = isPlaceholder(elTree.shift());
          if (rt) return rt;
        }
        // return numOfImg;
        return false;
      }

      function nextPage(height) {
        pageHeight = height;
        pagination += 1;
        if (!$this.pages[pagination]) $this.pages[pagination] = [];
      }

      [].forEach.call($this.$el.children, (v, i) => {
        const paragraph = {
          height: Math.ceil(v.offsetHeight / lineHeight),
          offset: (lineHeight - (v.offsetHeight % lineHeight)) % lineHeight,
          html: $this.book.tree[i].html,
          tree: $this.book.tree[i].el,
        };
        // Pagination
        switch (isPlaceholder(paragraph.tree)) {
          case 1: {
            nextPage(paragraph.height);
            $this.toc.push({
              title: paragraph.tree[1],
              pagination,
            });
            $this.pages[pagination].push(paragraph);
            return;
          }
          case 2: {
            nextPage(0);
            $this.pages[pagination].push(paragraph);
            nextPage(0);
            return;
          }
          default:
            break;
        }
        pageHeight += paragraph.height;
        $this.pages[pagination].push(paragraph);
        while (pageHeight >= contentHeight) {
          nextPage(pageHeight - contentHeight);
          const oParagraph = JSON.parse(JSON.stringify(paragraph));
          oParagraph.offset = -(paragraph.height - pageHeight);
          $this.pages[pagination].push(oParagraph);
        }
      });
      this.$store.commit('UPDATE_BOOK_TOC', { toc: this.toc.reverse() });
      this.$store.commit('UPDATE_BOOK_PAGES', { pages: this.pages });
    },
  },
  updated() {
    this.pageByHeight();
  },
};
</script>

