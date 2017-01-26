<template lang="jade">
  #hya-reader(:class="{ 'layout-vertical': vertical }", :style="{ 'font-size': fontSize + 'px', 'line-height': lineHeight + 'em'}")
    .aside
      ul(class="panel")
        li
          a(href="#", @click="vertical=!vertical", class="arkicon-layout", :class="{ 'vertical': vertical }")
        li {{ pages.length }}
    .article(@click="click($event)", :style="{ height: fullHeight+'em'}")
      .inner(:style="{ width: pageWidth * (pages.length + 1) + 'em', left: offsetLeft + 'em'}")
        // page-empty(v-if="!pages.length")
        page-loading(v-if="!pages.length")
        page-render(v-if="!pages.length", @updatePages="updatePages")
        page-wrapper(:meta="meta")
        page(v-for="(page, key) in pages", :page="page", 
          :currPos="currPos", :index="key", :total="pages.length")
</template>

<script>
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
      vertical: true,

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
    offsetLeft() {
      let left = -(this.currPos = (this.currPos > 0 ? this.currPos : 0)
        % (this.pages.length ? this.pages.length + 1 : 3)) * this.pageWidth;
      left = (left < 0 && left > -this.pageWidth * (this.pages.length + 1)) ? left : 0;
      return this.vertical ? 0 : left;
    },
  },
  components: {
    Page,
    PageRender,
    PageLoading,
    PageWrapper,
  },
  methods: {
    updatePages(meta, toc, pages) {
      this.pages = pages;
      this.toc = toc;
      this.$nextTick(() => {
        this.meta = meta;
      });
    },
    click(event) {
      const prev = (global.document.documentElement.clientWidth / 2) - 75;
      const next = prev + 150;
      if (event.clientX < prev) this.currPos -= 1;
      else if (event.clientX > next) this.currPos += 1;
      // else console.log('center');
    },
  },
  watch: {
    currPos(newVal) {
      if (this.vertical) {
        const anchor = this.$el.querySelector(`#page_${newVal}`);
        global.document.body.scrollTop = anchor.offsetTop;
      }
    },
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
.aside
  position: fixed;
  z-index: 50;
  width: 2.5em;
  top: 0;
  left: 0;
  height: 100%;
  background: #e5e4db;
  @media screen and (max-width:599px)
    display: none;
  .panel 
    width: 1.5em;
    margin: .625em auto;
    li
      padding: 0;
      text-align: center;
      position: relative;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #cecdc5;
.article
  position: relative;
  margin: auto;
  max-width: 44em;
  overflow: hidden;
.inner
  position: absolute;
  transition: left .5s;
.layout-vertical
  .inner
    position: relative;
</style>
