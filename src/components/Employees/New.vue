<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Nuevo / editar</div>
                <div class="text-subtitle1">{{ data.name }} {{ data.lastName }}</div>
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
                  label="Nombres *"
                  lazy-rules
                  :rules="[val => (val && val !== '') || 'Por favor ingrese el nombre.']"
                />
              </div>

              <div class="col-12 col-md-5">
                <q-input
                  outlined
                  dense
                  type="text"
                  v-model="data.lastName"
                  label="Apellidos *"
                  lazy-rules
                  :rules="[val => (val && val !== '') || 'Por favor ingrese el apellido.']"
                />
              </div>

              <div class="col-12 col-md-5">
                <q-select
                  outlined
                  dense
                  v-model="data.docType"
                  :options="options"
                  label="Tipo documento"
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
                  v-model="data.document"
                  label="Documento *"
                  lazy-rules
                  :rules="[ val => (val && val !== '') || 'Por favor ingrese el documento.']"
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
                <q-select
                  outlined
                  dense
                  v-model="data.idMachine"
                  :options="optionMachines"
                  label="Maquina *"
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
                  :disable="data.id > 0"
                  outlined
                  dense
                  type="email"
                  v-model="data.email"
                  label="Email *"
                  lazy-rules
                  :rules="[ val => (val && val !== '') || 'Por favor ingrese el correo.']"
                />
              </div>

              <div class="col-12 col-md-5">
                <q-input
                  outlined
                  dense
                  type="password"
                  v-model="data.password"
                  label="Contraseña *"
                  lazy-rules
                  :rules="[val => (val  && val !== '') || 'Por favor ingrese su contraseña']"
                />
              </div>

              <div class="col-12 col-md-5">
                <q-input
                  outlined
                  dense
                  type="number"
                  prefix="$"
                  v-model="data.salary"
                  label="Salario *"
                  lazy-rules
                  :rules="[ val => (val && val !== '') || 'Por favor ingrese el salario.']"
                />
              </div>

              <div class="col-12 col-md-5">
                <q-input
                  outlined
                  dense
                  prefix="$"
                  type="number"
                  v-model="data.bonusValuePerHour"
                  label="Valor bonificación por hora *"
                  lazy-rules
                  :rules="[ val => (val && val !== '') || 'Por favor ingrese el valor de la bonificación por hora trabajada.']"
                />
              </div>

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
        this.showLoading("consultando empleado...");
        ServiceApi.get(`/employee/${this.data.id}`).then(response => {
          console.log(response)
          const {data} = response;
          let company = this.optionCompanies.find(x => x.value === data.idCompany);
          this.data = {
            ...data,
            idCompany: company
          };
          this.onRequestMachines(data.idMachine)
          this.hideLoading();
        }).catch(error => {
          this.Noty("error", error.message);
          this.hideLoading();
        });
      } else {
        this.onRequestMachines()
      }
    },
    onRequestMachines(idMachine = null) {
      this.showLoading("consultando maquinas...");
      ServiceApi.get(`/machine?page=${1},perPage=${10000}`, {})
        .then(response => {
          const {data} = response.data;
          let optionsMachines = [];
          data.map(machine => {
            optionsMachines.push({label: machine.brand, value: machine.id});
          })

          this.optionMachines = optionsMachines;
          if (idMachine) {
            let machine = optionsMachines.find(x => x.value === idMachine);
            this.data = {
              ...this.data,
              idMachine: machine
            };
          }
          this.hideLoading();
        })
        .catch(error => {
          this.hideLoading();
        });
    },
    onSubmit() {
      this.showLoading(this.data.id > 0 ? "Actualizando empleado....." : " Creando empleado...");
      const url = this.data.id > 0 ? `/employee/${this.data.id}` : "/employee";
      let petition = this.data.id > 0 ? ServiceApi.put : ServiceApi.post;
      petition(url, {
        ...this.data,
        docType: this.data.docType.value,
        idMachine: this.data.idMachine.value,
        idCompany: this.data.idCompany.value,
      }).then(() => {
        this.$router.push("/employees")
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
      this.$router.push('/employees');
    },
  },
  data() {
    return {
      loading: true,
      data: {
        id: this.$router.history.current.params.id,
        name: null,
        lastName: null,
        docType: null,
        document: null,
        email: null,
        password: null,
        salary: null,
        bonusValuePerHour: null,
        idMachine: null,
        idCompany: null
      },
      options: [
        {label: "Cédula de ciudadanía", value: "CC"},
        {label: "Cédula de extranjería", value: "CE"}
      ],
      optionCompanies: [
        {label: "Inge rental S.A.S", value: 1},
      ],
      optionMachines: []
    }
  }
}
</script>
