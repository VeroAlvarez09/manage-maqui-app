<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Nuevo / editar</div>
                <div class="text-subtitle1">{{data.nombre}} {{data.apellido}}</div>
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
                <q-select
                  v-model="data.tipo_documento"
                  :options="optionsDocumentsType"
                  color="primary"
                  filled
                  clearable
                  label="Tipo documento *"
                  lazy-rules
                  :rules="[val => (val && val !== '') || 'Por favor seleccione el municipio de la sede.']"
                />
              </div>
              <div class="col-12 col-md-5">
                <q-input
                  :disable="this.$router.history.current.params.id !== '0'"
                  filled
                  type="text"
                  v-model="data.documento"
                  label="Documento *"
                  lazy-rules
                  :rules="[val => (val && val !== '') || 'Por favor ingrese el documento.']"
                />
              </div>

              <div class="col-12 col-md-5">
                <q-input
                  filled
                  type="text"
                  v-model="nombre"
                  label="Nombres *"
                  lazy-rules
                  :rules="[val => (val && val !== '') || 'Por favor ingrese el nombre.']"
                />
              </div>

              <div class="col-12 col-md-5">
                <q-input
                  filled
                  type="text"
                  v-model="apellido"
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
                  filled
                  type="text"
                  v-model="data.razon_social"
                  label="Razon social *"
                  lazy-rules
                  :rules="[val => (val && val !== '') || 'Por favor ingrese la razón social.']"
                />
              </div>

              <div class="col-12 col-md-5">
                <q-input
                  filled
                  type="number"
                  v-model="data.por_ganancia"
                  label="Porcentaje de ganancia *"
                  lazy-rules
                  :rules="[ val => (val && val > 0) || 'Por favor ingrese el porcentaje de ganancia.']"
                />
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
    name: "ZonePartnerNew",
    mounted() {
      this.onRequest();
    },
    mixins: [Loading, Noty],
    methods: {
      onRequest() {
        if (this.data.documento > 0) {
          this.showLoading("consultando socio...");
          ServiceApi.get("/zone/partners/get?documento=" + this.data.documento).then(response => {
            const {status, message, zonePartner} = response.data;
            if (status) {
              this.nombre = zonePartner.nombre;
              this.apellido = zonePartner.apellido;
              this.data = zonePartner;
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
        this.showLoading(this.data.documento > 0 ? "Actualizando socio....." : " Creando socio...");
        ServiceApi.post("/zone/partners/set", this.data).then(response => {
          const {status, message} = response.data;
          if (status) {
            this.$router.push('/zone/partners');
          } else {
            this.Noty("error", message);
          }
          this.hideLoading();
        }).catch(error => {
          this.Noty("error", error.message);
          this.hideLoading();
        });
      },
      onReset() {
        this.data = {
          tipo_documento: null,
          documento: this.$router.history.current.params.id,
          nombre: null,
          apellidos: null,
          razon_social: null,
          celular: null,
          por_ganancia: null
        }
      },
      back() {
        this.$router.push('/zone/partners');
      },
    },
    data() {
      return {
        loading: true,
        optionsDocumentsType: [{
          label: 'Cédula',
          value: "CC"
        }, {
          label: 'NIT',
          value: "NIT"
        },
        ],
        nombre: "",
        apellido: "",
        data: {
          tipo_documento: null,
          documento: this.$router.history.current.params.id !== "0" ? this.$router.history.current.params.id : "",
          nombre: null,
          apellido: null,
          razon_social: null,
          celular: null,
          por_ganancia: null
        },
      }
    },
    watch: {
      nombre: function (val) {
        this.data.nombre = val;
        if (this.data.tipo_documento && this.data.tipo_documento.value === "CC") {
          this.data.razon_social = val + " " + this.apellido;
        }
      },
      apellido: function (val) {
        this.data.apellido = val
        if (this.data.tipo_documento && this.data.tipo_documento.value === "CC") {
          this.data.razon_social = this.nombre + " " + val;
        }
      }
    }
  }
</script>
