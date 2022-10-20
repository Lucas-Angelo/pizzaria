<template>
  <v-container>
    <!-- filtros -->
    <v-toolbar flat>
      <v-row>
        <v-col cols="12" sm="10">
          <v-text-field
            v-model="search"
            id="txtPesquisa"
            label="Pesquisa"
            filled
            rounded
            dense
            solo
            flat
            background-color="grey lighten-3"
            @keypress.enter.stop="findPizza"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="2">
          <v-btn id="btnPesquisar" @click="findPizza">
            <v-icon> mdi-filter </v-icon> Pesquisar
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
    <!-- total -->
    <v-toolbar class="pl-0 mt-n5" flat>
      <h4>{{ total }}</h4>
      <h4 class="grey--text text-lighten-1 ml-2">Pizzas encontradas</h4>
    </v-toolbar>

    <!-- Card pizzas -->
    <v-row>
      <v-col cols="12" sm="4" v-for="item in pizzas" :key="item.name">
        <v-hover v-slot="{ hover }" open-delay="200">
          <v-card color="red lighten-5" :elevation="hover ? 16 : 2">
            <div class="d-flex flex-column justify-space-between align-center">
              <v-img
                :src="item.image_url"
                max-height="180"
                max-widht="180"
              ></v-img>
            </div>
            <v-app-bar flat color="rgba(0,0,0,0)">
              <h5 class="ml-1 grey--text text-lighten-3">
                {{ item.descricao }}
              </h5>
              <v-chip
                class="ma-2"
                color="grey lighten-3"
                text-color="red"
                dense
              >
                {{ item.tamanho }}
              </v-chip>
            </v-app-bar>
            <h5 class="ml-5 mt-n5">{{ item.valor }} R$</h5>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <v-row v-if="pizzasPages > 1">
      <v-col>
        <div class="text-center">
          <v-pagination
            id="listPaginacao"
            v-model="pagina"
            :length="pizzasPages"
            @input="this.$fetch()"
          ></v-pagination>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: "cliente",
  name: "Pizzas",
  data() {
    return {
      search: null,
      pizzas: [],
      total: 0,
      pagina: 1,
      pizzasPages: 1,
      hover: false,
    };
  },
  async fetch() {
    this.$axios
      .get(
        `/pizza?pagina=${this.pagina}&limite=100&atributo=descricao&ordem=ASC`
      )
      .then((res) => {
        this.pizzas = res.data.data;
        this.pizzasPages = res.data.pages;
        this.total = res.data.total;
      });
  },
  mounted() {
    this.$fetch();
  },
  methods: {
    findPizza(){
      this.$axios
        .get(
          `/pizza?pagina=${this.pagina}&limite=100&atributo=descricao&ordem=ASC&descricao=${this.search}`
        )
        .then((res) => {
          this.pizzas = res.data.data;
          this.pizzasPages = res.data.pages;
          this.total = res.data.total;
        });
    }
  },
};
</script>

<style lang="scss" scoped>
.btn {
  &-new {
    float: right;
  }
}
</style>
