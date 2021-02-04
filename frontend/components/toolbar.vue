<template>
  <v-toolbar class="flex-toolbar" color="blue" dark fixed app >
    <!-- <v-toolbar-side-icon @click.stop="state.drawer = !state.drawer"></v-toolbar-side-icon> -->
    <v-toolbar-title class="title">
      <!-- <v-btn flat dark ripple :to="{name: 'index'}" >Hello Pizza</v-btn> -->
    </v-toolbar-title>
    <v-btn flat dark ripple absolute left v-if="!window_width" href="/admin"><v-icon>admin_panel_settings</v-icon></v-btn>
    <v-spacer></v-spacer>
    <router-link :to="{name: 'index'}"><img class="logo" src="../assets/images/hellopizza.png" alt="Hello Pizza"></router-link>
    <v-spacer></v-spacer>
    <v-btn flat dark ripple absolute right v-if="!window_width" @click="open_cart_modal($event)"><v-icon>shopping_cart</v-icon></v-btn>
    <v-icon @click="open_cart_modal($event)" class="mobile" v-if="window_width">shopping_cart</v-icon>
    <!-- <v-btn 
      dark 
      ripple
      fab
      flat
      class="mobile"
      color="black"
      v-if="window_width" 
      @click="open_cart_modal($event)">
        <v-icon>shopping_cart</v-icon>
    </v-btn> -->
    <!-- <v-btn v-if="!logged_user" class="admin-btn" flat href="../admin"><v-icon>admin_panel_settings</v-icon></v-btn> -->
    <!-- <v-menu v-if="logged_user" offset-y>
      <v-btn icon slot="activator" class="ma-0 ml-5">
        <v-avatar size="36px">
          <img src="https://graph.facebook.com/4/picture?width=300&height=300">
        </v-avatar>
      </v-btn>
      <v-card class="no-padding">
        <v-list two-line>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <v-avatar>
                <img src="https://graph.facebook.com/4/picture?width=300&height=300">
              </v-avatar>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{logged_user.first_name}} {{logged_user.last_name}}</v-list-tile-title>
              <v-list-tile-sub-title>{{logged_user.email}}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <v-list>
          <v-list-tile @click="switchMode()">
            <v-list-tile-content>
              <v-list-tile-title>Staff mode</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="logout()">
            <v-list-tile-content>
              <v-list-tile-title>Log out</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-menu> -->
    <!-- <v-toolbar-side-icon @click.stop="state.drawerRight = !state.drawerRight"></v-toolbar-side-icon> -->
    <login-dialog ref="login_dialog"/>
    <cart-modal ref="cart_modal"/>
  </v-toolbar>
</template>

<script>
  import Vuex from 'vuex'
  import loginDialog from '~/components/login-dialog.vue'
  import cartModal from '~/components/cart-modal.vue'
  import Snacks from '~/helpers/Snacks.js'
  import AppApi from '~apijs'
  export default {
    components: {
      loginDialog,
      cartModal
    },
    data () {
      return {
        window_width: false
      }
    },
    computed: {
    },
    props: ['state'],
    methods: {
      open_cart_modal (evt) {
        this.$refs.cart_modal.open();
        evt.stopPropagation();
      },
      logout(){
        AppApi.logout().then(()=>{
          this.$store.commit('SET_LOGGED_USER', null);
          Snacks.show(this.$store, {text: 'Até logo!'})
        });
      },
      clear_carrinho () {
        this.$store.commit('CLEAR_PEDIDO')
      },
      // window_width: function () {
      //   if (window.innerWidth <= 400) {
      //     return true
      //   } else {
      //     return false
      //   }
      // },
    },
    mounted () {
      if (window.innerWidth <= 470) {
        this.window_width = true
      } else {
        this.window_width = false
      }
    }
  }
</script>

<style>
  .admin-btn {
    padding: 0;
    margin: 0;
  }

  .flex-toolbar {
    display: flex;
    flex-grow: 1;
    justify-content: space-around;
    align-items: center;
  }

  .title {
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
  }

  .logo {
    align-self: center;
    justify-self: center;
    height: 50px;
  }

  .mobile {
    position: absolute;
    right: 15px;
  }

</style>