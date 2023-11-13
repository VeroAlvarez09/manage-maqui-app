<template>
  <div>
    <q-table
      title="Ciudades"
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
          placeholder="Buscar ciudad"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td>
            <q-item>{{ props.row.ciudad }}</q-item>
          </q-td>
          <q-td>
            <q-item>${{ props.row.tarifa_minima | currency }}</q-item>
            <q-popup-edit v-model="props.row.tarifa_minima" auto-save>
              <q-decimal
                :label="`Tarifa mínima en ${props.row.ciudad}`"
                mode="currency"
                dense
                autofocus
                prefix="$"
                currency="COP"
                :precision="0"
                v-model="props.row.tarifa_minima"
                :rules="[
                  val =>
                    (val && val !== '' && !isNumero(val)) ||
                    'Este campo es requerido y debe ser numérico'
                ]"
              >
              </q-decimal>
              <q-btn
                v-close-popup
                color="primary"
                @click="
                  actualizarTarifaMinima(props.row.id, props.row.tarifa_minima)
                "
                label="Guardar"
                push
              />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import ServiceApi from "src/helpers/ServiceApi";

import { Filters, Loading, Noty } from "../../mixins/index";
export default {
  name: "ciudades",
  mixins: [Filters, Loading, Noty],
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
      ServiceApi.post("/ciudades", {
        filter: this.pagination
      })
        .then(response => {
          this.loading = false;
          this.data = response.data.ciudades;
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
    isNumero(val) {
      if (!isNaN(val)) {
        return false;
      }
      return true;
    },
    actualizarTarifaMinima(ciudad_id, tarifa_minima) {
      this.showLoading("Actualizando información...");
      ServiceApi.post("/actualizar/tarifa/minima", {
        ciudad_id,
        tarifa_minima
      })
        .then(response => {
          this.hideLoading();
          this.Noty("success", response.data.message);
        })
        .catch(e => {
          this.hideLoading();
          this.Noty(
            "error",
            "Ocurrió un error guardando la información, intentalo nuevamente."
          );
        });
    }
  },
  data() {
    return {
      loading: true,
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
          name: "Ciudad",
          align: "left",
          field: "ciudad",
          label: "Ciudad"
        },
        {
          name: "tarifa_minima",
          align: "left",
          field: "tarifa_minima",
          sortable: true,
          label: "Tarifa mínima"
        }
      ],
      data: []
    };
  }
};
</script>
