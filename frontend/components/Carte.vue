<template>
  <v-list>
    <template v-for="(item) in items">
        <v-list-tile  class="list"
          :key="item.title"
          avatar
        >
        <img class="product-image" :src="item.photo">
        <v-list-tile-content class="list-item">
          <label class="item-name">{{item.name}}</label>
          <label>{{item.description}}</label>
          <label>R$ {{item.price | priceBR}}</label>
        </v-list-tile-content>
        <v-btn
          color="warning"
          dark
          @click="add_to_cart(item)"
        >
          Adicionar ao carrinho
        </v-btn>
      </v-list-tile>
    </template>
  </v-list>
</template>

<script>
  export default {
    props: ['items'],
    data () {
      return {}
    },
    methods: {
      // add_to_cart(item){
      //   this.$store.commit('ADD_TO_ORDER', {name: item.name, price: item.price, photo: item.photo, description: item.description})
      // },
      add_to_cart(item){
        this.$confirm(
            {
            message: `Adicionar ${item.name} ao carrinho?`,
            button: {
                no: 'NÃO',
                yes: 'SIM'
            },
            /**
             * Callback Function
             * @param {Boolean} confirm
             */
            callback: confirm => {
                if (confirm) {
                    this.$store.commit('ADD_TO_ORDER', {name: item.name, price: item.price, photo: item.photo, description: item.description})
                    this.$cookies.set("pedido", JSON.stringify(this.pedido))
                }
            }
            }
        )
      }
    },
    mounted() {
      if (this.pedido.length == 0) {
        this.$store.commit("SET_PEDIDO", JSON.parse(this.$cookies.get('pedido')))
      }
    },
    computed: {
      pedido: function() {
        return this.$store.getters.pedido
      },
      total_price: function() {
        return this.$store.getters.total_price.toFixed(2).replace('.',',')
      }
    }
  }
</script>



<style>

.list {
  height: 100px;
  padding: 10px;
  margin-bottom: 30px;
}
.product-image {
  height: 90px;
  margin-right: 50px;
  border-radius: 10%;
  border: 1px solid black;
}

.list-item {
  height: auto;
}
.item-name {
  font-weight: bold;
}

</style>
