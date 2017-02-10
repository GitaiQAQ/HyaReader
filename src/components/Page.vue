<template lang="jade">
  .page(:style="{ height: $parent.pageHeight + 'em', width: $parent.contentWidth + 'em'}")
    // .tip
      a(class="prevBtn")
      a(class="nextBtn")
    .hd(:style="{ width: $parent.contentWidth + 'rem'}")
      slot(name="hd")
    .bd(:style="{ height: $parent.contentHeight + 'em'}")
      slot(name="bd")
    .ft
      slot(name="ft")
</template>
<script>
export default {
  methods: {
    updateMeta(meta) {
      this.meta = meta;
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
  .hd, .ft
    display: none;
  &:hover
    .tip
      display: block;
  .tip
    display: none;
    a
      display: block;
      line-height: 40px;
      position: absolute;
      top: 50%;
      margin-top: -20px;
      width: 40px;
      height: 40px;
      background-color: #000;
      opacity: 0.3;
      // filter: alpha(opacity=30)color: rgb(255, 255, 255);
      overflow: hidden;
      z-index: 4;
    .prevBtn
      left: 5px;
    .nextBtn
      right: 5px;
.page-loading
    text-align: center;
.toc
  .hd
    display: initial;
.page-reader
  .hd, .ft
    display: initial;
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
  .page-reader
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