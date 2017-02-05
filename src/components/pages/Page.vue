<template lang="jade">
  .page(:style="{ height: $parent.pageHeight + 'em', width: $parent.contentWidth + 'em'}")
    .hd(:style="{ width: $parent.contentWidth + 'rem'}")
      h3 {{ title }}
    .bd(:style="{ height: $parent.contentHeight + 'em'}")
      .content(:id="'page_' + index", v-html="compiledMarkdown", :style="{ marginTop: offsetTop + 'em'}")
    .ft(:style="{width: '3rem', 'margin-top': $parent.contentHeight * -0.3 + 'rem'}") {{ index }}
      span / {{ total }} 
</template>

<script>
export default {
  name: 'page',
  props: ['page', 'currPos', 'index', 'total'],
  data() {
    return {
      stamp: {},
      tocItem: [],
      empty: true,
    };
  },
  computed: {
    offsetTop() {
      if (!this.page) return undefined;
      if (!this.page[0]) return undefined;
      return this.page[0].offset;
    },
    title() {
      if (!this.page) return undefined;
      if (!this.page[0]) return undefined;
      return this.page[0].title;
    },
    compiledMarkdown() {
      if (!this.page) return undefined;
      return this.page.map(v => v.text).join('\n');
    },
  },
};
</script>

<style lang="stylus">
.slide-left-enter, .slide-right-leave-active
  opacity 0
  transform translate(100%, 0)
.slide-left-leave-active, .slide-right-enter
  opacity 0
  transform translate(-100%, 0)
.page
  transition all .5s cubic-bezier(.55,0,.1,1)
  max-width: 34em;
  float: left;
  overflow: hidden;
  padding: 5em 5em 3em;
  margin: 0;
  border: none;
  background: #f6f4ec;
  @media screen and (max-width:599px)
    padding: 2.5em 1.5em;  
  .page-wrapper
    margin-top: 6em;
    .info-list
      margin: 3em 0;
    h2
      padding-top: 3em;
      padding-bottom: 1em;    
  .hd
    position: absolute;
    top: 2em;
    padding-bottom: 8px;
    color: #aaa;
    overflow: hidden;
    border-bottom: 1px solid #e9eadf;
    @media screen and (max-width:599px)
      top: .7em;
      height: 1rem;
    h3
      color: #855b5b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
  .bd
    overflow: hidden;
    .content
      h1, h2, h3, h4, h5, h6
        font-size: 100%;
        font-weight: normal;
      h1
        font-size: 2em;
        font-weight: bold;
        line-height: 3em;
      h2
        font-size: 1.25em;
        font-weight: bold;
        margin-top: .3125em;
      hr
        margin: 11px 0;
      p,pre
        text-indent: 2em;
        line-height: 2;
        min-height: 2em;
        text-align: justify;
        text-justify: inter-ideograph;
        -ms-text-justify: inter-ideograph;
        text-autospace: ideograph-alpha;
        -webkit-hyphens: auto;
        -moz-hyphens: auto;
        -ms-hyphens: auto;
        hyphens: auto;
        white-space: pre-line;
        line-height: 1.5em;
        min-height: 1.5em;
        font-weight: inherit;
        font-style: inherit;
        img
          margin-left: -2em;
          width: 100%;
  .ft
    position: absolute;
    color: #999;
    font: .75em Georgia;
    bottom: 2em;
    @media screen and (max-width:599px)
      text-align: center;
      bottom: 1.2em;

.layout-vertical
  .article
    height: auto !important;
  .page
    float: none;
    height: auto !important;
    padding-top: 0;
    padding-bottom: 0;
    .hd
      display: none;
    .ft
      left: 0em;
      bottom: auto;
      font-size: 2em;
      text-align: right;
      span
        display: none;
</style>
