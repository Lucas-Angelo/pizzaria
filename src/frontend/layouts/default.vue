<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :clipped="true" fixed app>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :id="'btnMenu' + i"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title
              @click="logout()"
              v-if="item.title == 'Sair'"
              class="app-text"
              v-text="item.title"
            />
            <v-list-item-title v-else class="app-text" v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="true" fixed app>
      <v-app-bar-nav-icon id="btnOpenMenu" @click.stop="drawer = !drawer" />
      <img width="30px" src="/pizza.png" alt="" />
      <v-toolbar-title class="app-title" v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "DefaultLayout",
  data() {
    return {
      clipped: false,
      drawer: false,
      items: [
        {
          icon: "mdi-border-color",
          title: "Pedidos",
          to: "/pedidos",
        },
        {
          icon: "mdi-pizza",
          title: "Pizzas",
          to: "/pizza",
        },
        {
          icon: "mdi-account",
          title: "Usuários",
          to: "/usuarios",
        },
        {
          icon: "mdi-chart-box",
          title: "Relatório",
          to: "/relatorio",
        },
        {
          icon: "mdi-logout",
          title: "Sair",
          to: "/login",
        },
      ],
      title: "PizzaPoint",
    };
  },
  methods: {
    logout() {
      let local = {};
      localStorage.setItem("user", JSON.stringify(local));
    },
  },
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Secular+One&display=swap");
.app {
  &-title {
    font-family: "Secular One", sans-serif;
    color: rgb(209, 61, 61);
  }
}
</style>
