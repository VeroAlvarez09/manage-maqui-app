<template>
  <q-layout view="lHh lpr lFf" class="shadow-2 rounded-borders">
    <q-card flat bordered class>
      <q-card-section>
        <div class="text-h6">Servicios de entrega</div>
      </q-card-section>
      <q-card-section class="q-gutter-md">
        <q-btn flat round icon="refresh" @click="getServicios()">
          <q-tooltip content-class="bg-primary">Actualizar</q-tooltip>
        </q-btn>
      </q-card-section>
      <q-separator inset></q-separator>
      <q-card-section>
        <div class="q-gutter-md">
          <template>
            <div class="row justify-end items-center q-gutter-md">
              <div>
                <q-input
                  outlined
                  dense
                  debounce="300"
                  v-model="filter"
                  placeholder="Buscar servicio"
                >
                  <template v-slot:append>
                    <q-icon name="search" v-if="filter === ''" />
                    <q-icon
                      v-if="filter !== ''"
                      name="close"
                      @click="filter = ''"
                      class="cursor-pointer"
                    />
                  </template>
                </q-input>
              </div>
            </div>
          </template>
          <template>
            <div class="row justify-end">
              <q-pagination
                v-model="page"
                :max="pagination.totalPage"
                :direction-links="true"
                :boundary-links="true"
                :maxPages="2"
                icon-first="skip_previous"
                icon-last="skip_next"
                icon-prev="fast_rewind"
                icon-next="fast_forward"
              ></q-pagination>
            </div>
          </template>
          <q-list
            bordered
            class="rounded-borders"
            v-for="(item, k) in servicios"
            :key="k"
          >
            <q-item class="items-center animated fadeIn">
              <q-item-section top>
                <q-item-label class="ft">
                  <span class="text-weight-medium"
                    ><div class="items-center text-grey q-pr-sm">
                      {{ item.created_at | hourFormat }}
                      -
                      {{ item.created_at | diffDate(date) }}
                      <q-icon name="timer" /></div
                  ></span>
                </q-item-label>
                <q-item-label class="ft">
                  <span class="text-weight-medium"
                    ><div class="items-center text-grey q-pr-sm">
                      <b>Estado: </b>{{ item.estado }}
                    </div></span
                  >
                </q-item-label>
                <q-item-label class="ft">
                  <span class="text-weight-medium"
                    >Nº {{ item.id }} -
                    <b class="text-secondary">{{
                      item.nombreSede
                        ? item.nombreSede.toUpperCase()
                        : item.nombre_comercio.toUpperCase()
                    }}</b></span
                  >
                </q-item-label>
                <q-item-label class="text-weight-medium text-grey-7"
                  >Valor pedido:
                  <b class="text-green-5 ft"
                    >${{ item.subtotal | currency }}</b
                  ></q-item-label
                >
                <q-item-label
                  class="q-mt-xs text-body2 text-weight-medium text-grey-7"
                  >Valor domicilio:
                  <b class="text-grey ft"
                    >${{ item.valor_domicilio | currency }}</b
                  ></q-item-label
                >
                <q-item-label
                  class="q-mt-xs text-body2 text-weight-medium text-grey-7"
                >
                  {{ item.direccion_entrega }}</q-item-label
                >
                <q-item-label
                  v-if="item.observaciones"
                  class="q-mt-xs text-body2 text-weight-medium text-grey-7"
                >
                  {{ item.observaciones }}</q-item-label
                >
                <q-item-label
                  class="q-mt-xs text-body2 text-weight-medium text-grey-7"
                >
                  <q-chip
                    size="sm"
                    color="orange"
                    text-color="white"
                    icon="timer"
                  >
                    Recoger a las {{ item.fecha | hourFormat }}
                  </q-chip></q-item-label
                >
              </q-item-section>
              <q-item-section top v-if="item.domi_id">
                <div class="row q-gutter-md items-center">
                  <q-avatar square style="cursor:pointer">
                    <img :src="item.imagen" />
                  </q-avatar>
                  <div>
                    <q-item-label class="text-weight-medium text-grey-7">
                      <b class="text-grey-7 ">{{
                        `${item.nombre}`
                      }}</b></q-item-label
                    >
                    <q-item-label class="text-weight-medium text-grey-7">
                      <b class="text-grey-7 ">{{
                        `Cel: ${item.celular}`
                      }}</b></q-item-label
                    >
                  </div>
                </div>
              </q-item-section>
              <q-item-section top side>
                <div class="text-grey-8 q-gutter-md">
                  <q-btn
                    v-if="item.estado_servicio_id_fk !== 4"
                    @click="asignarDomi(item)"
                    size="12px"
                    color="primary"
                    no-caps
                    dense
                    label="Asignar domi"
                  />
                  <q-btn
                    v-if="item.domi_id && item.estado_servicio_id_fk !== 4"
                    @click="liberarServicio(item)"
                    size="12px"
                    color="orange"
                    no-caps
                    dense
                    label="Liberar"
                  />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
    </q-card>
  </q-layout>
