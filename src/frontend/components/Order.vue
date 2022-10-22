<template>
  <div :class="getStatusBorderClass">
    <v-row v-if="order.pizza">
      <v-col :cols="2">
        <img :src="order.pizza.image_url" width="100%" alt="Pizza IMG" />
      </v-col>
      <v-col :cols="10">
        <div class="order-description">
          <small class="order-protocol"> #{{ order.id }} </small>
          {{ order.pizza.descricao }} - {{ order.pizza.tamanho }}
          <p v-if="order.observacao">Obs: {{ order.observacao }}</p>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="btn-options" small text v-bind="attrs" v-on="on">
                <v-icon small> mdi-dots-horizontal </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                class="btn-move-pending"
                v-if="order.status != 'PENDENTE'"
                @click="$emit('moved', 'PENDENTE')"
              >
                <v-list-item-title>Mover Para Pendente</v-list-item-title>
              </v-list-item>
              <v-list-item
                class="btn-move-production"
                v-if="order.status != 'PRODUCAO'"
                @click="$emit('moved', 'PRODUCAO')"
              >
                <v-list-item-title>Mover Para Produção</v-list-item-title>
              </v-list-item>
              <v-list-item
                class="btn-move-done"
                v-if="order.status != 'CONCLUIDO'"
                @click="$emit('moved', 'CONCLUIDO')"
              >
                <v-list-item-title>Mover Para Concluído</v-list-item-title>
              </v-list-item>
              <v-list-item class="btn-order-cancel" @click="$emit('remove')">
                <v-list-item-title>
                  <span class="text-danger"> Cancelar Pedido </span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <small class="order-date"> {{ formatDate(order.created_at) }} </small>
        </div>
      </v-col>
    </v-row>
    <hr class="order-line" />
    <v-row>
      <v-col>
        <span>Cliente: {{ order.usuario.nome }}</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <span v-if="order.telefone">Logradouro: {{ order.logradouro }}</span>
      </v-col>
      <v-col>
        <span v-if="order.telefone">Telefone: {{ order.telefone }}</span>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["order"],
  computed: {
    getStatusBorderClass() {
      if (this.order.status == "PENDENTE") return "border-pendente";
      else if (this.order.status == "PRODUCAO") return "border-producao";
      else if (this.order.status == "CONCLUIDO") return "border-concluido";
    },
  },
  methods: {
    formatDate(date) {
      var inputDate = new Date(date);
      var todaysDate = new Date();
      var isToday = todaysDate.toDateString() == inputDate.toDateString();
      if (isToday)
        return `Hoje às ${inputDate
          .getHours()
          .toString()
          .padStart(2, "0")}:${inputDate
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
      else
        return `${inputDate.getDate().toString().padStart(2, "0")}/${inputDate
          .getMonth()
          .toString()
          .padStart(2, "0")}`;
    },
  },
};
</script>

<style lang="scss">
.btn {
  &-options {
    float: right;
  }
}
.order {
  &-line {
    border: 1px solid rgb(240, 240, 240);
  }
  &-protocol {
    color: rgb(160, 160, 160);
  }
  &-description {
    position: relative;
    min-height: 70px;
  }
  &-date {
    position: absolute;
    bottom: 0;
    right: 0;
    color: #333;
  }
}
.border {
  &-pendente {
    border-color: rgb(219, 164, 80) !important;
  }
  &-producao {
    border-color: rgb(55, 145, 187) !important;
  }
  &-concluido {
    border-color: rgb(104, 192, 96) !important;
  }
}
.text-danger {
  color: #ff5252 !important;
  caret-color: #ff5252 !important;
}
</style>
