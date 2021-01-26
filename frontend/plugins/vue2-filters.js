import Vue from 'vue'
import Vue2Filters from 'vue2-filters'
 
Vue.use(Vue2Filters)

Vue.filter('json', value => {
  if (!value) return
  return JSON.stringify(value, null, 2)
})

Vue.filter('priceBR', value => {
  if (!value) return
  return value.toFixed(2).replace(".", ",")
})
