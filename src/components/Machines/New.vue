<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Nuevo / editar</div>
                <div class="text-subtitle1">{{ data.brand }} {{ data.serial }}</div>
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
              class="q-gutter-sm row"
            >

              <div class="col-12 col-md-5">
                <q-input
                  outlined
                  dense
                  type="text"
                  v-model="data.name"
                  label="Nombre *"
                  lazy-rules
                  :rules="[val => (val && val !== '') || 'Por favor ingrese el nombre.']"
                />
              </div>

              <div class="col-12 col-md-5">
                <q-input
                  outlined
                  dense
                  type="text"
                  v-model="data.brand"
                  label="Marca *"
                  lazy-rules
                  :rules="[val => (val && val !== '') || 'Por favor ingrese la marca.']"
                />
              </div>

              <div class="col-12 col-md-5">
                <q-input
                  outlined
                  dense
                  type="number"
                  v-model="data.model"
                  label="Modelo *"
                  lazy-rules
                  :rules="[val => (val && val !== '') || 'Por favor ingrese el modelo.']"
                />
              </div>

              <div class="col-12 col-md-5">
                <q-input
                  outlined
                  dense
                  :disable="data.id > 0"
                  v-model="data.serial"
                  label="Serial *"
                  lazy-rules
                  :rules="[ val => (val && val !== '') || 'Por favor ingrese el serial.']"
                />
              </div>

              <div class="col-12 col-md-5">
                <q-select
                  outlined
                  dense
                  :disable="data.id > 0"
                  v-model="data.idCompany"
                  :options="optionCompanies"
                  label="Empresa *"
                  class="col-md-5"
                  lazy-rules
                  :rules="[
                    val => (val && val.value !== '') || 'El campo es requerido.'
                  ]"
                >
                </q-select>
              </div>

              <div class="col-12 col-md-5">
                <q-input
                  outlined
                  dense
                  v-model="data.color"
                  label="Color *"
                  lazy-rules
                  :rules="[ val => (val && val !== '') || 'Por favor ingrese el color.']"
                />
              </div>

              <div class="col-12 col-md-5">
                <q-input
                  outlined
                  dense
                  prefix="$"
                  type="number"
                  v-model="data.valuePerHour"
                  label="Valor por hora *"
                  lazy-rules
                  :rules="[ val => (val && val !== '') || 'Por favor ingrese el valor por hora trabajada.']"
                />
              </div>

              <q-select
                outlined
                dense
                v-model="data.idStatus"
                :options="optionStatus"
                label="Estado *"
                class="col-md-5"
                lazy-rules
                :rules="[
                    val => (val && val.value !== '') || 'El campo es requerido.'
                  ]"
              >
              </q-select>

              <div class="col-12 col-md-5">
              </div>


              <q-card-section>
                <div class="q-pa-lg">
                  <q-btn label="Guardar" type="submit" color="warning"/>
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
        this.showLoading("consultando maquina...");
        ServiceApi.get(`/machine/${this.data.id}`).then(response => {
          console.log(response)
          const {data} = response;
          let company = this.optionCompanies.find(x => x.value === data.idCompany);
          let status = this.optionStatus.find(x => x.value === data.idCompany);
          this.data = {
            ...data,
            idCompany: company,
            idStatus: status,
          };
          this.hideLoading();
        }).catch(error => {
          this.Noty("error", error.message);
          this.hideLoading();
        });
      }
    },
    onSubmit() {
      this.showLoading(this.data.id > 0 ? "Actualizando maquina....." : " Creando maquina...");
      const url = this.data.id > 0 ? `/machine/${this.data.id}` : "/machine";
      let petition = this.data.id > 0 ? ServiceApi.put : ServiceApi.post;
      petition(url, {
        ...this.data,
        idCompany: this.data.idCompany.value,
      }).then(() => {
        this.$router.push("/machines")
        this.hideLoading();
      }).catch(error => {
        this.Noty("error", error.data.message);
        this.hideLoading();
      });
    },
    onReset() {
      this.data.password = null
    },
    back() {
      this.$router.push('/machines');
    },
  },
  data() {
    return {
      loading: true,
      data: {
        id: this.$router.history.current.params.id,
        name: null,
        brand: null,
        model: null,
        location: null,
        serial: null,
        color: null,
        valuePerHour: null,
        idCompany: null,
        idStatus: null
      },
      optionCompanies: [
        {label: "Inge rental S.A.S", value: 1},
      ],
      optionStatus: [
        {label: "Disponible", value: 1},
        {label: "Mantenimiento", value: 2},
        {label: "Ocupada", value: 3},
      ]
    }
  }
}
</script>
