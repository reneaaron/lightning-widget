<template>
  <p><a href="lightning:#">{{address}}</a></p>
</template>

<script>
export default {
  name: 'LightningWidget',
  props: {
    address: String,
    image: String,
    amount: Number,

  }
}
</script>
<style scoped>

</style>