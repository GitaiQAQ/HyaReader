<template lang="jade">
  transition
    svg(class="spinner", :class="{ show: show}", v-show="show", width="8rem", height="8rem", viewBox="0 0 44 44")
      circle(class="path", fill="none", stroke-width="4", stroke-linecap="round", cx="22", cy="22", r="20")
</template>

<script>
export default {
  name: 'spinner',
  props: ['show'],
};
</script>

<style lang="stylus">
$offset=2
$duration=1.4s

.spinner
  transition: opacity .15s ease;
  animation: rotator $duration ease-in-out infinite;
  &.v-enter, &.v-leave-active
    opacity: 0;
  &.v-enter-active, &.v-leave
    opacity: 1;
  .path
    stroke: #935352;
    stroke-dashoffset: $offset;
    stroke-dasharray: 10;
    transform-origin: center;

@keyframes rotator
  from
    transform: scale(0.5) rotate(0deg)
  to
    transform: scale(0.5) rotate(360deg)
</style>