<template>
  <q-page>
    <div class="q-pa-md">
      <div class="q-pa-md top-right">
        <q-btn
          color="green"
          icon-right="add"
          label="Crear permission"
          no-caps
          @click="edit(0)"
        />
      </div>
      <q-table
        title="permisos"
        :data="data"
        :columns="columns"
        :pagination.sync="pagination"
        row-key="id"
        :loading="loading"
        :filter="filter"
        @request="onRequest"
        binary-state-sort
        rows-per-page-label="Columnas por página"
        loading-label="Consultando permisos"
        no-results-label="No hay resultados"
        no-data-label="No hay resultados"
      >
        <template v-slot:top-right>
          <q-input
            outlined
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
                :to="'/admin/permission/detail/' + props.row.id"
              >
                {{ props.row.id }}
              </q-item>
            </q-td>

            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              v-if="col.name !== 'id' && col.name !== 'module'"
            >
              {{ col.value }}
            </q-td>

            <q-td>
              <q-item
                v-if="props.row.module"
                class="text-primary"
                clickable
                tag="a"
                :to="'/admin/module/detail/' + props.row.module_id"
              >
                {{ props.row.module.name }}
              </q-item>
              <q-item v-else>
                <label> <b>N/A</b> </label>
              </q-item>
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
      this.$router.push("/admin/permission/detail/" + id);
    },
    edit(id) {
      this.$router.push("/admin/permission/new/" + id);
    },
    onRequest() {
      this.loading = true;
      ServiceApi.get("/admin/permissions")
        .then(response => {
          const {permissions, status, message} = response.data;
          if (status) {
            this.data = permissions;
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
        sortBy: "module_id",
        descending: false,
        page: 1,
        rowsPerPage: 15
      },
      columns: [
        {name: "id", align: "left", label: "id", field: "id", sortable: true},
        {name: "name", align: "left", label: "Nombre", field: "name"},
        {name: "slug", align: "left", label: "Slug", field: "slug"},
        {name: "description", align: "left", label: "Descripción", field: "description"},
        {name: "module", align: "left", label: "Modulo", field: "module"},
      ],
      data: []
    };
  }
};
</script>
