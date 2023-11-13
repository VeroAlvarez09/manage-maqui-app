<template>
  <div class="q-pa-md">
    <q-table
      title="Pagos realizados a ikiero"
      :data="data"
      :columns="columns"
      :pagination.sync="pagination"
      row-key="id"
      :loading="loading"
      :filter="filter"
      @request="onRequest"
      binary-state-sort
      :max="5"
      rows-per-page-label="Columnas por página"
      loading-label="Consultando pagos"
      no-results-label="No hay resultados"
      no-data-label="No hay resultados"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
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
            <q-item>{{ props.row.id }}</q-item>
          </q-td>
          <q-td>
            <q-item>{{ props.row.desde | date }}</q-item>
          </q-td>
          <q-td>
            <q-item>{{ props.row.hasta | date }}</q-item>
          </q-td>
          <q-td>
            <q-item>${{ props.row.total_facturado | currency }}</q-item>
          </q-td>
          <q-td>
            <q-item>{{ props.row.cantidad_pedidos }}</q-item>
          </q-td>
          <q-td>
            <q-item>{{ props.row.observaciones || "N/A" }}</q-item>
          </q-td>
        </q-tr>
      </template>
      <div slot="pagination" slot-scope="props" class="row flex-center q-py-sm">
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
</template>

<script>
import ServiceApi from "src/helpers/ServiceApi";
import qs from "qs";

import { Filters } from "../../mixins/index";
export default {
  name: "pagos-ikiero",
  props: {},
  mixins: [Filters],
  created() {
    this.onRequest();
  },
  methods: {
    onRequest() {
      this.loading = true;
      ServiceApi.post("/customers/pagos/comercio", {
        comercio_id: this.$router.history.current.params.id
      })
        .then(response => {
          this.loading = false;
          this.data = response.data.pagos;
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
      filter: "",
      pagination: {
        sortBy: "id",
        descending: false,
        page: 1,
        rowsPerPage: 15
      },
      columns: [
        { name: "id", align: "left", field: "id", sortable: true, label: "ID" },
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
          name: "tf",
          align: "left",
          label: "Total facturado",
          field: "total_facturado"
        },
        {
          name: "cp",
          align: "left",
          label: "Cantidad pedidos",
          field: "cantidad_pedidos"
        },

        {
          name: "observaciones",
          align: "left",
          label: "Observaciones",
          field: "observaciones"
        }
      ],
      data: []
    };
  }
};
</script>
