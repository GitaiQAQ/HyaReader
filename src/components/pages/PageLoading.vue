<template lang="jade">
  .page.page-loading(:style="{ height: $parent.pageHeight + 'em', width: $parent.contentWidth + 'em', 'text-align': 'center' }")
      spinner(:show="show", :style="{ 'margin-top': $parent.contentHeight / 2 - 4 + 'em' }")
      
</template>


<script>
import Spinner from '../utils/Spinner';

export default {
  name: 'page-loading',
  data() {
    return {
      loading: false,
      show: true,
    };
  },
  components: {
    Spinner,
  },
};
</script>