</template>
<script>
import ServiceApi from "../../helpers/ServiceApi";
import { Loading, Noty, Filters } from "../../mixins";
import { mapMutations, mapState, mapActions } from "vuex";
import Moment from "moment";
export default {
  name: "Servicios",
  mixins: [Loading, Noty, Filters],
  computed: {
    ...mapState(["infoComercio", "sedes"]),
    ...mapState("Servicios", ["servicios", "pagination"])
  },
  data() {
    return {
      loading: false,
      filter: "",
      page: 1,
      date: Moment(),
      servicioSelect: null
    };
  },
  watch: {
    filter() {
      this.setSearch(this.filter);
      this.setPage(1);
      this.page = 1;
      this.getServicios();
    }
  },
  created() {
    this.getServicios();
  },
  mounted() {
    setInterval(() => {
      this.date = Moment();
    }, 5000);
  },
  methods: {
    ...mapMutations("Servicios", ["setSearch", "setPage"]),
    ...mapActions("Servicios", ["getServiciosGlobal"]),
    getServicios() {
      this.getServiciosGlobal()
        .then(response => {
          this.hideLoading();
        })
        .catch(err => {
          console.log("ERRO:::::", err);
          this.hideLoading();
          this.Noty("error", "Ocurrio un error al consultar los servicios.");
        });
    },
    liberarServicio(servicio) {
      this.$q
        .dialog({
          title: `Liberar servicio ${servicio.id}?`,
          message: `Se liberará el servicio y estará disponible nuevamente en la app domis.`,
          cancel: true
        })
        .onOk(() => {
          this.showLoading("Liberando servicio...");
          ServiceApi.post("/services/servicios/liberar", {
            servicio_id: servicio.id
          })
            .then(response => {
              this.hideLoading();
              this.getServicios();
              if (!response.data.status) {
                this.Noty("error", response.data.message);
              } else {
                this.Noty("success", response.data.message);
              }
            })
            .catch(e => {
              this.hideLoading();
              this.Noty(
                "error",
                "Ocurrió un error al intentar eliminar el servicio intentalo nuevamente."
              );
            });
        });
    },
    asignarDomi(servicio) {
      this.$q
        .dialog({
          title: "Asignar domiciliario al servicio",
          message: "Digite el identificador del domiciliario",
          prompt: {
            model: "",
            type: "number" // optional
          },
          cancel: true,
          persistent: true
        })
        .onOk(data => {
          if (data && data !== "") {
            this.showLoading("Asignando servicio...");
            ServiceApi.post("/services/servicios/asignar", {
              servicio_id: servicio.id,
              domi_id: data
            })
              .then(response => {
                this.hideLoading();
                this.getServicios();
                if (!response.data.status) {
                  this.Noty("error", response.data.message);
                } else {
                  this.Noty("success", response.data.message);
                }
              })
              .catch(e => {
                this.hideLoading();
                this.Noty(
                  "error",
                  "Ocurrió un error al intentar eliminar el servicio intentalo nuevamente."
                );
              });
          }
        });
    }
  }
};
</script>
