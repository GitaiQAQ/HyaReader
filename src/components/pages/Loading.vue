<template lang="jade">
  spinner(:show="show")
</template>

<script>
import Spinner from '../utils/Spinner';

export default {
  name: 'page-loading',
  data() {
    return {
      show: true,
    };
  },
  components: {
    Spinner,
  },
};
</script>