<template lang="jade">
  .aside
    ul(class="panel")
      li
        a(href="#", @click="$parent.layoutChange()", class="arkicon-layout", :class="{ 'vertical': $parent.vertical }", title="Layout")
      li
        a(href="#", @click="$parent.showTOC()", class="arkicon-list", title="TOC")
      li
        a(title="Font Size") {{ $parent.fontSize }}
      li
        a(title="Line Height") {{ $parent.lineHeight }}
</template>

<script>
export default {
  name: 'hya-aside',
};
</script>

<style lang="stylus">
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
</style>