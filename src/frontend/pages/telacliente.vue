<template>
  <v-row>
    <v-col>
      <!-- Buttons -->
      <v-row>
        <v-col>
          <v-btn
            class="btn-new"
            color="success"
            id="btnAddNewUser"
            @click.stop="
              clearForm();
              dialog = true;
            "
          >
            Fazer novo pedido
          </v-btn>
        </v-col>
      </v-row>
      <!-- Table -->
      <v-row>
        <v-col>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Pedido</th>
                  <th class="text-left">Valor</th>
                  <th class="text-left">Status</th>
                  <th width="280px" class="text-left">Opções</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in pedidosCliente" :key="item.name">
                  <td>{{ item.pizza.descricao }}</td>
                  <td v-if="checarDecimal(item.pizza.valor)">
                    R${{ item.pizza.valor }}
                  </td>
                  <td v-else>R${{ item.pizza.valor }}.00</td>
                  <td>{{ item.status }}</td>
                  <td>
                    <v-btn
                      id="btnDelete"
                      outlined
                      small
                      color="error"
                      @click="remove(item)"
                    >
                      <v-icon small>mdi-delete</v-icon>
                      Cancelar
                    </v-btn>
                  </td>
                </tr>
                <tr v-if="pedidosCliente.length == 0">
                  <td align="center" colspan="3">
                    Você ainda não fez nenhum pedido
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
      <!-- Usuario creation modal -->
      <v-dialog v-model="dialog" max-width="450">
        <v-card>
          <v-card-title class="text-h5"> Cadastrar novo pedido </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-radio-group
                id="radioPedidoTipo"
                v-model="formData.tipo"
                row
                mandatory
              >
                <v-radio label="Telefone" value="TELEFONE"></v-radio>
                <v-radio label="Presencial" value="PRESENCIAL"></v-radio>
              </v-radio-group>
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
                v-model="formData.telefone"
                label="Telefone"
                :rules="[
                  formData.tipo == 'TELEFONE'
                    ? (v) => !!v || 'Informe o telefone!'
                    : null,
                  (v) =>
                    (v || '').length < 10 ||
                    'Telefone deve conter no máximo 9 caracteres',
                ]"
                id="txtTelefone"
              />

              <v-text-field
                v-model="formData.logradouro"
                label="Logradouro"
                :rules="[
                  formData.tipo == 'PRESENCIAL'
                    ? (v) => !!v || 'Informe o logradouro!'
                    : null,
                  (v) =>
                    (v || '').length < 255 ||
                    'Logradouro deve conter no máximo 255 caracteres',
                ]"
                id="txtLogradouro"
              />

              <v-textarea
                v-model="formData.observacao"
                label="Observação"
                :rules="[(v) => !!v || 'Digite uma observação!']"
                id="txtObservacao"
              />
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn id="btnCancelar" text @click="dialog = false">
              Cancelar
            </v-btn>

            <v-btn id="btnSubmit" color="primary" @click="submit">
              Criar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import Swal from "sweetalert2";
export default {
  name: "PedidosCliente",
  layout: "cliente",
  data() {
    return {
      usuario: {
        usuarioId: null,
      },
      pedidos: [],
      pedidosCliente: [],
      detalhePedidos: [],
      pedidosPages: 1,
      pizzas: [],
      dialog: false,
      formData: {
        usuario_id: null,
        valor: null,
        cliente_nome: null,
        pizza_id: null,
        tipo: "TELEFONE",
      },
      valid: true,
    };
  },
  async fetch() {
    this.$axios
      .get("/pedido?pagina=1&limite=100&atributo=id&ordem=ASC")
      .then((res) => {
        this.pedidosPage = res.data.page;
        this.pedidosCliente = [];
        this.buscarPedidosUsuario(res.data.data);
        this.buscarPizzas();
      });
  },

  mounted() {
    this.buscarCliente();
    this.$fetch();
  },
  methods: {
    buscarCliente() {
      if (localStorage.getItem("user") !== null) {
        let local = JSON.parse(localStorage.getItem("user"));
        this.usuario.usuarioId = local.id;
      } else {
        this.$router.push("/login");
      }
    },
    buscarPedidosUsuario(pedidos) {
      for (let i = 0; i < pedidos.length; i++) {
        if (pedidos[i].usuario_id == this.usuario.usuarioId) {
          this.pedidosCliente.push(pedidos[i]);
        }
      }
    },
    buscarPizzas() {
      this.$axios
        .get("/pizza?pagina=1&limite=200&atributo=descricao&ordem=ASC")
        .then((res) => {
          this.pizzas = res.data.data;
        });
    },
    checarDecimal(value) {
      let split = value.toString().split(".");
      if (split.length > 1) {
        return true;
      }
      return false;
    },
    submit() {
      this.formData.name = this.usuario.name;
      this.formData.usuario_id = this.usuario.usuarioId;
      if (this.$refs.form.validate()) {
        this.$axios.post("/pedido", this.formData).then(() => {
          this.$fetch();
          this.dialog = false;
        });
      }
    },
    clearForm() {
      this.formData = {
        senha: null,
      };
      if (this.$refs.form) this.$refs.form.reset();
    },
    remove(pedido) {
      Swal.fire({
        title: `Deseja cancelar a pizza de ${pedido.pizza.descricao} ?`,
        text: "Você não conseguirá reverter essa ação!",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        reverseButtons: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sim quero cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$axios
            .delete(`pedido/${pedido.id}`)
            .then(() => {
              this.$fetch();
              this.dialog = false;
              Swal.fire({
                position: "top-end",
                title: "Pedido Cancelado!",
                showConfirmButton: false,
                timer: 1500,
              });
            })
            .catch(() => {
              Swal.fire({
                icon: "error",
                position: "top-end",
                title: "Houve um erro ao remover o usuário!",
                showConfirmButton: true,
              });
            });
        }
      });
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
</style>
