<template>
  <v-list>
    <v-btn 
      class="half-btn"
      v-bind:color=" half ? 'warning' : ''"
      @click="half = !half"
    >
      Selecionar meia pizza
    </v-btn>
    <template v-for="(item, index) in items">
      <v-card class="card" :key="index">
        <!-- <v-btn v-if="!half"
          color="warning"
          dark
          fab
          right
          absolute
          class="add-btn"
          @click="open_confirm_modal($event, item)"
        >
          <v-icon>add_shopping_cart</v-icon>
        </v-btn> -->
        <div  class="list"
          :key="index"
        >
          <div class="product-image">
            <img class="image" :src="item.photo">
          </div>
          <v-list-tile-content class="list-item">
            <label v-if="item.fake_price" class="fake-price">R$ {{item.fake_price | priceBR}}</label>
            <label>R$ {{item.price | priceBR}}</label>
          </v-list-tile-content>
        </div>
        <div class="item-info" >
            <label class="item-name">{{item.name}}</label>
            <label>{{item.description}}</label>
            <v-checkbox v-if="half" class="check-half"
                color="orange darken-3"
                @change="select_half(item)"
                v-model="item.half"
                :disabled="half_counter >= 2 && !item.half"
            ></v-checkbox>
        </div>
        <v-select 
          v-if="!half"
          return-object
          class="select"
          :items="bordas"
          label="Borda Recheada"
          item-text="recheio"
          v-model="item.edge"
          solo
        ></v-select>
        <!-- <select v-model="item.edge" class="select">
          <option :value="null">
              Sem recheio
          </option>
          <option v-for="(bord, index) in bordas" :value="bord" :key="index">
              {{ bord.recheio }}
          </option>
        </select> -->
        <div class="quant" v-if="!half"><v-icon @click="remove_quant(item)">remove</v-icon> <h3>{{item.quant}}</h3> <v-icon @click="add_quant(item)">add</v-icon></div>
        <v-divider v-if="!half" class="mx-4"></v-divider>
        <v-card-actions v-if="!half" class="card-actions">
          <v-btn class="add-btn" color="orange darken-3" @click="open_confirm_modal($event, item)"><v-icon>add_shopping_cart</v-icon></v-btn>
        </v-card-actions>
        <!--<v-card-actions v-if="half" class="half-checkbox">
           <v-checkbox v-if="half" class="check-half"
              color="orange darken-3"
              @change="select_half(item)"
              v-model="item.half"
              :disabled="half_counter >= 2 && !item.half"
          ></v-checkbox> 
        </v-card-actions>-->
        
      </v-card>
    </template>
    <v-card>
      <v-select 
        v-if="half"
        return-object
        class="select"
        :items="bordas"
        label="Borda Recheada"
        item-text="recheio"
        v-model="half_pizza.edge"
        solo
      ></v-select>
      <div class="quant" v-if="half"><v-icon @click="remove_quant(half_pizza)">remove</v-icon> {{half_pizza.quant}} <v-icon @click="add_quant(half_pizza)">add</v-icon></div>
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
    </v-card>
    <confirm-modal :product="selected_product" ref="confirm_modal"/>
    <confirm-half-modal :product="half_pizza" :sumPrice="sumPrice" ref="confirm_half_modal"/>
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
    props: ['items', 'bordas'],
    data () {
      return {
        selected_product: null,
        metades: null,
        half: false,
        half_counter: 0,
        half_error: false,
        sumPrice: 0,
        half_pizza: {
          edge: null,
          quant: 1,
          pizzas: [],
          obs: '',
          price: 0
        }
      }
    },
    methods: {
      // add_to_cart(item){
      //   this.$store.commit('ADD_TO_ORDER', {name: item.name, price: item.price, photo: item.photo, description: item.description})
      // },
      add_to_cart(item){
        this.$confirm(
            {
              message: `Adicionar ${item} ao carrinho?`,
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

                      this.$store.commit('ADD_TO_ORDER', {
                        name: item.name, 
                        price: item.price, 
                        photo: item.photo, 
                        description: item.description, 
                        quant: item.quant,
                        edge: item.edge})
                      this.$cookies.set("pedido", JSON.stringify(this.pedido))
                  }
              }
            }
        )
      },
      open_confirm_half_modal (evt) {
        if (this.half_counter == 2) {
          this.half_error = false
          this.half_pizza.price = this.sumPrice
          this.half_pizza.pizzas = this.getMetades()
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
      },
      add_quant(item) {
        item.quant++;
      },
      remove_quant(item) {
        if (item.quant > 1) {
          item.quant--;
        }
      }
    },
    computed: {
      pedido: function() {
        return this.$store.getters.pedido
      },
      total_price: function() {
        return this.$store.getters.total_price.toFixed(2).replace('.',',')
      }
    },
    mounted() {
      if (this.pedido && this.pedido.length == 0) {
        if(this.$cookies.get('pedido')) {
          this.$store.commit("SET_PEDIDO", JSON.parse(this.$cookies.get('pedido')))
        }
      }
    },
  }
</script>



<style>

.list {
  height: 110px;
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: column;
  background-color: lightblue;
  justify-content: center;
}

.card {
  height: 280px;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-info {
  display: flex;
  flex-direction: column;
  padding-left: 26px;
  padding-top: 10px;
  font-size: 15px;
}

.product-image {
  height: 100%;
  margin-right: 50px;
  display: flex;
  align-items: center;
}

.image {
  height: 110px;
  max-width: 160px;
}

.list-item {
  height: 200%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 30px;
  color: green;
  font-family: 'Times New Roman', Times, serif, cursive;
  font-weight: bold;
  margin-right: 30px;
  /* position: absolute;
  right: 40px; */
}
.item-name {
  font-weight: bold;
  font-size: 20px;
}

.half-btn {
  display: flex;
  width: 100%;
  margin-bottom: 50px;
}

.check-half {
  flex-direction: row-reverse;
  position: absolute;
  right: 10px;
  bottom: 5px;
  /* justify-content: center; */
}

.half-error {
  display: flex;
  color: red;
  width: 100%;
  justify-content: center;
}

.add-btn {
  flex-grow: 1;
}

.card-actions {
  padding: 0;
}

.fake-price {
  font-size: small;
  font-weight: normal;
  color: black;
  text-decoration: line-through;
}

.select {
  height: 50px;
}

.quant {
  display: flex;
  justify-content: space-around;
  margin-bottom: 7px;
  margin-top: 7px;
}

.v-input__control {
  height: 50px;
}

.half-checkbox {
  display: flex;
  height: 50px;
  justify-content: center;
}

</style>
