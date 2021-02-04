<template>
  <v-dialog v-model="visible" max-width="500px" persistent>
    <v-card>
      <v-card-title class="card-title" v-for="(product, index) in product.pizzas" :key=index>
        <label class="product-name">Meia {{product.name}}</label>
      </v-card-title>
      <label class="price">Preço da Pizza: R$ {{product.price | priceBR}}</label>
      <label class="price" v-if="product.edge && product.edge.id"> Borda: {{product.edge.recheio}} + R${{product.edge.price | priceBR}}</label>
      <label class="price" v-if="product.quant > 1"> Quantidade: x {{product.quant}}</label>
      <label class="price" v-if="product.quant > 1 || (product.edge && product.edge.id)"> Preço total: R$ {{sum_price | priceBR }}</label>
      <div class="obs-div">
        <v-textarea
          class="obs"
          outline
          label="Observações"
          v-model="product.obs"
          ></v-textarea>
      </div>
      <div class="flex-btns">
        <v-btn class="blue--text darken-1" flat @click="close()">Cancel</v-btn>
        <v-btn
            color="success"
            @click="add()"
            :loading="loading"
            :disabled="loading"
            >Adicionar ao Carrinho</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["product"],
  data() {
    console.log("data");
    return {
      visible: false,
      loading: false,
      obs: '',
      quant: 1,
      stuffed: false
    };
  },
  computed: {
    pedido: function () {
      return this.$store.getters.pedido;
    },
    total_price: function () {
      return this.$store.getters.total_price.toFixed(2).replace(".", ",");
    },
    config: function () {
      let _config = this.$store.getters.config;
      return this.$store.getters.config;
    },
    sum_price: function () {
      let _price = 0
      if (this.product.edge && this.product.edge.id) {
        _price = (this.product.price + this.product.edge.price) * this.product.quant
      } else {
        _price = this.product.price * this.product.quant
      }
      return _price
    }
  },
  methods: {
    open() {
      this.visible = true;
    },
    close() {
      this.visible = false;
      this.quant = 1
      this.product.obs = ''
    },
    add() {
      this.$store.commit("ADD_TO_ORDER", {
        half: true,
        price: this.sum_price,
        edge: this.product.edge,
        obs: this.product.obs,
        quant: this.product.quant,
        0: {
          name: this.product.pizzas[0].name,
          price: this.product.pizzas[0].price,
          photo: this.product.pizzas[0].photo,
          description: this.product.pizzas[0].description
        },
        1: {
          name: this.product.pizzas[1].name,
          price: this.product.pizzas[1].price,
          photo: this.product.pizzas[1].photo,
          description: this.product.pizzas[1].description
        }
      });
      this.$cookies.set("pedido", JSON.stringify(this.pedido));
      this.quant = 1
      this.product.obs = ''
      this.visible = false;
    },
  },
};
</script>

<style>

.flex {
    display: flex;
    padding: 0;
    flex-wrap: wrap;
}

.flex-btns {
    display: flex;
    justify-content: space-between;
}

.informations {
  display: flex;
  flex-direction: column;
  margin-right: 10px;
}

.product-image-modal {
  height: 130px;
  margin-right: 0px;
  border-radius: 10%;
  border: 1px solid black;
}

.product-name {
  font-weight: bold;
  font-size: 25px;
  font-family: 'Times New Roman', Times, serif, cursive;
}

.card-title {
    justify-content: center;
    font-size: 15px;
    padding: 0;
}

.product-price {
    font-weight: bold;
    color: green;
}

.add-remove-btn {
    width: 18px;
    height: 18px;
}

.product-info {
  display: flex;
  flex-direction: row;
  min-height: 148px;
}

.stuffed {
  display: flex;
  justify-content: center;
  margin-top: 0;
}

.price {
  display: block;
  font-size: 20px;
  font-weight: bold;
  justify-content: center;
  text-align: center;
  color: green;
  margin-top: 10px;
}

.obs {
  width: 100%;
}
</style>