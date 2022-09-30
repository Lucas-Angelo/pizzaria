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
            Cadastrar novo Usuário
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
                  <th class="text-left">Email</th>
                  <th width="280px" class="text-left">Opções</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in usuarios" :key="item.name">
                  <td>{{ item.email }}</td>
                  <td>
                    <v-btn id="btnEdit" outlined small @click="edit(item)">
                      <v-icon small>mdi-square-edit-outline</v-icon>
                      Editar
                    </v-btn>
                    <v-btn id="btnDelete" outlined small color="error" @click="remove(item)">
                      <v-icon small>mdi-delete</v-icon>
                      Apagar
                    </v-btn>
                  </td>
                </tr>
                <tr v-if="usuarios.length == 0">
                  <td align="center" colspan="3">Sem dados cadastrados</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
      <!-- Usuario creation modal -->
      <v-dialog v-model="dialog" max-width="450">
        <v-card>
          <v-card-title class="text-h5">
            {{ formData.id ? "Editar" : "Criar nova" }} Usuário
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-if="!formData.id"
                v-model="formData.email"
                id="txtEmail"
                :rules="[
                  (v) => !!v || 'Email é obrigatório!',
                  (v) =>
                    (v && v.length <= 200) ||
                    'email deve ter menos de 200 caracteres',
                ]"
                label="Email"
                counter="200"
              />
              <v-text-field
                v-model="formData.senha"
                id="txtSenha"
                :rules="[
                  (v) => !!v || 'Senha é obrigatório!',
                  (v) =>
                    (v && v.length >= 8) ||
                    'Senha deve ter mais de 7 caracteres',
                ]"
                label="Senha"
              />
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn id="btnCancelar" text @click="dialog = false"> Cancelar </v-btn>

            <v-btn id="btnSubmit" color="primary" id="btnSubmit" @click="submit">
              {{ formData.id ? "Salvar" : "Criar" }}
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
  name: "Usuarios",
  data() {
    return {
      usuarios: [],
      usuarioPages: 1,
      dialog: false,
      formData: {
        senha: null
      },
      valid: true,
    };
  },
  async fetch() {
    this.$axios
      .get("/usuario?pagina=1&limite=5&atributo=email&ordem=DESC")
      .then((res) => {
        this.usuarios = res.data.data;
        this.usuarioPages = res.data.pages;
      });
  },
  mounted() {
    this.$fetch();
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        if (!this.formData.id)
          this.$axios.post("usuario", this.formData).then(() => {
            this.$fetch();
            this.dialog = false;
          });
        else
          this.$axios
            .put(`usuario/${this.formData.id}`, this.formData)
            .then(() => {
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
    async edit(usuario) {
      this.clearForm();
      this.formData = {
        id: usuario.id,
        email: usuario.email,
        senha: usuario.senha
      };
      this.dialog = true;
    },
    remove(usuario) {
      Swal.fire({
        title: `Apagar o usuário ${usuario.email} ?`,
        text: "Você não conseguirá reverter essa ação!",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        reverseButtons: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sim quero deletar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$axios
            .delete(`usuario/${usuario.id}`)
            .then(() => {
              this.$fetch();
              this.dialog = false;
              Swal.fire({
                position: "top-end",
                title: "Usuário removido!",
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
