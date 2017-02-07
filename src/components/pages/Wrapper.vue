<template lang="jade">
  .page-wrapper(:style="{height: $parent.contentHeight + 'em', width: $parent.contentWidth + 'rem'}")
    h1.title {{ title }}
    h2.subtitle {{ subtitle }}
    .info-list
      div(v-for="key in infos", :class="key") {{ meta[key] }}
    .copyright {{ copyright }}
</template>

<script>
export default {
  name: 'page-wrapper',
  computed: {
    meta() {
      return this.$store.state.book.meta;
    },
    title() {
      return this.meta.title;
    },
    subtitle() {
      return this.meta.subtitle;
    },
    copyright() {
      return this.meta.copyright || '© 版权所有，侵权必究。';
    },
    infos() {
      return Object.keys(this.$store.state.book.meta)
        .filter(key => !['title', 'subtitle', 'copyright'].includes(key));
    },
  },
};
</script>

<style lang="stylus">
.layout-vertical
  .wrapper
    padding: 5em 5em 3em;
    @media screen and (max-width:599px)
      padding: 2.5em 1.5em;  
</style>
