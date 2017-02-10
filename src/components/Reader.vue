<template lang="jade">
  #hya-reader(:class="{ 'layout-vertical': vertical }",:style="{ 'font-size': fontSize + 'px', 'line-height': lineHeight + 'em'}")
    hya-aside
    .article(@click="click($event)", :style="{ height: fullHeight+'em'}")
      .inner(:style="innerStyle")
        page.toc(v-if="toc_show")
          h2(slot="hd") 目录
          hya-toc(slot="bd")
        page.page-wrapper(v-if="$store.getters.isLoading")
          PageWrapper(slot="bd", v-show="$store.state.book.meta.title")
          .page-loading(slot="bd")
            Spinner(:show="!$store.state.book.meta.title",
            :style="{ height: $parent.pageHeight + 'em', width: $parent.contentWidth + 'em'}")
        page.page-render(v-if="$store.getters.isLoading")
          PageRender(slot="bd", :contentHeight="contentHeight", :fontSize="fontSize", :lineHeight="lineHeight")
        page.page-wrapper(v-if="!$store.getters.isLoading && vertical", :key="0")
            PageWrapper(slot="bd")
        page.page-reader(v-if="!$store.getters.isLoading && vertical", v-for="(page, key) in slicedPage", :key="sliced[0] + key")
          PageReader(slot="bd", :index="sliced[0] + key")
        transition(v-if="!$store.getters.isLoading && !vertical", :name="transition")
          page.page-wrapper(v-if="!currPos", :key="0")
            PageWrapper(slot="bd")
          page.page-reader(v-if="currPos", :key="currPos")
            h3(slot="hd") {{ title }}
            PageReader(slot="bd", :index="currPos - 1")
            span(slot="ft") {{ currPos }}
              span / {{ pages.length }} 
</template>

<script>
import HyaAside from './Aside';
import HyaToc from './TOC';
import Page from './Page';
import Spinner from './utils/Spinner';
import PageWrapper from './pages/Wrapper';
import PageRender from './pages/Render';
import PageReader from './pages/Reader';

export default {
  name: 'hya-reader',
  props: ['book'],
  data() {
    return {
      fontSize: 16,     // px
      lineHeight: 1.5,  // em
      vertical: false,
      toc_show: false,

      transition: 'slide-left',

      currPos: 0,
    };
  },
  computed: {
    pages() {
      return this.$store.state.book.pages;
    },
    title() {
      const chapter = this.$store.state.book.toc.find(item => item.pagination < this.currPos);
      return chapter ? chapter.title : this.$store.getters.title;
    },
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
          width: `${this.pageWidth}em`,
        };
      }
      return {
        width: `${this.pageWidth}em`,
        paddingTop: `${this.contentHeight * this.sliced[0]}em`,
        paddingBottom: `${this.contentHeight * ((this.pages.length - 1) - (this.sliced[0] + this.sliced[2]))}em`,
      };
    },
  },
  components: {
    Page,
    HyaAside,
    HyaToc,
    Spinner,
    PageWrapper,
    PageRender,
    PageReader,
  },
  methods: {
    layoutChange(layout) {
      this.currPos = 0;
      if (!layout) this.vertical = !this.vertical;
      else if (layout === 'layout-vertical') this.vertical = true;
      else if (layout === 'layout-horizontal') this.vertical = false;
    },
    showTOC() {
      this.toc_show = !this.toc_show;
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
