<template>
    <v-app>
        <v-main>
            <v-container class="fill-height" fluid>
                <v-row align="center" justify="center" dense>
                    <v-col cols="12" sm="10" md="5" lg="5">
                        <v-card class="py-0" elevation="0">
                            <v-row class="py-4" align="center" justify="center">
                                <v-img
                                    max-width="25%"
                                    :src="image"
                                    alt="pizza"
                                ></v-img>
                                <h1 id="title">Sem nome</h1>
                            </v-row>

                            <v-card-text>
                                <v-form
                                    ref="formulario"
                                    @submit.prevent="handleSubmit"
                                >
                                    <v-text-field
                                        id="txtEmail"
                                        v-model="email"
                                        label="Login"
                                        name="email"
                                        prepend-inner-icon="mdi-account-circle"
                                        type="email"
                                        class="rounded-0"
                                        outlined
                                        placeholder="email@email.com"
                                        :rules="[rules.required]"
                                    ></v-text-field>

                                    <v-text-field
                                        id="txtSenha"
                                        ref="senha"
                                        v-model="senha"
                                        :error-messages="erroLogin"
                                        :append-icon="
                                            show1 ? 'mdi-eye' : 'mdi-eye-off'
                                        "
                                        :rules="[rules.required]"
                                        label="Senha"
                                        name="senha"
                                        prepend-inner-icon="mdi-lock"
                                        :type="show1 ? 'text' : 'password'"
                                        outlined
                                        class="rounded-0"
                                        @keypress.enter="handleSubmit"
                                        @click:append="show1 = !show1"
                                    ></v-text-field>

                                    <v-btn
                                        id="btnLogin"
                                        class="rounded-0 mt-2"
                                        color="#f54c5a"
                                        x-large
                                        block
                                        dark
                                        @click.native="handleSubmit"
                                    >
                                        Login
                                    </v-btn>

                                    <v-card-actions class="text--secondary">
                                        Não possui cadastro?<a
                                            id="linkCadastro"
                                            href="/cadastro"
                                            class="pl-2"
                                            style="color: #f54c5a"
                                            >Crie sua conta</a
                                        >
                                    </v-card-actions>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>


<script>
import image from "/static/pizza.png";
export default {
    layout: "empty",
    name: "Login",
    data() {
        return {
            email: "",
            senha: "",
            image: image,
            show1: false,
            erroLogin: null,
            rules: {
                required: (value) => !!value || "Obrigatório.",
            },
        };
    },
    mounted() {
       let local = JSON.parse(localStorage.getItem('user'));
       if(local){
        if(local.tipo=="ADMIN"){
            this.$router.push("/pedidos");
        }else{
            this.$router.push("/telacliente");
        }
       }
    },
    methods: {
        handleSubmit() {
            if (this.$refs.formulario.validate()) {
                document.cookie = `token=`;
                this.$axios
                    .post("/signin", {
                        email: this.email,
                        senha: this.senha,
                    })
                    .then((res) => {
                        console.log(res);
                        let local = {}
                        localStorage.setItem('user', JSON.stringify(local));
                        local = {
                            id: res.data.usuario.id,
                            email: res.data.usuario.email,
                            tipo: res.data.usuario.tipo
                        }
                        localStorage.setItem('user', JSON.stringify(local));
                        if(res.data.usuario.tipo=="ADMIN"){
                            this.$router.push("/pedidos");
                        }else{
                            this.$router.push("/telacliente");
                        }
                    })
                    .catch((err) => {
                        this.erroLogin = err.response.data.message;
                        if (err.response.status == 500) {
                            this.erroLogin = "Erro interno do servidor";
                        } else if (err.response.status == 403) {
                            this.erroLogin = "Senha incorreta";
                        }
                    });
            }
        },
    }
};
</script>

<style lang="css" scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap");
#title {
    font-size: 300%;
    font-family: "Roboto";
    color: #f54c5a;
    font-weight: 100;
}
</style>