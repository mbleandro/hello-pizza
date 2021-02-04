<template>
  <v-footer color="blue" class="white--text" app>
    <span>{{config.site_name}}</span>
    <v-spacer></v-spacer>
    <span>&copy; {{config.year}}</span>
  </v-footer>
</template>

<script>
  export default {
    props: ['state'],
    computed: {
      config: function () {
        return this.$store.getters.config;
      },
    }
  }  
</script>