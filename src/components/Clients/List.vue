<template>
  <q-page>
    <div class="q-pa-md">
      <q-card flat bordered class>
        <q-card-section class="row">
          <div class="col-8 text-h6">COMERCIOS</div>
          <div class="col-4 q-ma-sm">
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
      <div class="q-mt-lg">
        <q-table
          :data="data"
          :columns="columns"
          :loading="loading"
          :search="search"
          binary-state-sort
          loading-label="Consultando comercios"
          no-results-label="No hay resultados"
          no-data-label="No hay resultados"
          :rows-per-page-options="[0]"
        >
          <template v-slot:top-right>
            <div class="row justify-end">
              <q-pagination
                v-model="page"
                :max="pagination.totalPage"
                :maxPages=2
                :direction-links="true"
                :boundary-links="true"
                icon-first="skip_previous"
                icon-last="skip_next"
                icon-prev="fast_rewind"
                icon-next="fast_forward"
              ></q-pagination>
            </div>
          </template>

          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th auto-width>Alta Demanda</q-th>
              <q-th v-for="col in props.cols" :key="col.name" :props="props">{{
                  col.label
                }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td auto-width>
                <q-toggle
                  v-model="props.row.alta_demanda"
                  checked-icon="add"
                  unchecked-icon="remove"
                  @input="onChangeAltaDemanda(props.row.alta_demanda, props.row.id)"
                />
              </q-td>

              <q-td>
                <q-item
                  class="text-primary"
                  clickable
                  tag="a"
                  :to="'/client/detail/' + props.row.id"
                >{{ props.row.id }}
                </q-item
                >
              </q-td>

              <q-td
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                v-if="col.name !== 'id'"
              >{{ col.value }}
              </q-td
              >

              <q-td auto-width>
                <q-btn flat round dense icon="list">
                  <q-menu>
                    <q-list style="min-width: 100px">
                      <q-item clickable v-close-popup>
                        <q-item-section @click="loginDashboard(props.row.id)"
                        >Login Dashboard
                        </q-item-section
                        >
                      </q-item>
                      <q-item clickable v-close-popup>
                        <q-item-section @click="detail(props.row.id)"
                        >Detalle
                        </q-item-section
                        >
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import ServiceApi from "src/helpers/ServiceApi";
import qs from "qs";

export default {
  mounted() {
    this.onRequest();
  },
  methods: {
    loginDashboard(id) {
      ServiceApi.get("/customers/login/dashboard?id=" + id)
        .then(response => {
          const {token, user, url} = response.data;
          window.open(url + "?token=" + token, "_blank");
        })
        .catch(error => {
        });
    },
    detail(id) {
      this.$router.push("/client/detail/" + id);
    },
    onChangeAltaDemanda(alta_demanda, comercio_id) {
      ServiceApi.post("/customers/alta/demanda", {
        alta_demanda,
        comercio_id
      }).then(response => {
        console.log(response);
      });
    },
    onRequest() {
      this.loading = true;
      const str = qs.stringify({pagination: this.pagination, filter: this.filter});
      ServiceApi.get("/customers/list?" + str)
        .then(response => {
          const {status, customers, cities} = response.data;
          if (status) {
            let {page, data, perPage, lastPage} = customers;
            data.map(customer => {
              customer.alta_demanda = customer.alta_demanda === 1;
            });
            this.data = data;
            this.cities = cities;
            this.pagination.page = page;
            this.pagination.lastPage = lastPage;
            this.pagination.totalPage = lastPage;
            this.pagination.rowsPerPage = perPage;
          } else {
          }
          this.loading = false;
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
      page: 1,
      cities: [],
      municipio: null,
      pagination: {
        sortBy: "name",
        descending: false,
        page: 1,
        rowsPerPage: 15,
        totalPage: 0
      },
      columns: [
        {name: "id", align: "left", field: "id", sortable: true},
        {name: "nombre_comercio", align: "left", label: "Comercio", field: "nombre_comercio"},
        {name: "categoria", align: "left", label: "Categoria", field: "categoria"},
        {name: "numero_confirmacion", align: "left", label: "Celular", field: "numero_confirmacion"},
        {name: "subdominio", align: "left", label: "Url", field: "subdominio"},
        {name: "municipio", align: "left", label: "Municipio", field: "municipio"},
        {name: "direccion_comercio", align: "left", label: "Dirección", field: "direccion_comercio"}
      ],
      data: [],
      filter: {search: null, municipio: null},
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
    page() {
      this.pagination.page = this.page;
      this.onRequest();
    }
  },
};
</script>
