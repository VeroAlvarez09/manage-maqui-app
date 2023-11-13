<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Nuevo / editar</div>
                <div class="text-subtitle1">{{data.nombre}} {{data.apellidos}}</div>
              </div>
              <div class="col-auto">
                <q-btn color="grey-7" round flat icon="more_vert">
                  <q-menu cover auto-close>
                    <q-list>
                      <q-item clickable>
                        <q-item-section @click="back">Regresar</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            <q-form
              id="register"
              @submit="onSubmit"
              @reset="onReset"
              class="q-gutter-lg row"
            >

              <div class="col-12 col-md-5">
                <q-input
                  filled
                  type="text"
                  v-model="data.nombre"
                  label="Nombres *"
                  lazy-rules
                  :rules="[val => (val && val !== '') || 'Por favor ingrese el nombre.']"
                />
              </div>

              <div class="col-12 col-md-5">
                <q-input
                  filled
                  type="text"
                  v-model="data.apellidos"
                  label="Apellidos *"
                  lazy-rules
                  :rules="[val => (val && val !== '') || 'Por favor ingrese el apellido.']"
                />
              </div>

              <div class="col-12 col-md-5">
                <q-input
                  filled
                  type="number"
                  v-model="data.celular"
                  label="Celular *"
                  lazy-rules
                  :rules="[ val => (val && val !== '') || 'Por favor ingrese el celular.']"
                />
              </div>

              <div class="col-12 col-md-5">
                <q-input
                  :disable="data.id > 0"
                  filled
                  type="email"
                  v-model="data.email"
                  label="Email *"
                  lazy-rules
                  :rules="[ val => (val && val !== '') || 'Por favor ingrese el correo.']"
                />
              </div>

              <div class="col-12 col-md-5">
                <q-input
                  filled
                  type="password"
                  v-model="data.password"
                  label="Contraseña *"
                  lazy-rules
                  :rules="[
          val => (val  && val !== '') || 'Por favor ingrese su contraseña',
        ]"/>
              </div>
              <div class="col-12 col-md-5">
              </div>


              <q-card-section>
                <div class="q-pa-lg">
                  <q-btn label="Guardar" type="submit" color="green"/>
                  <q-btn label="Regresar" type="reset" color="primary" flat class="q-ml-sm" @click="back"/>
                </div>
              </q-card-section>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-1"/>
      <div class="col-12 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-h6">Acciones</div>
            <div class="text-subtitle1">Estas acciones no podran ser reversibles.</div>
          </q-card-section>
          <q-card-actions vertical>
            <q-btn flat @click="back">Regresar</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>

</template>

<script>
  import ServiceApi from "src/helpers/ServiceApi";
  import {Loading, Noty} from "../../mixins/index";

  export default {
    mounted() {
      this.onRequest();
    },
    mixins: [Loading, Noty],
    methods: {
      onRequest() {
        if (this.data.id > 0) {
          this.showLoading("consultando domiciliario...");
          ServiceApi.get("/domiciliary/get?id=" + this.data.id).then(response => {
            const {status, message, employee} = response.data;
            if (status) {
              this.data = employee;
            } else {
              this.Noty("error", message);
            }
            this.hideLoading();
          }).catch(error => {
            this.Noty("error", error.message);
            this.hideLoading();
          });
        }
      },
      onSubmit() {
        if (this.data.email && this.data.password && this.data.nombre && this.data.apellidos) {
          this.showLoading(this.data.id > 0 ? "Actualizando domiciliario....." : " Creando domiciliario...");
          ServiceApi.post("/domiciliary/set", this.data).then(response => {
            const {status, message} = response.data;
            if (status) {
              this.$router.push("/domiciliary")
            } else {
              this.Noty("error", message);
            }
            this.hideLoading();
          }).catch(error => {
            this.Noty("error", error.message);
            this.hideLoading();
          });
        } else {
          this.Noty("error", "Por favor llenar los campos obligatorios");
        }
      },
      onReset() {
        data.password = null
      },
      back() {
        this.$router.push('/domiciliary');
      },
    },
    data() {
      return {
        loading: true,
        data: {
          id: this.$router.history.current.params.id,
          nombre: null,
          apellidos: null,
          celular: null,
          email: null,
          password: null,
        },
      }
    }
  }
</script>
