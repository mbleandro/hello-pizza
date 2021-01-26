<template>
  <carte :items="items"></carte>
</template>

<script>

import carte from '~/components/Carte.vue'

export default {
    props: ['items'],
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
