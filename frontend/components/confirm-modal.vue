<template>
  <v-dialog v-model="visible" max-width="500px" persistent>
    <v-card>
      <v-card-title class="card-title">Deseja adicionar o produto ao pedido?</v-card-title>
      <v-card-text>
        <v-container class="flex" v-if="product" fluid>
            <div>
                <p><label class="product-name">{{product.name}}</label></p>
                <p><label class="product-description">{{product.description}}</label></p>
                <p><label class="product-price">R$ {{product.price | priceBR }}</label></p>
                <!-- <v-btn fab dark class="add-remove-btn" color="error">
                    <v-icon dark>remove</v-icon>
                </v-btn>
                {{quant}}
                <v-btn fab dark class="add-remove-btn" color="teal">
                    <v-icon dark>add</v-icon>
                </v-btn> -->
                
                <v-textarea
                outline
                label="Observações"
                v-model="obs"
                ></v-textarea>
            </div>
            <img class="product-image-modal" :src="product.photo">
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
    };
  },
  computed: {
    pedido: function () {
      return this.$store.getters.pedido;
    },
    total_price: function () {
      return this.$store.getters.total_price.toFixed(2).replace(".", ",");
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
      this.obs = ''
      console.log("Close");
    },
    add() {
      this.$store.commit("ADD_TO_ORDER", {
        name: this.product.name,
        price: this.product.price,
        photo: this.product.photo,
        description: this.product.description,
        obs: this.obs
      });
      this.$cookies.set("pedido", JSON.stringify(this.pedido));
      this.quant = 1
      this.obs = ''
      this.visible = false;
    },
  },
};
</script>

<style>

.flex {
    display: flex;
    padding: 0;
}

.flex-btns {
    display: flex;
    justify-content: space-between;
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
</style>