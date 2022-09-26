<template>
  <div :class="getStatusBorderClass">
    <v-row v-if="order.pizza">
      <v-col :cols="2">
        <img :src="order.pizza.image_url" width="100%" alt="Pizza IMG" />
      </v-col>
      <v-col :cols="10">
        <small class="order-protocol">
            #{{ order.id}}
        </small>
        {{ order.pizza.descricao }} - {{ order.pizza.tamanho }}
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="btn-options" small text v-bind="attrs" v-on="on">
              <v-icon small> mdi-dots-horizontal </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-if="order.status != 'PENDENTE'"
              @click="$emit('moved', 'PENDENTE')"
            >
              <v-list-item-title>Mover Para Pendente</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="order.status != 'PRODUCAO'"
              @click="$emit('moved', 'PRODUCAO')"
            >
              <v-list-item-title>Mover Para Produção</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="order.status != 'CONCLUIDO'"
              @click="$emit('moved', 'CONCLUIDO')"
            >
              <v-list-item-title>Mover Para Concluído</v-list-item-title>
            </v-list-item>
            <v-list-item @click="$emit('remove')">
              <v-list-item-title>
                <span class="text-danger"> Cancelar Pedido </span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
    <hr class="order-line" />
    <v-row>
      <v-col> Cliente: {{ order.cliente_nome }} </v-col>
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
};
</script>

<style lang="scss">
.btn {
  &-options {
    float: right;
  }
}
.order {
  &-line{
    border: 1px solid rgb(240, 240, 240);
  }
  &-protocol{
    color: rgb(160, 160, 160);
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