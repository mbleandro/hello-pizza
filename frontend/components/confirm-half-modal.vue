<template>
  <v-dialog v-model="visible" max-width="500px" persistent>
    <v-card>
      <v-card-title class="card-title">Deseja adicionar o produto ao pedido?</v-card-title>
      <v-card-text>
        <v-container class="flex" fluid v-for="(product) in products" :key=product.id>
            <div class="product-info">
              <div class="informations">
                <p><label class="product-name">Meia {{product.name}}</label></p>
                <p><label class="product-description">{{product.description}}</label></p>
                <p><label class="product-price">R$ {{product.half_price | priceBR }}</label></p>
              </div>
                <!--<v-btn fab dark class="add-remove-btn" color="error">
                    <v-icon dark>remove</v-icon>
                </v-btn>
                {{quant}}
                <v-btn fab dark class="add-remove-btn" color="teal">
                    <v-icon dark>add</v-icon>
                </v-btn> -->
                <img class="product-image-modal" :src="product.photo">
            </div>
            <v-textarea
                outline
                auto-grow
                label="Observações"
                v-model="product.obs"
                rows="1"
                row-height="10"
                ></v-textarea>
        </v-container>
      </v-card-text>
      <v-checkbox
        class="stuffed"
        v-model="stuffed"
        :label="`Borda Recheada + R$${config.borda_price_str}`"
        color="success"
        hide-details
      ></v-checkbox>
      <label class="price">Preço da Pizza: R$ {{sumPrice | priceBR}}<label v-if="stuffed"> + R${{config.borda_price_str}}</label></label>
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
  props: ["products", "sumPrice"],
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
  },
  methods: {
    open() {
      this.visible = true;
      console.log("Open");
    },
    close() {
      this.visible = false;
      this.quant = 1
      this.products[0].obs = ''
      this.products[1].obs = ''
      console.log("Close");
    },
    add() {
      let _price = 0
      if (this.stuffed) {
        _price = this.sumPrice + this.config.borda_price
      } else {
        _price = this.sumPrice
      }
      this.$store.commit("ADD_TO_ORDER", {
        half: true,
        price: _price,
        stuffed: this.stuffed,
        0: {
          name: this.products[0].name,
          price: this.products[0].price,
          photo: this.products[0].photo,
          description: this.products[0].description,
          obs: this.products[0].obs
        },
        1: {
          name: this.products[1].name,
          price: this.products[1].price,
          photo: this.products[1].photo,
          description: this.products[1].description,
          obs: this.products[1].obs
        }
      });
      this.$cookies.set("pedido", JSON.stringify(this.pedido));
      this.quant = 1
      this.products[0].obs = ''
      this.products[1].obs = ''
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
  width: 265px;
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
}
</style>