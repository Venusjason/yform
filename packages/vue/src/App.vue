<template>
<div id="app">
  <Examples />
  <!-- <NativeForm v-if="isShow" />
  <ElementForm v-if="!isShow" /> -->
</div>
</template>
<script>
import Examples from './examples/index'
// import NativeForm from './examples/nativeForm'
// import ElementForm from './examples/element-ui'

export default {
  components: {
    // NativeForm,
    // ElementForm,
    Examples
  },
  data () {
    return {
      isShow: false,
    }
  },
  computed: {},
  mounted () {},
  methods: {},
}
</script>
<style>
</style>