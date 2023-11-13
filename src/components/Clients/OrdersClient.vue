<template>
  <div class="row bg-gray2">
    <div class="col-12 col-md-3" style="padding-top: 15px">
      <q-card>
        <span class="q-pa-sm text-h6">Filtros</span>
        <div class="q-pa-md">
          <section class="bg-grey-3 q-pa-sm">
            <label>Rangos de Fecha</label>
            <section class="q-pa-md">
              <q-chip outline square>
                <span class="text-left">Desde:</span>
                <span class="q-pa-xl"> {{ filter.date.from }} </span>
              </q-chip>
              <q-chip outline square>
                <span class="text-left">Hasta:</span>
                <span class="q-pa-xl"> {{ filter.date.to }} </span>
              </q-chip>
            </section>
            <q-separator />
            <q-btn
              label="Seleccionar fecha"
              class="ml-8 text-center full-width"
            >
              <q-menu>
                <div>
                  <div class="q-pa-md">
                    <q-date v-model="days" range />
                  </div>
                  <div class="q-pa-md">
                    <q-card-actions align="right">
                      <q-btn
                        color="primary"
                        label="Filtrar"
                        v-close-popup
                        @click="onFilter(filter.status)"
                      />
                      <q-btn
                        color="primary"
                        flat
                        label="Cancelar"
                        v-close-popup
                      />
                    </q-card-actions>
                  </div>
                </div>
              </q-menu>
            </q-btn>
          </section>
        </div>
        <q-separator />
        <div class="q-pa-md">
          <label>Estado del pedido</label>
          <section class="q-pa-md">
            <q-btn
              label="Entregado"
              class="full-width"
              @click="onFilter(9)"
              :icon-right="filter.status === 9 ? 'done_outline' : ''"
            />
            <q-btn
              label="Cancelado Cliente"
              class="full-width"
              :icon-right="filter.status === 10 ? 'done_outline' : ''"
              @click="onFilter(10)"
            />
            <q-btn
              label="Cancelado Comercio"
              class="full-width"
              :icon-right="filter.status === 11 ? 'done_outline' : ''"
              @click="onFilter(11)"
            />
          </section>
        </div>
        <q-separator />
        <div class="q-pa-md">
          <label>Acciones</label>
          <section class="q-pa-md">
            <q-btn
              label="Borrar Filtros"
              class="ml-8 text-center full-width"
              outline
              color="primary"
              @click="reset()"
            />
          </section>
        </div>
      </q-card>
    </div>

    <div class="q-pa-md col-12 col-md-9">
      <q-table
        title="Pedidos por la app"
        :data="data"
        :columns="columns"
        :pagination.sync="pagination"
        row-key="id"
        :loading="loading"
        :filter="search"
        @request="onRequest"
        binary-state-sort
        :max="5"
        rows-per-page-label="Columnas por página"
        loading-label="Consultando pedidos"
        no-results-label="No hay resultados"
        no-data-label="No hay resultados"
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="search"
            placeholder="Buscar"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td>
              <q-item>{{ props.row.pedido_id }}</q-item>
            </q-td>
            <q-td>
              <q-item>{{ props.row.fecha | date }}</q-item>
            </q-td>
            <q-td>
              <q-item>{{ props.row.nombre }}</q-item>
            </q-td>
            <q-td>
              <q-item>{{ props.row.apellidos }}</q-item>
            </q-td>
            <q-td>
              <q-item>{{ props.row.celular }}</q-item>
            </q-td>
            <q-td>
              <q-item>{{ props.row.estado }}</q-item>
            </q-td>
            <q-td>
              <q-item>${{ props.row.total | currency }}</q-item>
            </q-td>
            <q-td>
              <q-item>${{ props.row.ganancia_ikiero | currency }}</q-item>
            </q-td>
          </q-tr>
        </template>
        <div
          slot="pagination"
          slot-scope="props"
          class="row flex-center q-py-sm"
        >
          <q-btn
            round
            dense
            size="sm"
            icon="undo"
            color="secondary"
            class="q-mr-sm"
            :disable="props.isFirstPage"
            @click="props.prevPage"
          />
          <div class="q-mr-sm" style="font-size: small">
            Page {{ props.pagination.page }} / {{ props.pagesNumber }}
          </div>
          <q-btn
            round
            dense
            size="sm"
            icon="redo"
            color="secondary"
            :disable="props.isLastPage"
            @click="props.nextPage"
          />
        </div>
      </q-table>
    </div>
  </div>
</template>

<script>
import ServiceApi from "src/helpers/ServiceApi";
import qs from "qs";
import Moment from "moment";
import { Filters } from "../../mixins/index";

export default {
  name: "OrdersClient",
  props: {},
  mixins: [Filters],
  created() {
    this.onRequest();
  },
  methods: {
    onFilter(status = 0) {
      this.filter = Object.assign({}, this.filter, {
        date: { from: this.days.from, to: this.days.to },
        status
      });
      this.onRequest();
    },
    reset() {
      this.filter = Object.assign({}, this.filter, {
        date: {
          from: Moment()
            .startOf("month")
            .format("YYYY/MM/DD"),
          to: Moment().format("YYYY/MM/DD")
        },
        status: 0
      });
      this.days = {
        from: Moment()
          .startOf("month")
          .format("YYYY/MM/DD"),
        to: Moment().format("YYYY/MM/DD")
      };
      this.onRequest();
    },
    onRequest() {
      this.loading = true;
      const str = qs.stringify({
        pagination: this.pagination,
        filter: this.filter
      });
      ServiceApi.get("/customers/get/orders?" + str)
        .then(response => {
          this.loading = false;
          this.data = response.data.orders.data;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    }
  },
  data() {
    return {
      loading: true,
      search: "",
      filter: {
        id: this.$router.history.current.params.id,
        date: {
          from: Moment()
            .startOf("month")
            .format("YYYY/MM/DD"),
          to: Moment().format("YYYY/MM/DD")
        },
        status: 0
      },
      pagination: {
        sortBy: "id",
        descending: false,
        page: 1,
        rowsPerPage: 50
      },
      columns: [
        {
          name: "pedido_id",
          align: "left",
          field: "pedido_id",
          sortable: true,
          label: "N° Pedido"
        },
        { name: "fecha", align: "left", label: "Fecha", field: "fecha" },
        {
          name: "nombre",
          align: "left",
          label: "Nombre Cliente",
          field: "nombre"
        },
        {
          name: "apellidos",
          align: "left",
          label: "Apellido Cliente",
          field: "apellidos"
        },
        {
          name: "celular",
          align: "number",
          label: "Número Cliente",
          field: "celular"
        },
        { name: "estado", align: "left", label: "Estado", field: "estado" },
        { name: "total", align: "left", label: "Valor", field: "total" },
        {
          name: "ganancia_ikiero",
          align: "left",
          label: "Ganancia iKiero",
          field: "ganancia_ikiero"
        }
      ],
      data: [],
      days: {
        from: Moment()
          .startOf("month")
          .format("YYYY/MM/DD"),
        to: Moment().format("YYYY/MM/DD")
      }
    };
  }
};
</script>
