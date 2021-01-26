<template>
  <div>
      <v-btn
          color="warning"
          dark
          @click="handleClick()"
        >
          Dialog Test
        </v-btn>
  </div>
</template>

<script>

export default {
  components: {},
  data () {
    return {}
  },
  methods: {
      handleClick(){
        this.$confirm(
            {
            message: `Are you sure?`,
            button: {
                no: 'No',
                yes: 'Yes'
            },
            /**
             * Callback Function
             * @param {Boolean} confirm 
             */
            callback: confirm => {
                if (confirm) {
                    console.log("CONFIRMA")
                }
            }
            }
        )
      }
  }
}
</script>

<style>
</style>
