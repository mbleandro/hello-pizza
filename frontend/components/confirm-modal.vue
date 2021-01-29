<template>
  <v-dialog v-model="visible" max-width="500px" persistent>
    <v-card>
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
                <!-- <v-btn fab dark class="add-remove-btn" color="error">
                    <v-icon dark>remove</v-icon>
                </v-btn>
                {{quant}}
                <v-btn fab dark class="add-remove-btn" color="teal">
                    <v-icon dark>add</v-icon>
                </v-btn> -->
                
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
    }
  },
  methods: {
    open() {
      this.visible = true;
      console.log("Open");
    },
    close() {
      this.visible = false;
      this.quant = 1
      this.product.obs = ''
      this.stuffed = false
      console.log("Close");
    },
    add() {
      let _price = 0
      if (this.stuffed) {
        _price = this.product.price + this.config.borda_price
      } else {
        _price = this.product.price
      }
      this.$store.commit("ADD_TO_ORDER", {
        half: false,
        name: this.product.name,
        price: _price,
        photo: this.product.photo,
        description: this.product.description,
        obs: this.product.obs,
        stuffed: this.stuffed
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
    justify-content: center;
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

</style>