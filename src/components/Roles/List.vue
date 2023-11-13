<template>
  <q-page>
    <div class="q-pa-md">
      <div class="q-pa-md top-right">
        <q-btn
          color="green"
          icon-right="add"
          label="Crear rol"
          no-caps
          @click="edit(0)"
        />
      </div>
      <q-table
        title="Roles"
        :data="data"
        :columns="columns"
        :pagination.sync="pagination"
        row-key="id"
        :loading="loading"
        :filter="filter"
        @request="onRequest"
        binary-state-sort
        rows-per-page-label="Columnas por página"
        loading-label="Consultando roles"
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
                :to="'/admin/role/detail/' + props.row.id"
              >
                {{ props.row.id }}
              </q-item>
            </q-td>

            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              v-if="col.name !== 'id' && col.name !== 'commerce_id' && col.name !== 'actions'"
            >
              {{ col.value }}
            </q-td>

            <q-td>
              <q-item
                v-if="props.row.commerce"
                class="text-primary"
                clickable
                tag="a"
                :to="'/client/detail/' + props.row.commerce_id"
              >
                {{ props.row.commerce.nombre_comercio }}
              </q-item>
              <q-item v-else>
                <label> <b>General</b> </label>
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
            <q-td auto-width>
              <q-btn
                v-if="props.row.permissions.length > 0"
                size="sm"
                color="primary"
                round
                dense
                @click="props.expand = !props.expand"
                :icon="props.expand ? 'remove' : 'add'"
              />
            </q-td>
          </q-tr>

          <q-tr v-show="props.expand" :props="props" v-if="props.row.permissions.length > 0">
            <q-td colspan="100%">
              <div class="text-left">
                <b>Permisos</b>
              </div>
              <q-card :style="$q.screen.width < 800 ? `` : 'width: 60%;'">
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption v-for="permission in props.row.permissions"> [
                        <b>{{ permission.name }}</b> ]
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card>
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
      this.$router.push("/admin/role/detail/" + id);
    },
    edit(id) {
      this.$router.push("/admin/role/new/" + id);
    },
    onRequest() {
      this.loading = true;
      ServiceApi.get("/admin/roles")
        .then(response => {
          const {roles, status, message} = response.data;
          if (status) {

            const {data, page, lastPage, total} = roles;

            this.data = data;
            this.pagination.totalPage = lastPage;
            this.pagination.total = total;
            this.pagination.page = page;
            this.pagination.rowsNumber = lastPage;
            this.loading = false;

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
        sortBy: "commerce_id",
        descending: false,
        page: 1,
        rowsPerPage: 15
      },
      columns: [
        {name: "id", align: "left", label: "id", field: "id", sortable: true},
        {name: "name", align: "left", label: "Nombre", field: "name"},
        {name: "slug", align: "left", label: "Slug", field: "slug"},
        {name: "description", align: "left", label: "Descripción", field: "description"},
        {name: "created_at", align: "left", label: "Fecha", field: "created_at"},
        {name: "commerce_id", align: "left", label: "Comercio", field: "commerce_id"},
        {name: "actions", align: "left", label: "Acciones", field: "actions"},
      ],
      data: []
    };
  }
};
</script>
