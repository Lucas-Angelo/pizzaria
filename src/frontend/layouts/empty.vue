<template>
  <v-app dark>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  mounted: function() {
    let elHtml = document.getElementsByTagName('html')[0]
    elHtml.style.overflowY = 'hidden'
  },
  destroyed: function() {
    let elHtml = document.getElementsByTagName('html')[0]
    elHtml.style.overflowY = null
  },
  data () {
    return {
      clipped: false,
      drawer: false,
      items: [
        {
          icon: 'mdi-border-color',
          title: 'Pedidos',
          to: '/'
        },
        {
          icon: 'mdi-pizza',
          title: 'Pizzas',
          to: '/pizza'
        }
      ],
      title: 'Pizzaria Sem Nome'
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Secular+One&display=swap');
  .app{
    &-title{
      font-family: 'Secular One', sans-serif;
      color: rgb(209, 61, 61);
    }
  }
</style>