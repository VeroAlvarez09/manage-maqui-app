<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        title="Listado de usuarios App"
        :data="data"
        :columns="columns"
        :loading="loading"
        :filter="filter"
        :rows-per-page-options="[0]"
        hide-bottom
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
          <q-input
            borderless
            dense
            outlined
            debounce="300"
            v-model="filter"
            placeholder="Buscar usuario"
          >
          </q-input>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td>
              <q-item
                class="text-primary"
                clickable
                tag="a"
                :to="'/user/detail/' + props.row.id"
              >{{ props.row.id }}
              </q-item>
            </q-td>

            <q-td>
              <q-item>{{ props.row.nombre }}</q-item>
            </q-td>

            <q-td>
              <q-item>{{ props.row.apellidos }}</q-item>
            </q-td>

            <q-td>
              <q-item>{{ props.row.email }}</q-item>
            </q-td>

            <q-td>
              <q-item>{{ props.row.celular }}</q-item>
            </q-td>

            <q-td>
              <q-item>{{ props.row.created_at | dateFormat }}</q-item>
            </q-td>

            <q-td>
              <q-item>{{ props.row.ikiero_cash | currency }}</q-item>
            </q-td>

            <q-td>
              <q-item>{{ props.row.cantidad_pedidos }}</q-item>
            </q-td>

            <q-td auto-width>
              <q-btn flat round dense icon="list">
                <q-menu>
                  <q-list style="min-width: 100px">
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
  </q-page>
</template>

<script>
import ServiceApi from "src/helpers/ServiceApi";
import qs from "qs";
import {Filters, Noty} from "../../mixins/index";

export default {
  mounted() {
    this.onRequest();
  },
  mixins: [Noty, Filters],
  methods: {
    detail(id) {
      this.$router.push("/user/detail/" + id);
    },
    onRequest() {
      this.loading = true;
      const str = qs.stringify({pagination: this.pagination, filter: this.filter});
      ServiceApi.get("/users/list?" + str)
        .then(response => {
          console.log(response.data)
          const {status, message, users} = response.data;
          if (status) {
            const {data, page, lastPage, perPage} = users;
            this.data = data;
            this.pagination.page = page;
            this.pagination.lastPage = lastPage;
            this.pagination.totalPage = lastPage;
            this.pagination.rowsPerPage = perPage;
          } else {
            this.Noty("error", message);
          }
          this.loading = false;
        })
        .catch(error => {
          this.Noty("error", error.message);
          this.loading = false;
        });
    }
  },
  data() {
    return {
      loading: true,
      filter: "",
      page: 1,
      pagination: {
        sortBy: "name",
        descending: false,
        page: 1,
        rowsPerPage: 15,
        totalPage: 0
      },
      columns: [
        {name: "id", align: "left", field: "id", sortable: true},
        {name: "nombre", align: "left", label: "Nombres", field: "nombre"},
        {name: "apellidos", align: "left", label: "Apellidos", field: "apellidos"},
        {name: "email", align: "left", label: "Correo", field: "email"},
        {name: "celular", align: "left", label: "Celular", field: "celular"},
        {name: "created_at", align: "left", label: "Fecha Creación", field: "created_at"},
        {name: "ikiero_cash", align: "left", label: "Cash", field: "ikiero_cash"},
        {name: "cantidad_pedidos", align: "left", label: "Total Pedidos", field: "cantidad_pedidos", sortable: true}
      ],
      data: []
    };
  },
  watch: {
    filter() {
      this.pagination.page = 1;
      this.page = 1;
      this.onRequest();
    },
    page() {
      this.pagination.search = "";
      this.pagination.page = this.page;
      this.onRequest();
    }
  },
};
</script>
