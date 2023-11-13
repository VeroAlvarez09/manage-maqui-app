<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="row items-center no-wrap q-gutter-md">
              <q-avatar
                v-if="data.imagen"
                rounded
                size="100px"
                font-size="82px"
                text-color="white"
              >
                <img :src="data.imagen"
              /></q-avatar>
              <div class="col">
                <div class="text-subtitle1">
                  {{ data.nombre }} {{ data.apellidos }}
                </div>
                <q-chip
                  outline
                  :color="data.activo === 1 ? 'green' : 'red'"
                  text-color="white"
                  :icon="data.activo === 1 ? 'check' : 'close'"
                >
                  {{ data.activo === 1 ? "Activo" : "Inactivo" }}
                </q-chip>
              </div>
              <q-btn push color="primary" @click="activeInactive"
                >Activar/Inactivar</q-btn
              >
              <div class="col-auto">
                <q-btn color="grey-7" round flat icon="more_vert">
                  <q-menu cover auto-close>
                    <q-list>
                      <q-item clickable>
                        <q-item-section @click="edit">Editar</q-item-section>
                      </q-item>
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
            <div class="row justify-center">
              <div class="col-12 col-md-4" v-for="(value, key) in data">
                <div
                  v-if="
                    key !== 'token_notification' &&
                      key !== 'imagen' &&
                      key !== 'activo' &&
                      key !== 'confirmacion_token'
                  "
                >
                  <strong>{{ key | capitalize }}</strong>
                  <p>{{ value }}</p>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions>
            <!--              <q-btn color="green">Guardar</q-btn>-->
            <q-btn flat @click="back">Regresar</q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-12 col-md-1" />
      <div class="col-12 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-h6">Acciones</div>
            <div class="text-subtitle1">
              Estas acciones no podran ser reversibles.
            </div>
          </q-card-section>
          <q-card-actions vertical>
            <q-btn color="secondary" @click="edit">Editar</q-btn>
            <br />

            <br />
            <q-btn flat @click="back">Regresar</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import ServiceApi from "src/helpers/ServiceApi";
import { Loading, Noty } from "../../mixins/index";

export default {
  mounted() {
    this.onRequest();
  },
  filters: {
    capitalize: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  mixins: [Loading, Noty],
  methods: {
    edit() {
      this.$router.push("/domiciliary/new/" + this.id);
    },
    back() {
      this.$router.push("/domiciliary");
    },
    activeInactive() {
      this.showLoading("actualizando domiciliario...");
      ServiceApi.post("/domiciliary/active/inactive", { id: this.id })
        .then(response => {
          const { status, message, domiciliary } = response.data;
          if (status) {
            this.data = domiciliary;
            this.Noty("success", message);
            this.onRequest();
          } else {
            this.Noty("error", message);
          }
          this.hideLoading();
        })
        .catch(error => {
          this.Noty("error", error.message);
          this.hideLoading();
        });
    },
    onRequest() {
      this.showLoading("consultando domiciliario...");
      ServiceApi.get("/domiciliary/get?id=" + this.id)
        .then(response => {
          const { status, message, domiciliary } = response.data;
          if (status) {
            this.data = domiciliary;
          } else {
            this.Noty("error", message);
          }
          this.hideLoading();
        })
        .catch(error => {
          this.Noty("error", error.message);
          this.hideLoading();
        });
    }
  },
  data() {
    return {
      id: this.$router.history.current.params.id,
      loading: true,
      data: {}
    };
  }
};
</script>
