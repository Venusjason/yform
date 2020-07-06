# Hello @yform
111
::: demo
```vue
<template>
  <YForm v-model="formValues" inline>
    <YField name="name" label="名称" rules="required" />
    <YButton />
    <!-- <YButton do="search" />
    <YButton do="reset" /> -->
    <YButton do="debug" />
  </YForm>
</template>
<script>
export default {
  data() {
    return {
      formValues: {}
    }
  }
}
</script>
```
:::