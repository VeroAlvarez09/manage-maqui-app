<template>
  <q-page>
    <div class="q-pa-md">
      <q-card flat bordered class>
        <q-card-section class="row">
          <div class="col-7 text-h6">PEDIDOS EN CURSO
            <q-btn
              flat
              round
              icon="refresh"
              @click="onRequest"
            >
              <q-tooltip content-class="bg-primary">Actualizar</q-tooltip>
            </q-btn>
          </div>
          <div class="col-1 q-pa-sm text-primary">
            Total: {{ pagination.total }}
          </div>
          <div class="col-4">
            <q-pagination
              v-model="page"
              :max="pagination.totalPage"
              :maxPages=2
              :direction-links="true"
              :boundary-links="true"
              icon-first="skip_previous"
              icon-last="skip_next"
              icon-prev="fast_rewind"
              icon-next="fast_forward"/>
          </div>
          <div class="col-3 q-ma-sm">
            <q-select
              v-model="comercio"
              :options="Commerce"
              clearable
              borderless
              dense
              outlined
              debounce="300"
              emit-value
              map-options
              label="Comercio"
            />
          </div>
          <div class="col-3 q-ma-sm">
            <q-select
              v-model="municipio"
              :options="cities"
              clearable
              borderless
              dense
              outlined
              debounce="300"
              emit-value
              map-options
              label="Municipio"
            />
          </div>
          <div class="col-3 q-ma-sm">
            <q-select
              v-model="estado"
              :options="statusOrder"
              clearable
              borderless
              dense
              outlined
              debounce="300"
              emit-value
              map-options
              label="Estado"
            />
          </div>
          <div class="col-2 q-ma-sm">
            <q-input
              borderless
              dense
              outlined
              debounce="300"
              v-model="search"
              placeholder="Buscar"
            >
            </q-input>
          </div>
        </q-card-section>
      </q-card>

      <div class="row">
        <div class="col-12 col-md-3 q-pa-sm q-pt-lg" v-for="(order,key) in data" :key="key">
          <q-card class="my-card">
            <q-card-section flat bordered>
              <div class="row justify-between items-center">
                <div class="ft text-h6">Pedido N˚{{ order.id }}</div>
                <q-icon name="delivery_dining" @click=" () => {showDomi=true; orderNow=order}" size="sm"
                        style="cursor:pointer;" v-if="order.usuario_domi_id"/>
                <div class="items-center text-grey q-pr-sm">
                  {{ order.created_at | hourFormat }}
                  -
                  {{ order.created_at | diffDate(date) }}
                  <q-icon name="timer"/>
                </div>
              </div>
              <div class="row">
                <div class="col-8">
                  <strong>{{ order.nombre_comercio }}</strong>
                </div>
                <div class="col-4">
                  <q-icon name="place" color="secondary"/>
                  {{ order.municipio }}
                </div>
              </div>
              {{ order.direccion_comercio }}
              <div class="text-overline text-orange-9">{{ order.numero_confirmacion }}</div>
              <q-badge outline color="red" label="PENDIENTE POR GESTIONAR" v-if="order.estado_id === 1"/>
              <q-badge outline color="info" label="PEDIDO EN TIENDA"
                       v-if="order.estado_id === 2 || order.estado_id === 3"/>
              <q-badge outline color="black" label="PEDIDO ENTREGADO AL DOMIKIERO" v-if="order.estado_id === 4"/>
              <q-badge outline color="purple" label="DOMIKIERO ASIGNADO" v-if="order.estado_id === 5"/>
              <q-badge outline color="secondary" label="DOMIKIERO EN TIENDA" v-if="order.estado_id === 6"/>
              <q-badge outline color="primary" label="PEDIDO RECLAMADO" v-if="order.estado_id === 7"/>
              <q-badge outline color="indigo" label="DOMIKIERO EN DIRECCIÓN" v-if="order.estado_id === 8"/>
              <q-badge outline color="green" label="PEDIDO ENTREGADO" v-if="order.estado_id === 9"/>
              <q-badge outline color="red" label="PEDIDO CANCELADO" v-if="order.estado_id === 10"/>

              <div class="row q-pt-sm">
                <div class="col-12 col-md-12">
                  <q-select
                    v-model="order.estado_id"
                    :options="statusOrder"
                    color="primary"
                    filled
                    clearable
                    emit-value
                    map-options
                    label="Estado"
                    @input="() => {
                      if(order.estado_id){
                        onChangeStatus(order.id,order.estado_id)
                      }
                    }"
                  />
                </div>
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <div class="text-center text-h6">
                <strong>Detalles de la entrega</strong>
              </div>
              <div class="text-subtitle2">
                Cliente:
                <span class="text-grey">{{ order.nombre }} {{ order.apellidos }}</span>
              </div>
              <div class="text-subtitle2">
                Celular:
                <span class="text-grey">{{ order.celular }}</span>
              </div>
              <div class="text-subtitle2">
                Dirección de entrega:
                <span class="text-grey">{{ order.direccion_envio }}</span>
              </div>
              <div class="text-subtitle2">
                Subtotal:
                <span class="text-grey">$ {{ order.subtotal | currency }}</span>
              </div>
              <div class="text-subtitle2">
                Valor domicilio:
                <span class="text-grey">$ {{ order.valor_domicilio | currency }}</span>
              </div>
              <div class="text-subtitle2">
                Total:
                <span class="text-grey">$ {{ order.total | currency }}</span>
              </div>
              <div class="text-subtitle2" v-if="order.fecha_recogida">
                Hora recogida:
                <span class="text-grey">{{ order.fecha_recogida | hourFormat }}</span>
              </div>
            </q-card-section>

            <q-separator/>

            <q-card-actions v-if="order.estado_id === 1" class="justify-around q-px-md">
              <q-btn color="negative" flat round icon="store" @click="goToWhatssap(order.link)">
                <q-tooltip content-class="bg-black">Confirmar pedido con el comercio</q-tooltip>
              </q-btn>
              <q-btn
                color="positive"
                flat
                round
                icon="check_circle"
                @click="onChangeStatus(order.id,2)"
              >
                <q-tooltip content-class="bg-green">Pedido confirmado por el comercio</q-tooltip>
              </q-btn>
              <q-btn
                color="red"
                flat
                round
                icon="cancel"
                @click="onChangeStatus(order.id,10)"
                class="q-pl-xl"
              >
                <q-tooltip content-class="bg-primary">Pedido cancelado por el comercio</q-tooltip>
              </q-btn>
            </q-card-actions>
          </q-card>
        </div>
        <q-dialog
          v-if="orderNow"
          v-model="showDomi"
          transition-show="scale"
          transition-hide="scale"
          title="Información del domiciliario"
          @onclose="()=>showDomi = false"
        >
          <modal-domi :domiciliario="{
            id:orderNow.usuario_domi_id,
            nombre:orderNow.nombre_domi,
            apellidos:orderNow.apellidos_domi,
            celular:orderNow.celular_domi,
          }"/>
        </q-dialog>
      </div>
    </div>
  </q-page>
