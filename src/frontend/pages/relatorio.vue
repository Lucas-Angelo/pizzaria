<template>
  <v-row>
    <v-col>
      <!-- Filtros -->
      <v-row>
        <!-- Data Inicio -->
        <v-col cols="12" sm="6" md="2" lg="2">
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="dateBegin"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                id="txtDataInicio"
                v-model="computedDateFormattedBegin"
                label="Data Início"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="dateBegin" scrollable :max="maxDate">
              <v-spacer></v-spacer>
              <v-btn id="btnDataInicioCancel" text color="primary" @click="modal = false">
                Cancelar
              </v-btn>
              <v-btn id="btnDataInicioOk" text color="primary" @click="$refs.dialog.save(dateBegin)">
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <!-- Data Fim -->
        <v-col cols="12" sm="6" md="2" lg="2">
          <v-dialog
            ref="dialog2"
            v-model="modal2"
            :return-value.sync="dateEnd"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                id="txtDataFim"
                v-model="computedDateFormattedEnd"
                label="Data Final"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="dateEnd" scrollable :max="maxDate">
              <v-spacer></v-spacer>
              <v-btn id="btnDataFimCancel" text color="primary" @click="modal2 = false">
                Cancelar
              </v-btn>
              <v-btn id="btnDataFimOk" text color="primary" @click="$refs.dialog2.save(dateEnd)">
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <!-- Status -->
        <v-col cols="12" sm="6" md="6" lg="3">
          <small>Status</small>
          <v-radio-group id="radioPedidoTipo" v-model="tipo" row style="margin: 0">
            <v-radio id="radioPendente" label="Pendente" value="PENDENTE"></v-radio>
            <v-radio id="radioProducao" label="Produção" value="PRODUCAO"></v-radio>
            <v-radio id="radioConcluido" label="Concluido" value="CONCLUIDO"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12" sm="6" md="2" lg="3">
          <br>
          <v-btn id="btnPesquisar" color="primary" @click="changeContent">
            <v-icon>mdi-magnify</v-icon>
            Pesquisar
          </v-btn>
        </v-col>
      </v-row>
      <!-- Tabela -->
      <v-row>
        <v-col>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Cliente</th>
                  <th class="text-left">Status</th>
                  <th class="text-left">Tipo</th>
                  <th class="text-left">Pizza</th>
                  <th width="80px" class="text-left">Tamanho</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in orders" :key="item.name">
                  <td>{{ item.cliente_nome }}</td>
                  <td>{{ capitalizeFirstLetter(item.status) }}</td>
                  <td>{{ capitalizeFirstLetter(item.tipo) }}</td>
                  <td>{{ item.pizza.descricao }}</td>
                  <td>{{ item.pizza.tamanho }}</td>
                  <td>{{ formatDate(item.created_at) }}</td>
                </tr>
                <tr v-if="orders.length == 0">
                  <td align="center" colspan="3">Sem dados cadastrados</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <p class="float-right">Total de Itens: {{ orders.length }}</p>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      dateBegin: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      dateEnd: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      tipo: "CONCLUIDO",
      modal: false,
      modal2: false,
      orders: [],
      maxDate: new Date().toISOString().split('T')[0]
    };
  },
  computed: {
    computedDateFormattedBegin() {
      return this.formatDateOnly(this.dateBegin);
    },
    computedDateFormattedEnd() {
      return this.formatDateOnly(this.dateEnd);
    },
  },
  mounted(){
    this.changeContent()
  },
  methods: {
    formatDateOnly(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    changeContent(){
      let dtStart = new Date(this.dateBegin).toISOString().split('T')[0]
      let dtEnd = new Date(this.dateEnd).toISOString().split('T')[0]
      this.$axios.get(`pedido?pagina=1&limite=500&status=${this.tipo}&created_at_start=${dtStart} 00:00&created_at_end=${dtEnd} 23:59`).then((res) => {
        this.orders = res.data.data
      });
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    },
    formatDate(date){
      var inputDate = new Date(date);
      let data1 = inputDate.toISOString().split('T')[0]
      let data2 = inputDate.toISOString().split('T')[1].split('.')[0]
      return `${data1.split('-').reverse().join('/')} ${data2}`
    }
  },
};
</script>

<style>
</style>