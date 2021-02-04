<template>
  <carte :items="items" :bordas="bordas"></carte>
</template>

<script>

import carte from '~/components/Carte.vue'
import AppApi from '~apijs'

export default {
  components: {
    carte
  },
  asyncData() {
        return AppApi.list_products().then(result => {
            result.data.pizzas.forEach(element => {
              element.photo = "media/" + element.photo
              element.price = parseFloat(element.price)
              element['half'] = false
              element['half_price'] = element.price / 2
              element['obs'] = ''
              element['quant'] = 1
              element['edge'] = null
              if (element.id % 3 == 0) {
                element['fake_price'] = element.price + 0.2*element.price
                element['fake_price'] = Math.trunc(element['fake_price']) + 0.9
              }
            });
            let semrecheio = [{'recheio': "Sem recheio", 'id': null}]
            result.data.edges.forEach(element => {
              element.price = parseFloat(element.price)
            });
            result.data.edges = semrecheio.concat(result.data.edges)
            return {
                items: result.data.pizzas,
                bordas: result.data.edges
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
