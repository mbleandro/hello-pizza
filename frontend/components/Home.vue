<template>
  <carte :items="items" :bordas="bordas"></carte>
</template>

<script>

import carte from '~/components/Carte.vue'

export default {
    props: ['items', 'bordas'],
    components: {
        carte
    },
    
    data () {
        return {}
    }
}
</script>

<style>
</style>
