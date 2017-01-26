<template lang="jade">
  .page.wrapper(:style="{ height: $parent.pageHeight + 'em', width: $parent.contentWidth + 'em'}")
    .page-wrapper(:style="{height: $parent.contentHeight + 'em', width: $parent.contentWidth + 'rem'}")
      h1.title {{ meta.title }}
      h2.subtitle {{ meta.subtitle }}
      .info-list
        .author Author: {{ meta.author }}
        .illustrator Illustrator:  {{ meta.illustrator }}
        .releaseDate Release Date:  {{ meta.releaseDate }}
        .publisher {{ meta.publisher }}
      .copyright {{ meta.copyright }}
</template>
<script>
export default {
  name: 'page-wrapper',
  props: ['meta'],
};
</script>

<style lang="stylus">
.layout-vertical
  .wrapper
    padding: 5em 5em 3em;
    @media screen and (max-width:599px)
      padding: 2.5em 1.5em;  
</style>
