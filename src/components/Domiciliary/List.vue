<template>
  <q-page>
    <div class="q-pa-md">
      <div class="q-pa-md top-right">
        <q-btn
          color="green"
          icon-right="add"
          label="Crear domiciliario"
          no-caps
          @click="edit(0)"
        />
      </div>
      <q-card flat bordered class>
        <q-card-section class="row">
          <div class="col-8 text-h6">DOMICILIARIOS</div>
          <div class="col-4 q-ma-sm">
            <q-select
              v-model="estado"
              :options="estados"
              clearable
              borderless
              dense
              outlined
              debounce="300"
              emit-value
              map-options
              label="Estado"
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
      <q-table
        :data="data"
        :columns="columns"
        row-key="id"
        :loading="loading"
        binary-state-sort
        loading-label="Consultando domiciliario"
        no-results-label="No hay resultados"
        no-data-label="No hay resultados"
        :rows-per-page-options="[0]"
      >
        <template v-slot:top-right>
          <div class="row justify-end">
            <q-pagination
              v-model="page"
              :max="pagination.totalPage"
              :maxPages="2"
              :direction-links="true"
              :boundary-links="true"
              icon-first="skip_previous"
              icon-last="skip_next"
              icon-prev="fast_rewind"
              icon-next="fast_forward"
            ></q-pagination>
          </div>
        </template>
        <template v-slot:body="props">
          <q-tr
            :props="props"
            :style="
              `background-color: ${
                !props.row.activo || props.row.activo === 0 ? '#FFB851' : ''
              }`
            "
          >
            <q-td>
              <q-item
                class="text-primary"
                clickable
                tag="a"
                :to="'/domiciliary/detail/' + props.row.id"
              >
                {{ props.row.id }}
              </q-item>
            </q-td>
            <q-td>
              <q-avatar
                v-if="props.row.imagen"
                rounded
                size="100px"
                font-size="82px"
                text-color="white"
              >
                <img :src="props.row.imagen"
              /></q-avatar>
            </q-td>

            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              v-if="col.name !== 'id' && col.name !== 'imagen'"
            >
              {{ col.value }}
            </q-td>
            <!--                        <q-td key="id" :props="props">-->
            <!--                          <q-btn flat round dense icon="edit"/>-->
            <!--                          <q-popup-edit v-model="props.row.id" title="Update id" buttons>-->
            <!--                            <q-input type="number" v-model="props.row.id" />-->
            <!--                          </q-popup-edit>-->
            <!--                        </q-td>-->
            <q-td auto-width>
              <q-btn flat round dense icon="list">
                <q-menu>
                  <q-list style="min-width: 100px">
                    <q-item clickable v-close-popup>
                      <q-item-section @click="edit(props.row.id)"
                        >Editar</q-item-section
                      >
                    </q-item>
                    <q-item clickable v-close-popup>
                      <q-item-section @click="detail(props.row.id)"
                        >Detalle</q-item-section
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

export default {
  name: "Domiciliarios",
  mounted() {
    this.onRequest();
  },
  watch: {
    estado() {
      this.onRequest();
    },
    search() {
      this.pagination.search = this.search;
      this.page = 1;
      this.onRequest();
    },
    page() {
      this.pagination.page = this.page;
      this.onRequest();
    }
  },
  methods: {
    detail(id) {
      this.$router.push("/domiciliary/detail/" + id);
    },
    edit(id) {
      this.$router.push("/domiciliary/new/" + id);
    },
    onRequest() {
      this.loading = true;
      ServiceApi.post("/domiciliary/list", {
        pagination: this.pagination,
        estado: this.estado
      })
        .then(response => {
          const { status, message, domiciliarios, pagi } = response.data;
          if (status) {
            this.data = domiciliarios.data;
            let paginacion = pagi;
            this.pagination.totalPage = paginacion.lastPage;
            this.pagination.total = paginacion.total;
            this.pagination.page = paginacion.page;
          }
          this.loading = false;
        })
        .catch(error => {
          console.log("ERROR::::", error);
          this.loading = false;
        });
    }
  },
  data() {
    return {
      loading: true,
      search: null,
      estado: null,
      page: 1,
      pagination: {
        sortBy: "name",
        descending: false,
        page: 1,
        rowsPerPage: 15,
        totalPage: 0
      },
      columns: [
        { name: "id", align: "left", label: "id", field: "id", sortable: true },
        { name: "imagen" },
        { name: "nombre", align: "left", label: "Nombres", field: "nombre" },
        {
          name: "apellidos",
          align: "left",
          label: "Apellidos",
          field: "apellidos"
        },
        { name: "celular", align: "left", label: "Celular", field: "celular" },
        {
          name: "email",
          align: "left",
          label: "Correo electrónico",
          field: "email"
        },
        { name: "username", align: "left", label: "Usuario", field: "username" }
      ],
      estados: [
        { label: "Activo", value: 1 },
        { label: "Inactivo", value: 0 }
      ],
      data: []
    };
  }
};
</script>
