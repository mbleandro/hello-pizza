<template>
  <v-list>
    <v-btn 
      class="half-btn"
      v-bind:color=" half ? 'warning' : ''"
      @click="half = !half"
    >
      Selecionar meia pizza
    </v-btn>
    <template v-for="(item) in items">
      <v-list-tile  class="list"
        :key="item.name"
        avatar
      >
        <img class="product-image" :src="item.photo">
        <v-list-tile-content class="list-item">
          <label class="item-name">{{item.name}}</label>
          <label>{{item.description}}</label>
          <label>R$ {{item.price | priceBR}}</label>
        </v-list-tile-content>
        <v-btn v-if="!half"
          color="warning"
          dark
          @click="open_confirm_modal($event, item)"
        >
          Adicionar ao carrinho
        </v-btn>
        <v-checkbox v-if="half" class="check-half"
          color="orange darken-3"
          @change="select_half(item)"
          v-model="item.half"
          :disabled="half_counter >= 2 && !item.half"
        ></v-checkbox>
      </v-list-tile>
    </template>
    <v-btn v-if="half"
      class="half-btn"
      style="margin-bottom: 10px;"
      color='warning'
      @click="open_confirm_half_modal($event)"
    > Adicionar ao Carrinho
    </v-btn>
    <div class="half-error">
      <label v-if="half && half_error">Selecione as duas metades da pizza</label>
    </div>
    <confirm-modal :product="selected_product" ref="confirm_modal"/>
    <confirm-half-modal :products="metades" :sumPrice="sumPrice" ref="confirm_half_modal"/>
  </v-list>
</template>

<script>

  import confirmModal from '~/components/confirm-modal.vue'
  import confirmHalfModal from '~/components/confirm-half-modal.vue'
  
  export default {
    components: {
      confirmModal,
      confirmHalfModal
    },
    props: ['items'],
    data () {
      return {
        selected_product: null,
        metades: null,
        half: false,
        half_counter: 0,
        half_error: false,
        sumPrice: 0
      }
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
      },
      open_confirm_half_modal (evt) {
        if (this.half_counter == 2) {
          this.half_error = false
          this.metades = this.getMetades()
          this.$refs.confirm_half_modal.open();
          evt.stopPropagation();
        } else {
          this.half_error = true
        }
      },
      select_half (pizza) {
        if (pizza.half) {
          if (this.half_counter < 2) {
            this.half_counter++;
            this.sumPrice += pizza.half_price
          } else {
            pizza.half = false
          }
        } else {
          this.half_counter--;
          this.sumPrice -= pizza.half_price
        }
      },
      open_confirm_modal (evt, item) {
        this.selected_product = item
        this.$refs.confirm_modal.open();
        evt.stopPropagation();
      },
      getMetades() {
        let metades = []
        this.items.forEach(element => {
          if (element.half) {
            metades.push(element)
          }
        });
        return metades
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

.half-btn {
  display: flex;
  width: 100%;
  margin-bottom: 50px;
}

.check-half {
  flex-direction: row-reverse;
}

.half-error {
  display: flex;
  color: red;
  width: 100%;
  justify-content: center;
}

</style>
