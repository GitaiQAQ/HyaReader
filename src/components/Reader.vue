<template lang="jade">
  #hya-reader(:class="{ 'layout-vertical': vertical }",:style="{ 'font-size': fontSize + 'px', 'line-height': lineHeight + 'em'}")
    hya-aside
    .article(@click="click($event)", :style="{ height: fullHeight+'em'}")
      .inner(:style="innerStyle")
        page-loading(v-show="!pages.length")
        page-render(v-if="!pages.length", @updatePages="updatePages")
        page(v-if="vertical", v-for="(page, key) in slicedPage", 
          :page="page", :key="sliced[0] + key", :index="sliced[0] + key + 1", :total="pages.length")
        transition(v-if="!vertical", :name="transition")
          page(v-if="pages.length", :page="pages[currPos]", :key="currPos", :index="currPos + 1", 
            :total="pages.length")
</template>

<script>
import HyaAside from './Aside';
import Page from './pages/Page';
import PageWrapper from './pages/PageWrapper';
import PageRender from './pages/PageRender';
import PageLoading from './pages/PageLoading';

export default {
  name: 'hya-reader',
  data() {
    return {
      fontSize: 16,     // px
      lineHeight: 1.5,  // em
      vertical: false,

      transition: 'slide-left',

      meta: [],
      currPos: 0,
      toc: [],
      pages: [],
    };
  },
  computed: {
    fullHeight() {
      return global.document.documentElement.clientHeight / this.fontSize;
    },
    fullWidth() {
      return global.document.documentElement.clientWidth / this.fontSize;
    },
    padding() {
      if (global.document.documentElement.clientWidth > 599) return { h: 10, v: 8 };
      return { h: 3, v: 5 };
    },
    pageHeight() {
      return this.fullHeight - this.padding.v;
    },
    pageWidth() {
      return (this.fullWidth) > 44 ? 44 : (this.fullWidth);
    },
    contentHeight() {
      return Math.floor((this.fullHeight - this.padding.v) / this.lineHeight) * this.lineHeight;
    },
    contentWidth() {
      return this.pageWidth - this.padding.h;
    },
    sliced() {
      const start = this.currPos >= 3 ? (this.currPos - 3) : 0;
      let end = this.pages.length - 1;
      end = (this.currPos + 3) < end ? (this.currPos + 3) : end;
      return [
        start, end, end - start,
      ];
    },
    slicedPage() {
      return this.pages.slice(this.sliced[0], this.sliced[1] + 1);
    },
    innerStyle() {
      if (!this.vertical) {
        return {
          width: `${this.pageWidth * (this.pages.length + 1)}em`,
        };
      }
      return {
        width: `${this.pageWidth * (this.pages.length + 1)}em`,
        paddingTop: `${this.contentHeight * this.sliced[0]}em`,
        paddingBottom: `${this.contentHeight * ((this.pages.length - 1) - (this.sliced[0] + this.sliced[2]))}em`,
      };
    },
  },
  components: {
    Page,
    HyaAside,
    PageRender,
    PageLoading,
    PageWrapper,
  },
  methods: {
    updateMeta(meta) {
      this.meta = meta;
    },
    updatePages(toc, pages) {
      this.pages = pages;
      this.toc = toc;
    },
    layoutChange(layout) {
      this.currPos = 0;
      if (!layout) this.vertical = !this.vertical;
      else if (layout === 'layout-vertical') this.vertical = true;
      else if (layout === 'layout-horizontal') this.vertical = false;
    },
    turn(num) {
      this.transition = (num > 0) ? 'slide-left' : 'slide-right';
      if ((this.currPos + num) >= 0 && (this.currPos + num) < this.pages.length) {
        this.currPos += num;
      }
    },
    click(event) {
      const prev = (global.document.documentElement.clientWidth / 2) - 75;
      const next = prev + 150;
      if (event.clientX < prev) this.turn(-1);
      else if (event.clientX > next) this.turn(1);
    },
    handleScroll() {
      const scrollY = Math.floor((global.window.scrollY / this.fontSize) / this.contentHeight);
      this.turn(scrollY - this.currPos);
    },
  },
  mounted() {
    global.window.addEventListener('scroll', this.handleScroll);
  },
};
</script>

<style lang="stylus">
body
  font: 16px 'Helvetica Neue',Helvetica,'Lucida Grande','Luxi Sans',Arial,'Hiragino Sans GB',STHeiti,'Microsoft YaHei','Wenquanyi Micro Hei','WenQuanYi Micro Hei Mono','WenQuanYi Zen Hei','WenQuanYi Zen Hei Mono',LiGothicMed;
  overflow-x: hidden;
  background: #e5e4db;
h1, h2, h3, h4, h5, h6, p, blockquote
  word-wrap: break-word;
body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, form, fieldset, input, button, textarea, p, blockquote, th, td
  margin: 0;
  padding: 0;
ol, ul
  list-style: none;
.article
  position: relative;
  margin: auto;
  max-width: 44em;
  overflow: hidden;
.inner
  position: absolute;
.layout-vertical
  .inner
    position: relative;
</style>
