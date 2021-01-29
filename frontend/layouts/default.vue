<template>
  <v-app id="inspire">
    <toolbar :state="layout"/>
    <!-- <sidenav-left :state="layout"/> -->
    <v-content>
      <v-container fluid>
        <nuxt></nuxt>
      </v-container>
    </v-content>
    <le-footer/>
    <v-snackbar
      :timeout="snack.timeout"
      :color="snack.color"
      bottom
      v-model="snack.visible"
    >
      {{snack.text}}
      <v-btn dark flat @click.native="snack.visible = false">Close</v-btn>
    </v-snackbar>
    <vue-confirm-dialog></vue-confirm-dialog>
  </v-app>
</template>

<script>
  import toolbar from '~/components/toolbar.vue'
  import footer from '~/components/footer.vue'
  import AppApi from '~apijs'
  export default {
    components: {
      toolbar,
      leFooter: footer
    },
    data: () => ({
      layout: {
        drawer: true,
      },
      config: {}
    }),
    mounted () {
      AppApi.get_config().then(result => {
        this.config = result.data
        this.config.frete = parseFloat(this.config.frete)
        this.config.borda_price = parseFloat(this.config.borda_price)
        this.config['frete_str'] = this.config.frete.toFixed(2).replace(".", ",")
        this.config['borda_price_str'] = this.config.borda_price.toFixed(2).replace(".", ",")
        this.$store.commit('SET_CONFIG', this.config)
        console.log("config: ", this.config)
      })
    },
    computed: {
      snack () {
        return this.$store.getters.snack
      }
    }
  }
</script>