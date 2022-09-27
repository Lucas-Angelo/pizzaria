<template>
  <v-row>
    <v-col>
      <!-- Buttons -->
      <v-row>
        <v-col>
          <v-btn
            class="btn-new"
            color="success"
            @click.stop="
              clearForm();
              dialog = true;
            "
          >
            Cadastrar nova Pizza
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
                  <th width="60px" class="text-left"></th>
                  <th class="text-left">Nome</th>
                  <th width="80px" class="text-left">Tamanho</th>
                  <th width="280px" class="text-left">Opções</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in pizzas" :key="item.name">
                  <td>
                    <img
                      :src="item.image_url"
                      width="50px"
                      height="50px"
                      alt=""
                    />
                  </td>
                  <td>{{ item.descricao }}</td>
                  <td>{{ item.tamanho }}</td>
                  <td>
                    <v-btn outlined small @click="edit(item)">
                      <v-icon small>mdi-square-edit-outline</v-icon>
                      Editar
                    </v-btn>
                    <v-btn outlined small color="error" @click="remove(item)">
                      <v-icon small>mdi-delete</v-icon>
                      Apagar
                    </v-btn>
                  </td>
                </tr>
                <tr v-if="pizzas.length == 0">
                  <td align="center" colspan="3">Sem dados cadastrados</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
      <!-- Pizza creation modal -->
      <v-dialog v-model="dialog" max-width="450">
        <v-card>
          <v-card-title class="text-h5">
            {{ formData.id ? "Editar" : "Criar nova" }} Pizza
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-if="!formData.id"
                v-model="formData.descricao"
                :rules="[
                  (v) => !!v || 'Nome é obrigatório!',
                  (v) =>
                    (v && v.length <= 45) ||
                    'Nome deve ter menos de 45 caracteres',
                ]"
                label="Nome"
                counter="45"
              />
              <label>Tamanho</label>
              <br />
              <v-btn-toggle v-model="formDataTamanho">
                <v-btn v-for="(t, tidx) in tamanhos" :key="tidx">
                  {{ t }}
                </v-btn>
              </v-btn-toggle>
              <br />
              <v-text-field
                v-model="formData.image_url"
                :rules="[
                  (v) => !!v || 'URL da foto é obrigatório!',
                  (v) =>
                    (v && v.length <= 200) ||
                    'Foto deve ter menos de 200 caracteres',
                ]"
                label="URL da Imagem"
                counter="200"
              />
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text @click="dialog = false"> Cancelar </v-btn>

            <v-btn color="primary" @click="submit">
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
  name: "Pizzas",
  data() {
    return {
      pizzas: [],
      pizzasPages: 1,
      dialog: false,
      tamanhos: ["35CM", "45CM", "60CM"],
      formDataTamanho: 0,
      formData: {
        descricao: null,
        tamanho: null,
        image_url: null,
      },
      valid: true,
    };
  },
  async fetch() {
    this.$axios
      .get("/pizza??pagina=1&limite=100&atributo=descricao&ordem=ASC")
      .then((res) => {
        this.pizzas = res.data.data;
        this.pizzasPages = res.data.pages;
      });
  },
  mounted() {
    this.$fetch();
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.formData.tamanho = this.tamanhos[this.formDataTamanho];
        if (!this.formData.id)
          this.$axios.post("pizza", this.formData).then(() => {
            this.$fetch();
            this.dialog = false;
          });
        else
          this.$axios
            .put(`pizza/${this.formData.id}`, this.formData)
            .then(() => {
              this.$fetch();
              this.dialog = false;
            });
      }
    },
    clearForm() {
      this.formDataTamanho = 0;
      this.formData = {
        descricao: null,
        tamanho: null,
        image_url: null,
      };
      if (this.$refs.form) this.$refs.form.reset();
    },
    async edit(pizza) {
      await this.clearForm();
      this.formDataTamanho = this.tamanhos.indexOf(pizza.tamanho);
      this.formData = {
        id: pizza.id,
        descricao: pizza.descricao,
        tamanho: pizza.tamanho,
        image_url: pizza.image_url,
      };
      this.dialog = true;
    },
    remove(pizza) {
      Swal.fire({
        title: `Apagar a pizza ${pizza.descricao} ?`,
        text: "Você não conseguirá reverter essa ação!",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        reverseButtons: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sim quero deletar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$axios
            .delete(`pizza/${pizza.id}`)
            .then(() => {
              this.$fetch();
              this.dialog = false;
              Swal.fire({
                position: "top-end",
                title: "Pizza removida!",
                showConfirmButton: false,
                timer: 1500,
              });
            })
            .catch(() => {
              Swal.fire({
                icon: "error",
                position: "top-end",
                title: "Houve um erro ao remover a pizza!",
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