</template>

<script>
import Moment from "moment";
import ServiceApi from "../../helpers/ServiceApi";
import {Loading, Noty, Filters} from "../../mixins/index";
import qs from "qs";
import ModalDomi from "./ModalDomi";
import ModalTimer from "./ModalTimer";

export default {
  name: "Orders",
  components: {ModalDomi},
  mounted() {
    setInterval(() => {
      this.date = Moment();
    }, 5000);
    this.onRequest();
  },
  mixins: [Loading, Noty, Filters],
  methods: {
    onRequest() {
      this.showLoading("consultando pedidos...");
      const str = qs.stringify({pagination: this.pagination, filter: this.filter});
      ServiceApi.get("/orders/list/pending?" + str)
        .then((response) => {
          const {status, message, orders, statusOrder, Commerce, cities} = response.data;
          if (status) {
            let {page, data, perPage, lastPage, total} = orders;
            this.data = data;
            this.statusOrder = statusOrder;
            this.Commerce = Commerce;
            this.cities = cities;
            this.pagination.page = page;
            this.pagination.lastPage = lastPage;
            this.pagination.totalPage = lastPage;
            this.pagination.rowsPerPage = perPage;
            this.pagination.total = total;
          } else {
            this.Noty("error", message);
          }
          this.hideLoading();
        })
        .catch((error) => {
          this.hideLoading();
        });
    },
    onChangeStatus(pedido_id, estado) {
      if (estado) {
        if (estado === 2) {
          const minutes = parseInt(this.data.filter(p => p.id === pedido_id)[0].tiempo_recogida.replace(":", ""))
          this.$q.dialog({
            component: ModalTimer,
            minutes
          }).onOk((tiempo_recogida) => {
            this.changeStatus(pedido_id, estado, tiempo_recogida)
          }).onCancel(() => {
            this.onRequest();
          })
        } else {
          this.changeStatus(pedido_id, estado)
        }
      }
    },
    changeStatus(pedido_id, estado, tiempo_recogida = null) {
      this.showLoading("Estamos realizando los cambios...");
      ServiceApi.post("/orders/change/status", {pedido_id, estado, tiempo_recogida})
        .then((response) => {
          const {status, message} = response.data;
          if (status) {
            this.Noty("success", message);
          } else {
            this.Noty("error", message);
          }
          this.hideLoading();
          this.onRequest();
        })
        .catch((error) => {
          this.Noty("error", error.message);
          this.hideLoading();
        });
    },
    goToWhatssap(link) {
      window.open(link);
    },
  },
  data() {
    return {
      page: 1,
      municipio: null,
      comercio: null,
      estado: null,
      orderNow: null,
      search: null,
      pagination: {
        sortBy: "name",
        descending: false,
        page: 1,
        rowsPerPage: 15,
        totalPage: 0
      },
      loading: true,
      showDomi: false,
      date: Moment(),
      filter: {search: null, municipio: null, comercio: null, estado: null},
      data: [],
      statusOrder: [],
      Commerce: [],
      cities: [],
    };
  },
  watch: {
    search() {
      this.filter.search = this.search
      this.page = 1;
      this.onRequest();
    },
    municipio() {
      this.filter.municipio = this.municipio
      this.page = 1;
      this.onRequest();
    },
    estado() {
      this.filter.estado = this.estado
      this.page = 1;
      this.onRequest();
    },
    comercio() {
      console.log(this.comercio)
      this.filter.comercio = this.comercio
      this.page = 1;
      this.onRequest();
    },
    page() {
      this.pagination.page = this.page;
      this.onRequest();
    }
  },
};
</script>
