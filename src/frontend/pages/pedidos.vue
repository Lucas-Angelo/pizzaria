<template>
  <v-row>
    <v-col>
      <!-- Buttons -->
      <v-row>
        <v-col>
          <v-btn
            class="btn-new"
            color="success"
            id="btnAddNewOrder"
            @click.stop="
              clearForm();
              dialog = true;
            "
          >
            Cadastrar novo pedido
          </v-btn>
        </v-col>
      </v-row>
      <!-- Lista -->
      <v-row>
        <!-- Pendente Column -->
        <v-col cols="12" :md="4">
          <v-row>
            <v-col>
              <span class="order-category order-category-pendente">
                Pendente
              </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <draggable
                :list="pizzaPendente"
                group="orders"
                @change="orderChange($event, 'PENDENTE')"
              >
                <transition-group class="order-list">
                  <order
                    class="order-item"
                    v-for="(element, eidx) in pizzaPendente"
                    :key="eidx"
                    :order="element"
                    @remove="cancelOrder(element)"
                    @moved="movedOrder($event, element)"
                  />
                </transition-group>
              </draggable>
              <span class="text-center" v-if="pizzaPendente.length == 0"
                >Nenhum pedido pendente.</span
              >
            </v-col>
          </v-row>
        </v-col>
        <!-- Producao Column -->
        <v-col cols="12" :md="4">
          <v-row>
            <v-col>
              <span class="order-category order-category-producao">
                Produção
              </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <draggable
                :list="pizzaProducao"
                group="orders"
                @change="orderChange($event, 'PRODUCAO')"
              >
                <transition-group class="order-list">
                  <order
                    class="order-item"
                    v-for="(element, eidx) in pizzaProducao"
                    :key="eidx"
                    :order="element"
                    @remove="cancelOrder(element)"
                    @moved="movedOrder($event, element)"
                  />
                </transition-group>
              </draggable>
              <span class="text-center" v-if="pizzaProducao.length == 0"
                >Nenhum pedido em produção.</span
              >
            </v-col>
          </v-row>
        </v-col>
        <!-- Concluido Column -->
        <v-col cols="12" :md="4">
          <v-row>
            <v-col>
              <span class="order-category order-category-concluido">
                Concluído
              </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <draggable
                :list="pizzaConcluido"
                group="orders"
                @change="orderChange($event, 'CONCLUIDO')"
              >
                <transition-group class="order-list">
                  <order
                    class="order-item"
                    v-for="(element, eidx) in pizzaConcluido"
                    :key="eidx"
                    :order="element"
                    @remove="cancelOrder(element)"
                    @moved="movedOrder($event, element)"
                  />
                </transition-group>
              </draggable>
              <span class="text-center" v-if="pizzaConcluido.length == 0"
                >Nenhum pedido concluído.</span
              >
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <!-- Pedido creation modal -->
    <v-dialog v-model="dialog" max-width="450">
      <v-card>
        <v-card-title class="text-h5"> Cadastrar novo pedido </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-radio-group v-model="formData.tipo" row mandatory>
              <v-radio label="Telefone" value="TELEFONE"></v-radio>
              <v-radio label="Presencial" value="PRESENCIAL"></v-radio>
            </v-radio-group>

            <v-text-field
              v-model="formData.cliente_nome"
              id="txtClienteNome"
              :rules="[
                (v) => !!v || 'Informe o nome do cliente!',
                (v) =>
                  (v && v.length <= 50) ||
                  'Nome do cliente deve ter menos de 50 caracteres',
              ]"
              label="Nome do Cliente"
              counter="50"
            />
            <v-autocomplete
              v-model="formData.pizza_id"
              :items="pizzas"
              :rules="[(v) => !!v || 'Informe a pizza!']"
              label="Pizza"
              no-data-text="Nenhuma pizza cadastrada..."
              item-text="descricao"
              item-value="id"
              id="txtPizzaNome"
            >
              <template v-slot:item="data">
                <v-list-item-content>
                  <img
                    :src="data.item.image_url"
                    style="max-width: 50px"
                    alt=""
                  />
                  &nbsp;{{ data.item.descricao }}
                </v-list-item-content>
              </template>
            </v-autocomplete>
            <v-text-field
              v-model="formData.valor"
              id="txtValor"
              :rules="[(v) => !!v || 'Preço é obrigatório!']"
              label="Preço"
              type="number"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn id="btnCancelar" text @click="dialog = false">
            Cancelar
          </v-btn>

          <v-btn id="btnSubmit" color="primary" @click="submit"> Criar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import draggable from "vuedraggable";
import order from "../components/Order.vue";
import Swal from "sweetalert2";
export default {
  name: "Pedidos",
  components: {
    draggable,
    order,
  },
  data() {
    return {
      pizzaPendente: [],
      pizzaProducao: [],
      pizzaConcluido: [],
      dialog: false,
      valid: true,
      formData: {
        valor: null,
        cliente_nome: null,
        pizza_id: null,
        tipo: "TELEFONE",
      },
      pizzas: [],
    };
  },
  async fetch() {
    this.pizzaPendente = [];
    this.pizzaProducao = [];
    this.pizzaConcluido = [];
    this.$axios.get("pedido?pagina=1&limite=200").then((res) => {
      res.data.data.forEach((element) => {
        switch (element.status) {
          case "PENDENTE":
            this.pizzaPendente.push(element);
            break;
          case "PRODUCAO":
            this.pizzaProducao.push(element);
            break;
          case "CONCLUIDO":
            this.pizzaConcluido.push(element);
            break;
        }
      });
    });
  },
  mounted() {
    this.$fetch();
    this.$axios
      .get("/pizza??pagina=1&limite=200&atributo=descricao&ordem=ASC")
      .then((res) => {
        this.pizzas = res.data.data;
      });
  },
  methods: {
    orderChange(evt, name) {
      if (evt.added) {
        this.$axios
          .put(`pedido/${evt.added.element.id}`, {
            status: name,
          })
          .then((res) => {
            evt.added.element.status = name;
          });
      }
    },
    cancelOrder(order) {
      Swal.fire({
        title: `Confirmar o cancelamento do pedido?`,
        text: "Você não conseguirá reverter essa ação!",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        reverseButtons: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sim quero cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$axios.delete(`pedido/${order.id}`).then((res) => {
            this.$fetch();
          });
        }
      });
    },
    movedOrder(status, element) {
      this.$axios
        .put(`pedido/${element.id}`, {
          status: status,
        })
        .then(() => {
          this.$fetch();
        });
    },
    clearForm() {
      this.formData = {
        valor: null,
        cliente_nome: null,
        pizza_id: null,
      };
      if (this.$refs.form) this.$refs.form.reset();
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.$axios.post("/pedido", this.formData).then(() => {
          this.$fetch();
          this.dialog = false;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.btn {
  &-new {
    float: right;
  }
}
.order {
  &-category {
    padding: 10px;
    display: block;
    width: 100%;
    &-pendente {
      background-color: rgb(219, 164, 80);
    }
    &-producao {
      background-color: rgb(55, 145, 187);
    }
    &-concluido {
      background-color: rgb(104, 192, 96);
    }
  }
  &-item {
    border: 2px solid #eee;
    border-radius: 3px;
    margin-bottom: 10px;
    padding: 10px;
    cursor: grab;
  }
  &-list {
    display: block;
    min-height: 200px;
  }
}
.text {
  &-center {
    text-align: center;
    display: block;
  }
}
</style>
