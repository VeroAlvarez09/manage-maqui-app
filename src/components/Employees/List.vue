<template>
  <q-page>
    <div class="q-pa-md">
      <div class="q-pa-md top-right">
        <q-btn
          color="accent"
          icon-right="add"
          label="Crear operador"
          no-caps
          @click="edit(0)"
        />
      </div>
      <q-table
        title="Operadores"
        :data="data"
        :columns="columns"
        :pagination.sync="pagination"
        row-key="id"
        :loading="loading"
        :filter="filter"
        @request="onRequest"
        binary-state-sort
        rows-per-page-label="Columnas por página"
        loading-label="Consultando operadores"
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
              <q-icon name="search"/>
            </template>
          </q-input>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td>
              <q-item
                class="text-primary"
                clickable
                tag="a"
                :to="'/employee/detail/' + props.row.id"
              >
                {{ props.row.id }}
              </q-item>
            </q-td>

            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              v-if="col.name !== 'id'"
            >
              {{ col.name === 'machine' ? col.value.brand : col.value }}
            </q-td>
            <q-td auto-width>
              <q-btn flat round dense icon="list">
                <q-menu>
                  <q-list style="min-width: 100px">
                    <q-item clickable v-close-popup>
                      <q-item-section @click="edit(props.row.id)"
                      >Editar
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
            color="accent"
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
            color="accent"
            :disable="props.isLastPage"
            @click="props.nextPage"
          />
        </div>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import ServiceApi from "src/helpers/ServiceApi";

export default {
  mounted() {
    this.onRequest();
  },
  methods: {
    detail(id) {
      this.$router.push("/employee/detail/" + id);
    },
    edit(id) {
      this.$router.push("/employee/new/" + id);
    },
    onRequest() {
      this.loading = true;
      ServiceApi.get(`/employee?page=${this.pagination.page},perPage=${this.pagination.rowsPerPage}`, {})
        .then(response => {
          const {data, meta} = response.data;
          this.data = data;
          this.pagination = {
            page: meta.current_page,
            rowsPerPage: meta.per_page
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
      filter: "",
      pagination: {
        sortBy: "name",
        descending: false,
        page: 1,
        rowsPerPage: 20
      },
      columns: [
        {name: "id", align: "left", label: "id", field: "id", sortable: true},
        {name: "nombre", align: "left", label: "Nombres", field: "name"},
        {
          name: "apellidos",
          align: "left",
          label: "Apellidos",
          field: "lastName"
        },
        {
          name: "docType",
          align: "left",
          label: "Tipo documento",
          field: "docType"
        },
        {name: "documento", align: "left", label: "Documento", field: "document"},
        {name: "email", align: "left", label: "Correo electrónico", field: "email"},
        {name: "machine", align: "left", label: "Maquina", field: "machine"}
      ],
      data: []
    };
  }
};
</script>
