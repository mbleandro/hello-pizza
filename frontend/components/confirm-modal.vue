<template>
  <v-dialog v-model="visible" max-width="500px" persistent>
    <!-- <v-card>
      <v-card-title class="card-title">Deseja adicionar o produto ao pedido?</v-card-title>
      <v-card-text>
        <v-container class="flex" v-if="product" fluid>
            <div class="product-info">
                <div class="informations">
                  <p><label class="product-name">{{product.name}}</label></p>
                  <p><label>{{product.description}}</label></p>
                  <p><label class="product-price">R$ {{product.price | priceBR }}<label v-if="stuffed"> + R${{config.borda_price_str}}</label></label>
                    <v-checkbox
                      v-model="stuffed"
                      :label="`Borda Recheada + R$${config.borda_price_str}`"
                      color="success"
                      hide-details
                    ></v-checkbox>
                  </p>
                </div>
                <img class="product-image-modal" :src="product.photo">
            </div>
            <div style="flex-grow: 1;">
              <v-textarea
                outline
                label="Observações"
                v-model="product.obs"
                ></v-textarea>
            </div>
        </v-container>
      </v-card-text>
      <div class="flex-btns">
        <v-btn class="blue--text darken-1" flat @click="close()">Cancel</v-btn>
        <v-btn
            color="success"
            @click="add()"
            :loading="loading"
            :disabled="loading"
            >Adicionar ao Carrinho</v-btn>
      </div>
    </v-card> -->
    <v-card v-if="product">
        <v-card-title class="flex">
          <div class="card-title">
            <span class="product-name">{{product.name}}</span><br>
          </div>
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
        </v-card-title>
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
      stuffed: false,
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
      this.product.obs = ''
    },
    add() {
      this.$store.commit("ADD_TO_ORDER", {
        half: false,
        name: this.product.name,
        price: this.sum_price,
        photo: this.product.photo,
        description: this.product.description,
        obs: this.product.obs,
        edge: this.product.edge,
        quant: this.product.quant
      });
      this.$cookies.set("pedido", JSON.stringify(this.pedido));
      this.quant = 1
      this.product.obs = ''
      this.stuffed = false
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
    flex-direction: column;
    align-items: flex-start;
}

.flex-btns {
    display: flex;
    justify-content: space-between;
}

.informations {
  display: flex;
  flex-direction: column;
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
    display: flex;
    width: 100%;
    margin-top: 10px;
    flex-direction: column;
    align-items: center;
    font-size: 15px;
}

.product-price {
    font-weight: bold;
    color: green;
}

.product-description {
    margin-bottom: 0;
}

.add-remove-btn {
    width: 18px;
    height: 18px;
}

.product-info {
  display: flex;
  flex-direction: row;
}

.obs {
  width: 100%;
}

.obs-div {
  width: 95%;
  flex-grow: 1;
  margin: 10px;
}

</style>