<template>
  <home :items="items"></home>
</template>

<script>

import home from '~/components/Home.vue'
import AppApi from '~apijs'

export default {
  components: {
    home
  },
  asyncData() {
        return AppApi.list_products().then(result => {
            result.data.data.forEach(element => {
              element.photo = "media/" + element.photo
              element.price = parseFloat(element.price)
            });
            return {
                items: result.data.data
            }
        })
  },
  data () {
    return {}
  }
}
</script>

<style>
</style>
