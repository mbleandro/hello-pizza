<template>
  <v-dialog v-model="visible" max-width="500px">
    <v-card 
      max-width="450"
      class="mx-auto"
      v-model="visible"
    >
      <v-toolbar
        color="cyan"
        dark
      >
        <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->

        <v-toolbar-title>Carrinho</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn @click="close()" icon>
          X
        </v-btn>
      </v-toolbar>

      <v-list two-line>
        <template class="flex" v-for="(item) in pedido">
            <v-list-tile
              :key="item.title"
              avatar
            >
            <v-list-tile-avatar>
              <img v-if="!item.half" :src="item.photo">
              <img v-if="item.half" src="../assets/images/default.img.png">
            </v-list-tile-avatar>
            <v-list-tile-content v-if="!item.half">
              <v-list-tile-title>{{item.name}}</v-list-tile-title>
              <v-list-tile-sub-title>{{item.obs}}</v-list-tile-sub-title>
              <label>R$ {{item.price | priceBR}}<label v-if="item.stuffed"> (Borda Recheada)</label></label>
            </v-list-tile-content>
            <v-list-tile-content v-if="item.half">
              <v-list-tile-title style="font-size: 15px;">1:{{item[0].name}} / 2:{{item[1].name}}</v-list-tile-title>
              <v-list-tile-sub-title v-if="item[0].obs">1: {{item[0].obs}}</v-list-tile-sub-title>
              <v-list-tile-sub-title v-if="item[1].obs">2: {{item[1].obs}}</v-list-tile-sub-title>
              <label>R$ {{item.price | priceBR}}<label v-if="item.stuffed"> (Borda Recheada)</label></label>
            </v-list-tile-content>
            <v-btn
              color="error"
              dark
              @click="remove(item)"
            >
              Remover
            </v-btn>
          </v-list-tile>
        </template>
      </v-list>
      <div class="modal-footer">
        <v-btn class="blue--text darken-1 cancel-button" flat @click="close()">Cancel</v-btn>
        <label class="price">R$ {{total_price}}</label>
        <v-btn style="justify-content: flex-end" color="success" :to="{name: 'finish-order'}" @click="close()">FINALIZAR COMPRA</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data: () => ({
      visible: false,
      loading: false,
      error: false,
    }),
    methods: {
        open(){
            this.visible = true;
            console.log('Open');
        },
        close(){
            this.visible = false;
            console.log('Close');
        },
        remove(item) {
          console.log("Remove : ", item);
          this.$store.commit('REMOVE_FROM_ORDER', item)
          this.$cookies.set("pedido", JSON.stringify(this.pedido))
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
      },
      config: function () {
        let _config = this.$store.getters.config;
        return this.$store.getters.config;
      }
    }
  }
</script>

<style>
  .flex {
    display: flex;
  }

  .cancel-button {
    align-self: flex-start;
  }

  .price {
    align-self: center;
    font-weight: bold;
    color: black;
    font-size: 20px;
  }

  .modal-footer {
    display: flex;
    justify-content: space-between;
  }
</style>
