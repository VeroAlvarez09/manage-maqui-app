<template>
  <q-card-section>
    <div class="q-pa-md top-right">
      <q-btn
        color="green"
        icon-right="add"
        label="Agregar sede"
        no-caps
        @click="openModal"
      />
    </div>
    <div class="row">
      <div
        class="col-12 col-md-6 q-pa-sm q-pt-lg"
        v-for="(camp, key) in dataCampus"
        :key="key"
      >
        <q-card class="my-card" flat bordered>
          <!--          <q-img src="https://cdn.quasar.dev/img/chicken-salad.jpg" />-->
          <q-card-section>
            <q-btn
              fab
              color="primary"
              icon="place"
              class="absolute"
              style="top: 0; right: 12px; transform: translateY(-50%);"
              @click="editCoordinates(camp)"
            />
            <div class="row no-wrap items-center">
              <div class="col text-h5 ellipsis">
                {{ camp.nombre }}
                <q-tooltip transition-show="rotate" transition-hide="rotate">
                  {{ camp.nombre }}
                </q-tooltip>
              </div>
              <div
                class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
                @click="navigation(camp)"
                style="cursor: pointer"
              >
                <q-icon name="place" />
                {{ camp.municipio }}
              </div>
            </div>
            {{ camp.direccion }}
            <div class="text-overline text-orange-9">{{ camp.contacto }}</div>
            <q-badge
              outline
              color="green"
              label="ACTIVO"
              v-if="camp.activo === 1"
            />
            <q-badge
              outline
              color="negative"
              label="INACTIVO"
              v-if="camp.activo === 0"
            />
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-subtitle2">
              {{ camp.nombre_encargado }} -
              <span class="text-grey"> {{ camp.contacto_encargado }} </span>
            </div>
            <div class="text-subtitle1">
              Confirmación:
              <span class="text-grey">{{ camp.numero_confirmacion }}</span>
            </div>
            <div class="text-caption text-grey">
              {{ camp.descripcion }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions vertical>
            <q-btn rounded color="primary" @click="edit(camp)">
              <q-btn flat round icon="create" />
              Editar
            </q-btn>
            <q-btn
              flat
              round
              color="dark"
              @click="editSchedule(camp.horarios_atencion, camp)"
            >
              <q-btn flat round icon="event" />
              Horario
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="open" :maximized="this.$q.platform.is.mobile">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            <q-btn flat round icon="keyboard_backspace" v-close-popup />
            Agregar sede
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="q-pa-lg">
            <q-form
              id="register"
              @submit="save"
              @reset="onReset"
              class="q-gutter-md row"
            >
              <div class="col-12 col-md-12">
                <q-input
                  filled
                  type="text"
                  v-model="campus.nombre"
                  label="Nombres sede*"
                  lazy-rules
                  :rules="[
                    val => (val && val !== '') || 'Por favor ingrese el nombre.'
                  ]"
                />
              </div>
              <div class="col-12 col-md-12">
                <q-select
                  v-model="campus.municipio"
                  :options="optionsMunicipios"
                  color="primary"
                  filled
                  clearable
                  label="Municipio *"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && val !== '') ||
                      'Por favor seleccione el municipio de la sede.'
                  ]"
                />
              </div>
              <div class="col-12 col-md-12">
                <q-input
                  filled
                  type="number"
                  maxlength="10"
                  v-model="campus.numero_confirmacion"
                  label="Número de confirmación *"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && val !== '') ||
                      'Por favor ingrese el número de whatsapp donde se confirmaran los pedidos para la sede.'
                  ]"
                />
              </div>
              <div class="col-12 col-md-12">
                <q-input
                  filled
                  type="number"
                  maxlength="10"
                  v-model="campus.contacto"
                  label="Número de contacto"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && val !== '') ||
                      'Por favor ingrese el número de contacto.'
                  ]"
                />
              </div>
              <div class="col-12 col-md-12">
                <q-input
                  filled
                  type="text"
                  v-model="campus.direccion"
                  label="Dirección *"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && val !== '') || 'Por favor ingrese la dirección.'
                  ]"
                />
              </div>
              <div class="col-12 col-md-12">
                <q-input
                  filled
                  type="text"
                  v-model="campus.nombre_encargado"
                  label="Encargado"
                />
              </div>
              <div class="col-12 col-md-12">
                <q-input
                  filled
                  type="number"
                  maxlength="10"
                  v-model="campus.contacto_encargado"
                  label="Contacto encargado"
                />
              </div>

              <q-toggle
                v-if="campus.id > 0"
                v-model="campus.activo"
                label="Activo"
                color="primary"
              />
              <div class="col-12 col-md-12">
                <q-input
                  filled
                  maxlength="20"
                  v-model="campus.latitud"
                  label="Latitud"
                />
              </div>
              <div class="col-12 col-md-12">
                <q-input
                  filled
                  maxlength="20"
                  v-model="campus.longitud"
                  label="Longitud"
                />
              </div>
              <div class="col-12 col-md-12">
                <q-input
                  filled
                  type="text"
                  v-model="campus.descripcion"
                  label="Descripción *"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && val !== '') || 'Por favor ingrese la descripcion.'
                  ]"
                />
              </div>

              <q-separator />

              <q-card-actions align="right">
                <q-btn
                  flat
                  label="Cancelar"
                  color="primary"
                  type="reset"
                  v-close-popup
                  :disable="loading"
                />
                <q-btn
                  label="Guardar"
                  type="submit"
                  color="green"
                  :disable="loading"
                  :loading="loading"
                />
              </q-card-actions>
            </q-form>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="openSchedule" :maximized="this.$q.platform.is.mobile">
      <q-layout view="Lhh lpR fff" container class="bg-white">
        <q-page-container>
          <q-page padding>
            <q-card style="max-width: 500px">
              <q-card-section>
                <div class="text-h6">
                  <q-btn flat round icon="keyboard_backspace" v-close-popup />
                  Modificar Horario sede
                </div>
              </q-card-section>

              <q-separator />

              <q-card-section>
                <div class="q-pa-md q-gutter-sm">
                  <q-card
                    v-for="(horario, dia) in horarios_atencion"
                    style="max-width: 500px;width: 100%"
                    :key="dia"
                  >
                    <q-card-section>
                      <div class="text-h6">
                        {{ dia }}
                        <q-toggle v-model="horario.visible" />
                      </div>
                    </q-card-section>
                    <q-separator />

                    <q-card-section>
                      <div class="q-pa-md">
                        <div class="q-gutter-sm row">
                          <q-input
                            filled
                            v-model="horario.desde"
                            mask="time"
                            :rules="['time']"
                          >
                            <template v-slot:append>
                              <q-icon name="access_time" class="cursor-pointer">
                                <q-popup-proxy
                                  transition-show="scale"
                                  transition-hide="scale"
                                >
                                  <q-time v-model="horario.desde" format24h>
                                    <div
                                      class="row items-center justify-end q-gutter-sm"
                                    >
                                      <q-btn
                                        label="Guardar"
                                        color="primary"
                                        flat
                                        v-close-popup
                                      />
                                    </div>
                                  </q-time>
                                </q-popup-proxy>
                              </q-icon>
                            </template>
                          </q-input>

                          <q-input
                            filled
                            v-model="horario.hasta"
                            mask="time"
                            :rules="['time']"
                          >
                            <template v-slot:append>
                              <q-icon name="access_time" class="cursor-pointer">
                                <q-popup-proxy
                                  transition-show="scale"
                                  transition-hide="scale"
                                >
                                  <q-time v-model="horario.hasta" format24h />
                                </q-popup-proxy>
                              </q-icon>
                            </template>
                          </q-input>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn
                  flat
                  label="Cancelar"
                  color="primary"
                  type="reset"
                  v-close-popup
                  :disable="loading"
                />
                <q-btn
                  label="Guardar"
                  type="submit"
                  color="green"
                  :disable="loading"
                  :loading="loading"
                  @click="updateSchedule(campus.id)"
                />
              </q-card-actions>
            </q-card>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>

    <client-detail-campus-coordinates
      :propsCampus="campus"
      :propsOpenCoordinates="openCoordinates"
      :closeOpenCoordinates="editCoordinates"
      v-if="openCoordinates"
    />
  </q-card-section>
