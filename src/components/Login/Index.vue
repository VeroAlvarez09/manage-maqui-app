<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-slide-transition>
      <!--                 Login                  -->
      <q-card flat bordered class="my-card" v-if="!accept">
        <q-card-section>
          <div class="text-h6 row items-center justify-evenly">Iniciar session</div>
        </q-card-section>

        <q-card-section>
          <q-form
            id="login"
            @submit="onSubmit"
            @reset="onReset"
            class="q-gutter-lg"
          >
            <q-input
              filled
              type="email"
              v-model="email"
              label="Usuario *"
              hint="usuario o correo electrónico"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Por favor ingrese su usuario.']"
            />

            <q-input
              filled
              type="password"
              v-model="password"
              label="Contraseña *"
              lazy-rules
              :rules="[
          val => val !== null && val !== '' || 'Por favor ingrese su contraseña',
        ]"
            />

            <q-card-section>
              <div class="q-pa-lg">
                <q-btn label="Ingresar" type="submit" color="primary"/>
                <q-btn label="Cancelar" type="reset" color="primary" flat class="q-ml-sm"/>
              </div>
            </q-card-section>
          </q-form>
        </q-card-section>
      </q-card>
    </q-slide-transition>
  </div>
</template>

<script>
import {mapMutations} from "vuex";
import ServiceApi from "../../helpers/ServiceApi";
import {Loading, Noty} from "../../mixins/index";

export default {
  name: 'Login',
  data() {
    return {
      email: null,
      password: null,
      accept: false,
      code: null,
    }
  },
  mixins: [Loading, Noty],
  methods: {
    ...mapMutations(["SET_TOKEN", "SET_USER"]),
    onSubmit() {
      if (this.email && this.password) {
        const data = {email: this.email, password: this.password}
        this.showLoading("Validando usuario y contraseña...")
        ServiceApi.post("/user/login", data).then(response => {
          this.accept = true;
          const {token, user} = response.data
          this.SET_TOKEN(token.token);
          this.SET_USER(user);
          localStorage.setItem("token", token.token);
          localStorage.setItem("user", JSON.stringify(user));
          this.$router.push({path: '/'})
          this.Noty("success", "Bienvenido al administrador de Maqui App", "bottom")
          this.hideLoading();
        }).catch(error => {
          this.hideLoading();
          this.Noty("error", "Usuario o contraseña inválidos", "bottom")
        })
      } else {
        this.Noty("error", "Por favor ingrese los datos correctamente.", "bottom")
      }
    },
    onReset() {
      this.email = null
      this.password = null
      this.accept = false
    },
  }
}
</script>
