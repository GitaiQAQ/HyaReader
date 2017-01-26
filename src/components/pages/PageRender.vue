<template lang="jade">
  .page.page-reader(:style="{ height: $parent.pageHeight + 'em', width: $parent.contentWidth + 'em'}")
    .bd(:style="{ height: $parent.contentHeight + 'em'}")
      .content(v-html="compiledMarkdown")
</template>

<script>
import { markdown } from 'markdown';
import frontMatter from 'front-matter';

export default {
  name: 'page-render',
  data() {
    return {
      title: null,
      stamp: {},
      toc: [],
      htmlTree: [],
      pages: [],
      meta: [],
      content: null,
    };
  },
  computed: {
    compiledMarkdown() {
      return this.content;
    },
  },
  methods: {
    pageByHeight() {
      function isPlaceholder(el) {
        if (typeof el === 'string') return 0;
        let numOfImg = 0;
        const tag = el.shift();
        if (tag === 'img') numOfImg += 1;
        if (el.length && typeof el[0] === 'object' && !(el[0] instanceof Array)) el.shift();
        while (el.length) {
          numOfImg += isPlaceholder(el.shift());
        }
        return numOfImg;
      }

      function isTitle(el) {
        if (typeof el === 'string') return false;
        const tag = el.shift();
        if (tag === 'h1') return true;
        return false;
      }

      let posOfPage = 0;
      let indent = 0;
      let heightOfEls = 0;
      let title = this.meta.title || '';
      let elHeight = 0;
      [].forEach.call(this.$el.children[0].children[0].children, (v, i) => {
        elHeight = v.offsetHeight < 24 ? 24 : v.offsetHeight;
        heightOfEls += elHeight;
        if (!this.pages[posOfPage]) {
          this.pages[posOfPage] = [];
        }
        if (isPlaceholder(JSON.parse(JSON.stringify(this.htmlTree[i].el)))) {
          if (this.pages[posOfPage].length > 0) posOfPage += 1;
          heightOfEls = 0;
          if (!this.pages[posOfPage]) {
            this.pages[posOfPage] = [];
          }
          const el = JSON.parse(JSON.stringify(this.htmlTree[i]));
          el.title = title;
          this.pages[posOfPage].push(el);
          indent = 0;
          posOfPage += 1;
          return;
        }
        if (isTitle(JSON.parse(JSON.stringify(this.htmlTree[i].el)))) {
          if (this.pages[posOfPage].length > 0) posOfPage += 1;
          heightOfEls = elHeight;
          if (!this.pages[posOfPage]) {
            this.pages[posOfPage] = [];
          }
          const el = JSON.parse(JSON.stringify(this.htmlTree[i]));
          if (el.el && typeof el.el[1] === 'string') {
            title = el.el[1];
            this.toc.push({
              index: posOfPage,
              title,
            });
          }
          el.title = title;
          this.pages[posOfPage].push(el);
          indent = 0;
          return;
        }
        const el1 = this.htmlTree[i];
        el1.height = elHeight;
        el1.title = title;
        this.pages[posOfPage].push(el1);
        indent = (heightOfEls / 16) - this.$parent.contentHeight;
        while (indent >= 0) {
          posOfPage += 1;
          heightOfEls = indent * 16;
          if (!this.pages[posOfPage]) {
            this.pages[posOfPage] = [];
          }
          if (indent > 0) {
            const el = JSON.parse(JSON.stringify(this.htmlTree[i]));
            el.offset = -(elHeight / 16) + indent;
            this.pages[posOfPage].push(el);
          }
          indent -= this.$parent.contentHeight;
        }
      });

      this.$emit('updatePages', this.meta, this.toc, this.pages);
    },
  },
  created() {
    this.$http.get('/static/Brave-New-World.txt').then(response => response.text()).then((text) => {
      const data = frontMatter(text);
      this.meta = data.attributes;
      const mdTree = markdown.parse(data.body);
      const htmlTree = markdown.toHTMLTree(mdTree);
      const result = markdown.renderJsonML(JSON.parse(JSON.stringify(htmlTree)));
      this.content = result.join('\n\n');
      this.htmlTree = result.map(
        (v, k) => ({ text: v, el: htmlTree[k + 1] }));
    });
  },
  updated() {
    this.pageByHeight();
  },
};
</script>