</template>
<script>
import ServiceApi from "src/helpers/ServiceApi";
import { Loading, Noty } from "../../mixins/index";
import ClientDetailCampusCoordinates from "components/Clients/DetailCampusCoordinates";

export default {
  name: "ClientDetailCampus",
  components: { ClientDetailCampusCoordinates },
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
  props: { data: Object },
  methods: {
    onRequest() {
      this.showLoading("consultando comercios...");
      ServiceApi.get("/customers/list/campus?comercioId=" + this.id)
        .then(response => {
          const { status, message, campus, municipios } = response.data;
          if (status) {
            this.dataCampus = campus;
            this.optionsMunicipios = municipios;
          } else {
            this.Noty("error", message);
          }
          this.loading = false;
          this.hideLoading();
        })
        .catch(error => {
          this.Noty("error", error.message);
          this.hideLoading();
        });
    },
    onReset() {
      this.campus = {
        id: 0,
        comercio_id: this.data.id,
        nombre: "",
        municipio: "",
        contacto: "",
        direccion: "",
        nombre_encargado: "",
        contacto_encargado: "",
        numero_confirmacion: "",
        descripcion: "",
        activo: true
      };
    },
    save() {
      this.loading = true;
      ServiceApi.post("/customers/set/campus", this.campus)
        .then(response => {
          const { status, message, id, horarios_atencion } = response.data;
          if (status) {
            let data = this.dataCampus.find(x => x.id === this.campus.id);
            if (typeof data !== "undefined") {
              let index = this.dataCampus.findIndex(
                x => x.id === this.campus.id
              );
              let copy = Object.assign({}, this.campus);
              copy.activo = this.campus.activo ? 1 : 0;
              if (typeof this.campus.municipio === "object")
                copy.municipio = this.campus.municipio.label;
              if (!copy.horarios_atencion)
                copy.horarios_atencion = horarios_atencion;
              this.dataCampus[index] = copy;
            } else {
              let copy = Object.assign({}, this.campus, {
                id,
                horarios_atencion
              });
              if (typeof this.campus.municipio === "object")
                copy.municipio = this.campus.municipio.label;
              this.dataCampus.push(copy);
            }
          } else {
            this.Noty("error", message);
          }
          this.loading = false;
          this.open = false;
          this.onReset();
        })
        .catch(error => {
          this.loading = false;
          this.Noty("error", error.message);
          this.open = false;
        });
    },
    edit(campus) {
      let copy = Object.assign({}, campus);
      this.campus.comercio_id = this.data.id;
      this.campus = copy;
      this.campus.activo = copy.activo === 1;
      this.open = true;
    },
    editSchedule(schedule, campus) {
      this.campus = campus;
      schedule = typeof schedule === "object" ? schedule : JSON.parse(schedule);
      this.horarios_atencion = Object.assign({}, schedule);
      this.openSchedule = true;
    },
    editCoordinates(campus, open = true) {
      this.campus = campus;
      this.openCoordinates = open;
      let index = this.dataCampus.findIndex(x => x.id === campus.id);
      this.dataCampus[index] = Object.assign({}, this.dataCampus[index], {
        latitud: campus.latitud,
        longitud: campus.longitud
      });
    },
    updateSchedule(id) {
      this.loading = true;
      ServiceApi.post("/customers/set/campus/update/schedule", {
        horarios_atencion: this.horarios_atencion,
        id
      })
        .then(response => {
          const { status, message, horarios_atencion } = response.data;
          if (status) {
            let index = this.dataCampus.findIndex(x => x.id === id);
            this.dataCampus[index] = Object.assign({}, this.campus, {
              id,
              horarios_atencion
            });
            this.Noty("success", message);
          } else {
            this.Noty("error", message);
          }
          this.loading = false;
          this.openSchedule = false;
        })
        .catch(error => {
          this.Noty("error", error.message);
          this.loading = false;
          this.openSchedule = false;
        });
    },
    openModal() {
      this.open = true;
    },
    closeModal() {
      this.open = false;
    },
    navigation(campus) {
      window.open(
        "https://maps.google.com/?q=" + campus.latitud + "," + campus.longitud
      );
    }
  },
  data() {
    return {
      id: this.$router.history.current.params.id,
      loading: true,
      open: false,
      openSchedule: false,
      openCoordinates: false,
      optionsMunicipios: [
        {
          label: "CALDAS",
          value: 1
        }
      ],
      dataCampus: [],
      campus: {
        id: 0,
        comercio_id: this.data.id,
        nombre: "",
        municipio: "",
        contacto: "",
        direccion: "",
        nombre_encargado: "",
        contacto_encargado: "",
        numero_confirmacion: "",
        descripcion: "",
        activo: true
      },
      horarios_atencion: []
    };
  }
};
</script>
