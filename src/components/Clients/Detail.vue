<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-9 q-pr-md">
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Detalle</div>
                <div class="text-subtitle1">
                  {{ data.nombre_comercio | capitalize }}
                </div>
              </div>
              <div class="col-auto">
                <q-btn color="grey-7" round flat icon="more_vert">
                  <q-menu cover auto-close>
                    <q-list>
                      <q-item clickable>
                        <q-item-section @click="loginDashboard"
                        >Login dashboard
                        </q-item-section
                        >
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

          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="info" label="Información comercio"/>
            <q-tab name="campus" label="Sedes"/>
            <q-tab name="pagos" label="Pagos"/>
            <q-tab name="users" label="Usuarios"/>
            <q-tab name="config" label="Configuración"/>
          </q-tabs>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="info">
              <client-detail-info :data="data" :debeIkiero="debeIkiero"/>
            </q-tab-panel>
            <q-tab-panel name="campus">
              <client-detail-campus :data="data"/>
            </q-tab-panel>
            <q-tab-panel name="pagos">
              <pagos></pagos>
            </q-tab-panel>
            <q-tab-panel name="users">
              <users></users>
            </q-tab-panel>
            <q-tab-panel name="config">
              <configuration-commerce></configuration-commerce>
            </q-tab-panel>
          </q-tab-panels>

          <q-separator/>

          <q-card-actions>
            <!--              <q-btn color="green">Guardar</q-btn>-->
            <q-btn flat @click="back">Regresar</q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-h6">Acciones</div>
            <div class="text-subtitle1">
              Estas acciones no podran ser reversibles.
            </div>
          </q-card-section>
          <q-card-actions vertical>
            <q-btn color="secondary" @click="loginDashboard"
            >Login dashboard
            </q-btn
            >
            <br/>
            <q-btn color="secondary" @click="$refs.addPedido.show = true"
            >Ingresar servicio de mensajería
            </q-btn
            >
            <br/>
            <q-btn flat @click="back">Regresar</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <!-- PEDIDOS DEL COMERCIO CON FILTROS -->
    <div class="row justify-center" style="padding-top: 15px">
      <div class="col-12 col-md-12">
        <q-tabs
          v-model="tabPedidos"
          inline-label
          outside-arrows
          mobile-arrows
          class="bg-primary text-white shadow-2"
        >
          <q-tab name="servicios" label="Servicio de entrega"/>
          <q-tab name="app" label="Pedidos por la app"/>
        </q-tabs>
        <q-tab-panels
          v-model="tabPedidos"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="app">
            <orders-client/>
          </q-tab-panel>
          <q-tab-panel name="servicios">
            <pedidos-no-app></pedidos-no-app>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <!-- MODAL ADD PEDIDO -->
    <modal-add-pedido ref="addPedido"></modal-add-pedido>
  </div>
</template>

<script>
import ServiceApi from "src/helpers/ServiceApi";
import {Loading, Noty, Filters} from "../../mixins/index";
import ClientDetailInfo from "components/Clients/ClientDetailInfo";
import ClientDetailCampus from "components/Clients/DetailCampus";
import Pagos from "./Pagos";
import Users from "./Users/index";
import OrdersClient from "components/Clients/OrdersClient";
import ModalAddPedido from "./ModalAddPedido";
import PedidosNoApp from "./PedidosNoApp";
import ConfiguracionComercios from "components/Clients/Configuration";
import ConfigurationCommerce from "components/Clients/Configuration";

export default {
  name: "DetalleComercio",
  components: {
    ConfigurationCommerce,
    ConfiguracionComercios,
    OrdersClient,
    ClientDetailCampus,
    ClientDetailInfo,
    Pagos,
    Users,
    ModalAddPedido,
    PedidosNoApp
  },
  mounted() {
    this.onRequest();
  },
  filters: {
    capitalize: function (value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  mixins: [Loading, Noty, Filters],
  methods: {
    loginDashboard() {
      ServiceApi.get("/customers/login/dashboard?id=" + this.id)
        .then(response => {
          const {token, user, url} = response.data;
          window.open(url + "?token=" + token, "_blank");
        })
        .catch(error => {
        });
    },
    back() {
      this.$router.push("/clients");
    },
    onRequest() {
      this.showLoading("consultando comercios...");
      ServiceApi.get("/customers/get?id=" + this.id)
        .then(response => {
          const {status, message, customer, debe} = response.data;
          if (status) {
            this.data = customer;
            this.debeIkiero = debe;
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
      tab: "info",
      tabPedidos: "servicios",
      data: {},
      debeIkiero: 0
    };
  }
};
</script>
