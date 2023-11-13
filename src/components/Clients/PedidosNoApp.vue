<template>
  <q-card flat bordered class>
    <q-table
      :data="data"
      :hide-header="mode === 'grid'"
      :columns="columns"
      row-key="name"
      :grid="mode == 'grid'"
      :filter="filter"
      :loading="loading"
      :rows-per-page-options="[0]"
      hide-bottom
    >
      <template v-slot:no-data="{ filter }">
        <div class="full-width row flex-center text-red q-gutter-sm">
          <q-icon size="2em" name="sentiment_dissatisfied" />
          <span>
            {{
              filter
                ? `No se lograrón encontrar pedidos con el filtro ${filter}`
                : "No encontramos historial de pedidos."
            }}
          </span>
        </div>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props"
            ><b>{{ props.row.id }}</b></q-td
          >

          <q-td key="sede" :props="props">{{
            props.row.sede ? props.row.sede : "N/A"
          }}</q-td>
          <q-td key="subtotal" :props="props"
            >${{ props.row.subtotal | currency }}</q-td
          >
          <q-td key="fecha" :props="props"
            >{{ props.row.fecha | dateFormat }} <br /><b>{{
              props.row.fecha | hourFormat
            }}</b></q-td
          >
          <q-td key="opciones" :props="props"
            ><q-btn
              @click="eliminarPedido(props.row.id)"
              round
              color="primary"
              size="sm"
              icon="delete"
          /></q-td>
        </q-tr>
      </template>
      <template v-slot:top-right="props">
        <div class="row justify-end">
          <!-- <q-pagination
            v-model="page"
            :max="pagination.totalPage"
            :direction-links="true"
            :boundary-links="true"
            icon-first="skip_previous"
            icon-last="skip_next"
            icon-prev="fast_rewind"
            icon-next="fast_forward"
          ></q-pagination> -->
          <q-pagination
            v-model="page"
            :max="pagination.totalPage"
            :input="true"
          >
          </q-pagination>
        </div>
        <q-input
          dense
          borderless
          outlined
          debounce="300"
          v-model="filter"
          placeholder="Buscar aquí"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn
          flat
          round
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          v-if="mode === 'list'"
        >
          <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>
            {{ props.inFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen" }}
          </q-tooltip>
        </q-btn>

        <q-btn
          flat
          round
          dense
          :icon="mode === 'grid' ? 'list' : 'grid_on'"
          @click="
            mode = mode === 'grid' ? 'list' : 'grid';
            separator = mode === 'grid' ? 'none' : 'horizontal';
          "
          v-if="!props.inFullscreen"
        >
          <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>{{
            mode === "grid" ? "List" : "Grid"
          }}</q-tooltip>
        </q-btn>
      </template>
    </q-table>
  </q-card>
</template>
<script>
import ServiceApi from "../../helpers/ServiceApi";
import { Loading, Noty, Filters } from "../../mixins/index";

export default {
  name: "HistorialPedidosNoApp",
  mixins: [Loading, Noty, Filters],
  components: {},
  data() {
    return {
      filter: "",
      loading: false,
      pagination: {
        page: 1,
        total: 0,
        totalPage: 0,
        rowsPerPage: 50,
        search: ""
      },
      filter: "",
      mode: "list",
      columns: [
        {
          name: "id",
          align: "left",
          field: "id",
          label: "N° Pedido"
        },
        {
          name: "sede",
          label: "Sede",
          align: "left",
          field: "sede"
        },
        {
          name: "subtotal",
          label: "Valor venta",
          align: "left",
          field: "subtotal"
        },
        {
          name: "fecha",
          label: "Fecha",
          align: "left",
          field: "fecha"
        },
        {
          name: "opciones",
          label: "Opciones",
          align: "left"
        }
      ],
      data: [],
      page: 1
    };
  },
  computed: {},
  watch: {
    filter() {
      this.pagination.search = this.filter;
      this.pagination.page = 1;
      this.page = 1;
      this.loading = true;
      this.getHistorial();
    },
    page() {
      this.pagination.page = this.page;
      this.pagination.search = "";
      this.loading = true;
      this.getHistorial();
    },
    categoria_id() {
      this.pagination.search = "";
      this.pagination.page = 1;
      this.page = 1;
      this.loading = true;
      this.getHistorial();
    }
  },
  created() {
    this.loading = true;
    this.getHistorial();
  },
  mounted() {},
  methods: {
    getHistorial() {
      let data = {
        filter: this.pagination,
        comercio_id: this.$router.history.current.params.id
      };
      ServiceApi.post("/get/pedidos/no/app", data)
        .then(response => {
          this.hideLoading();
          let data = response.data.pedidos;
          let paginacion = response.data.pagi;
          this.data = data;
          this.pagination.totalPage = paginacion.lastPage;
          this.pagination.total = paginacion.total;
          this.pagination.page = paginacion.page;
          this.loading = false;
        })
        .catch(err => {
          this.hideLoading();
          this.Noty(
            "error",
            "Ocurrio un error al consultar el historial de pedidos."
          );
          this.loading = false;
        });
    },
    eliminarPedido(pedido_id) {
      this.$q
        .dialog({
          title: "Eliminaar pedido",
          message: `Esta seguro de querer eliminar el peiddo ${pedido_id}?`,
          cancel: true
        })
        .onOk(() => {
          ServiceApi.post("/eliminar/pedido/no/app", { pedido_id }).then(
            response => {
              if (response.data.status) {
                this.Noty("success", response.data.message);
                this.getHistorial();
              }
            }
          );
        });
    }
  }
};
</script>
