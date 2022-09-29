<template>
    <!--Container-->
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="12" md="7" lg="6">
                <v-card width="100%" style="padding: 2vh">
                    <v-card-title
                        ><h2><b>Cadastro</b></h2></v-card-title
                    >

                    <v-card-text
                        class="register-card-text"
                        style="padding: 5vh"
                    >
                        <v-form ref="user" lazy-validation autocomplete="off">
                            <v-row>
                                <v-col cols="12" sm="12">
                                    <v-text-field
                                        id="txtEmail"
                                        v-model="user.email"
                                        dense
                                        hide-details="auto"
                                        label="Email"
                                        placeholder="Insira seu email"
                                        outlined
                                        :rules="[
                                            (value) =>
                                                !!value || 'Email é obrigatório'
                                        ]"
                                    ></v-text-field>
                                </v-col>
                                <!--SENHA-->
                                <v-col cols="12" sm="12">
                                    <v-text-field
                                        id="txtSenha"
                                        v-model="user.senha"
                                        dense
                                        :append-icon="
                                            show1 ? 'mdi-eye' : 'mdi-eye-off'
                                        "
                                        :rules="[
                                            (value) =>
                                                !!value ||
                                                'Senha é obrigatória',
                                            rules.min,
                                        ]"
                                        :type="show1 ? 'text' : 'password'"
                                        label="Senha"
                                        hint="Mínimo 8 caracteres"
                                        hide-details="auto"
                                        outlined
                                        @click:append="show1 = !show1"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row class="mt-n3">
                                <v-col cols="12" sm="12">
                                    <v-checkbox
                                        id="checkbox"
                                        v-model="user.agree"
                                        :rules="[
                                            (v) =>
                                                !!v ||
                                                'Você deve aceitar os termos',
                                        ]"
                                    >
                                        <template #label>
                                            <div>
                                                Eu li e concordo com os
                                                <v-tooltip bottom>
                                                    <template
                                                        #activator="{ on }"
                                                    >
                                                        <a
                                                            target="_blank"
                                                            href="https://vuetifyjs.com"
                                                            @click.stop
                                                            v-on="on"
                                                        >
                                                            termos
                                                        </a>
                                                    </template>
                                                    Abrir em nova janela
                                                </v-tooltip>
                                                de privacidade
                                            </div>
                                        </template>
                                    </v-checkbox>
                                </v-col>
                            </v-row>
                        </v-form>
                        <!--BOTAO-->
                        <v-row no-gutters>
                            <v-flex align-self-center>
                                <v-btn
                                id="btnCreateUser"
                                    large
                                    block
                                    color="#f54c5a"
                                    @click="createUser"
                                >
                                    <h3>Cadastrar</h3>
                                </v-btn>
                                <div class="text-center mt-1">
                                    <p>
                                        Já possuí uma conta?
                                        <a @click="redirectToLogin()">
                                            Entre
                                        </a>
                                    </p>
                                </div>
                            </v-flex>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import Swal from "sweetalert2";
export default {
    layout: "empty",
    data() {
        return {
            show1: false,
            show2: false,
            redirect: false,
            user: {
                name: "",
                senha: "",
                agree: false,
            },
            rules: {
                min: (v) => {
                    if (v && v.length >= 8) return true;
                    else return "Min 8 chars";
                }
            },
        };
    },
    methods: {
        createUser() {
            if (this.$refs.user.validate()) {
                this.$axios
                    .post("/usuario", this.user)
                    .then((res) => {
                        if (res.data?.id > 0) {
                            Swal.fire({
                                title: "Success!",
                                text: "User registered successfully!",
                                icon: "success",
                                showConfirmButton: false,
                                toast: true,
                                position: "top-end",
                                timer: 3000,
                                timerProgressBar: true,
                            });
                            this.redirect = true;
                        }
                        this.cleanData();
                        this.$router.push("/login");
                    })
                    .catch((err) => {
                        Swal.fire({
                            title: "Error!",
                            text: err.response.data.message,
                            icon: "error",
                            showConfirmButton: false,
                            toast: true,
                            position: "top-end",
                            timer: 3000,
                            timerProgressBar: true,
                        });
                    });
            }
        },
        cleanData() {
            this.user = {
                name: "",
                senha: "",
                agree: false,
            };
            this.$refs.user.reset();
        },
        redirectToLogin() {
            this.$router.push("/login");
        },
    },
};
</script>
<style scoped>
@media only screen and (max-width: 700px) {
    .register-card-text {
        /* background-color: lightblue; */
        padding: 1vh !important;
    }
}
</style>