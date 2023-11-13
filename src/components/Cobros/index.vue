<template>
  <div class="q-pa-md">
    <q-table
      title="Cobros por realizar"
      :data="data"
      :columns="columns"
      :loading="loading"
      :rows-per-page-options="[0]"
      hide-bottom
    >
      <template v-slot:top-right>
        <div class="row justify-end">
          <q-pagination
            v-model="page"
            :max="pagination.totalPage"
            :direction-links="true"
            :boundary-links="true"
            icon-first="skip_previous"
            icon-last="skip_next"
            icon-prev="fast_rewind"
            icon-next="fast_forward"
          ></q-pagination>
        </div>
        <q-input
          borderless
          dense
          outlined
          debounce="300"
          v-model="filter"
          placeholder="Buscar comercio"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn
              v-if="props.row.pedidosNoApp.cantidad > 0"
              size="sm"
              color="accent"
              round
              dense
              @click="props.expand = !props.expand"
              :icon="props.expand ? 'remove' : 'add'"
            />
          </q-td>
          <q-td>
            <q-item>{{ props.row.id }}</q-item>
          </q-td>
          <q-td>
            <q-item>{{ props.row.comercio }}</q-item>
          </q-td>
          <q-td
            >{{ props.row.desde | dateFormat }} <br /><b>{{
              props.row.desde | hourFormat
            }}</b></q-td
          >
          <q-td
            >{{ props.row.hasta | dateFormat }} <br /><b>{{
              props.row.hasta | hourFormat
            }}</b></q-td
          >
          <q-td>
            <q-item>${{ props.row.total_vendido | currency }}</q-item>
          </q-td>
          <q-td>
            <q-item>{{ props.row.porcentaje * 100 }}</q-item>
          </q-td>
          <q-td>
            <q-item>{{ props.row.cantidad_pedidos || 0 }}</q-item>
          </q-td>
          <q-td>
            <q-item>${{ props.row.debe | currency }}</q-item>
          </q-td>
          <q-td>
            <q-item
              >${{
                (props.row.debe + props.row.pedidosNoApp.gananciaIkiero)
                  | currency
              }}</q-item
            >
          </q-td>
          <q-td>
            <q-btn
              color="grey-7"
              round
              flat
              icon="more_vert"
              v-if="
                props.row.debe !== 0 ||
                  props.row.pedidosNoApp.gananciaIkiero !== 0
              "
            >
              <q-menu cover auto-close>
                <q-list>
                  <q-item clickable>
                    <q-item-section
                      @click="
                        () => {
                          comercio = props.row;
                          modalComprobante = true;
                        }
                      "
                      >Comprobante
                    </q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section
                      @click="
                        () => {
                          comercio = props.row;
                          $refs.registrarPago.show = true;
                        }
                      "
                      >Registrar pago</q-item-section
                    >
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">
              <b>Pedidos no ingresados por la App.</b>
            </div>
            <q-card :style="$q.screen.width < 800 ? `` : 'width: 30%;'">
              <q-list dense>
                <q-item
                  ><q-item-section>
                    <q-item-label>Cantidad de pedidos:</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>{{
                      props.row.pedidosNoApp.cantidad
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item
                  ><q-item-section>
                    <q-item-label>Total ventas:</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption
                      >${{
                        props.row.pedidosNoApp.totalVendido | currency
                      }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
                <q-item
                  ><q-item-section>
                    <q-item-label>Desde:</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>{{
                      props.row.pedidosNoApp.desde | dateFormat
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item
                  ><q-item-section>
                    <q-item-label>Hasta:</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>{{
                      props.row.pedidosNoApp.hasta | dateFormat
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item
                  ><q-item-section>
                    <q-item-label>Ganancia ikiero:</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption
                      >${{
                        props.row.pedidosNoApp.gananciaIkiero | currency
                      }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <registrar-pago
      v-if="comercio"
      ref="registrarPago"
      :comercio_id="comercio.id"
      :comercio="comercio.comercio"
      :desde="comercio.desde"
      :hasta="comercio.hasta"
      :valor="comercio.debe + comercio.pedidosNoApp.gananciaIkiero"
      :object="comercio"
      @onFinish="onRequest()"
    ></registrar-pago>
    <q-dialog v-model="modalComprobante">
      <q-card style="width: 700px; max-width: 80vw;" v-if="comercio">
        <q-card-section class="q-pt-none">
          <comprobante id="comprobante" :comercio="comercio"></comprobante>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            @click="copyCobro(comercio)"
            label="Copy cobro"
            v-close-popup
          />
          <q-btn label="Imprimir" @click="imprimir" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import ServiceApi from "src/helpers/ServiceApi";
import qs from "qs";

import { Filters } from "../../mixins/index";
import Moment from "moment";
import Comprobante from "./Comprobante";
import RegistrarPago from "./RegistrarPago.vue";
Moment.locale("es");
export default {
  name: "pagos-ikiero",
  components: {
    Comprobante,
    RegistrarPago
  },
  mixins: [Filters],
  created() {
    this.onRequest();
  },
  watch: {
    filter() {
      this.pagination.search = this.filter;
      this.pagination.page = 1;
      this.page = 1;
      this.onRequest();
    },
    page() {
      this.pagination.page = this.page;
      this.pagination.search = "";
      this.onRequest();
    }
  },
  methods: {
    onRequest() {
      this.loading = true;
      ServiceApi.post("/cobros/pendientes", {
        filter: this.pagination
      })
        .then(response => {
          this.loading = false;
          this.data = response.data.cobros;
          this.pagination.totalPage = response.data.pagi.lastPage;
          this.pagination.total = response.data.pagi.total;
          this.pagination.page = response.data.pagi.page;
          this.pagination.rowsNumber = response.data.pagi.lastPage;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },
    imprimir() {
      let element = document.getElementById("comprobante");
      var ventana = window.open("", "PRINT", "height=500,width=700");
      ventana.document.write(
        "<html><head><title>" +
          this.comercio.comercio +
          `_${Moment().format("YYYY-MM-DD")}` +
          "</title>"
      );
      ventana.document.write("</head><body >");
      ventana.document.write(element.innerHTML);
      ventana.document.write("</body></html>");
      ventana.document.close();
      ventana.focus();
      ventana.print();
      ventana.close();
      return true;
    },
    copyCobro(cobro) {
      const mensaje = `Buenos días mi Nombre es Alejandro Castañeda Ocampo representante legal de Ikiero Technology SAS.\n\nMe permito informarle que desde el ${Moment(
        cobro.desde
      ).format("LLL")} al ${Moment(cobro.hasta).format(
        "LLL"
      )}, se han procesado por la aplicación un total de *${
        cobro.cantidad_pedidos
      }* pedidos entregados, un total vendido de *$${
        cobro.total_vendido
      }*.\n\n${
        cobro.pedidosNoApp.cantidad > 0
          ? `Han solicitado servicio para entrega de *${cobro.pedidosNoApp.cantidad}* pedidos, el valor total de estos pedidos es de *${cobro.pedidosNoApp.totalVendido}* la comisión para estos pedidos es de *$${cobro.pedidosNoApp.gananciaIkiero}*\n\n\n`
          : ""
      }Actualmente le deben *$${
        cobro.total
      }* a ikiero de comisión.\nPueden realizar el pago por consignación o efectivo:\n\nAhorros bancolombia: 54-103-126-111\nNequi: 3146254435\n\nUna vez se realice el pago se envía el respectivo comprobante.\n\nGracias por preferirnos.`;
      window.open(
        `https://api.whatsapp.com/send?phone=57${
          cobro.numero_confirmacion
        }&text=${encodeURI(mensaje)}`
      );
    }
  },
  data() {
    return {
      loading: true,
      modalComprobante: false,
      comercio: null,
      filter: "",
      page: 1,
      pagination: {
        page: 1,
        total: 0,
        totalPage: 0,
        rowsPerPage: 50,
        rowsNumber: 0,
        search: ""
      },
      columns: [
        {
          name: "ids",
          align: "left",
          field: "id"
        },
        {
          name: "id",
          align: "left",
          field: "id",
          sortable: true,
          label: "ID"
        },
        {
          name: "Comercio",
          align: "left",
          label: "Comercio",
          field: "comercio"
        },
        {
          name: "desde",
          align: "left",
          label: "Desde",
          field: "desde"
        },
        {
          name: "hasta",
          align: "left",
          label: "Hasta",
          field: "hasta"
        },
        {
          name: "total_ventas",
          align: "left",
          label: "Total vendido",
          field: "total_vendido"
        },
        {
          name: "porcentaje",
          align: "left",
          label: "%",
          field: "porcentaje"
        },
        {
          name: "cantidad_pedidos",
          align: "left",
          label: "N° Pedidos",
          field: "cantidad_pedidos"
        },
        {
          name: "ganancia_ikiero",
          align: "left",
          label: "Ganancia ikiero",
          field: "debe",
          sortable: true
        },
        {
          name: "ganancia_ikiero_total",
          align: "left",
          label: "Total a cobrar"
        }
      ],
      data: []
    };
  }
};
</script>
