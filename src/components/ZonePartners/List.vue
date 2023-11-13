<template>
  <q-page>
    <div class="q-pa-md">
      <div class="q-pa-md top-right">
        <q-btn
          color="green"
          icon-right="add"
          label="Crear socio"
          no-caps
          @click="edit(0)"
        />
      </div>
      <q-table
        title="Socios"
        :data="data"
        :columns="columns"
        :pagination.sync="pagination"
        row-key="id"
        :loading="loading"
        :filter="filter"
        @request="onRequest"
        binary-state-sort
        rows-per-page-label="Columnas por página"
        loading-label="Consultando socios"
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
              <q-icon name="search" />
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
                :to="'/client/detail/' + props.row.id"
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
                      <q-item-section @click="edit(props.row.documento)"
                        >Editar</q-item-section
                      >
                    </q-item>
                    <q-item clickable v-close-popup>
                      <q-item-section @click="detail(props.row.documento)"
                        >Detalle</q-item-section
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
import { Loading, Noty } from "src/mixins";

export default {
  mounted() {
    this.onRequest();
  },
  mixins: [Loading, Noty],
  methods: {
    detail(id) {
      this.$router.push("/zone/partner/detail/" + id);
    },
    edit(id) {
      this.$router.push("/zone/partner/new/" + id);
    },
    onRequest() {
      this.loading = true;
      this.showLoading("consultando socios...");
      ServiceApi.get("/zone/partners/list", {})
        .then(response => {
          const { status, message, zonePartners } = response.data;
          if (status) {
            this.data = zonePartners;
          } else {
            this.Noty("error", message);
          }
          this.hideLoading();
          this.loading = false;
        })
        .catch(error => {
          this.Noty("error", error.message);
          this.hideLoading();
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
        rowsPerPage: 15
      },
      columns: [
        {
          name: "documento",
          align: "left",
          label: "Documento",
          field: "documento",
          sortable: true
        },
        {
          name: "tipo_documento",
          align: "left",
          label: "Tipo documento",
          field: "tipo_documento"
        },
        { name: "nombre", align: "left", label: "Nombres", field: "nombre" },
        {
          name: "apellido",
          align: "left",
          label: "Apellidos",
          field: "apellido"
        },
        {
          name: "razon_social",
          align: "left",
          label: "Razon social",
          field: "razon_social"
        },
        { name: "celular", align: "left", label: "Celular", field: "celular" },
        {
          name: "por_ganancia",
          align: "center",
          label: "Porcentaje de ganancia",
          field: "por_ganancia",
          format(value) {
            return value + "%";
          }
        },
        {
          name: "saldo_disponible",
          align: "left",
          label: "Saldo",
          field: "saldo_disponible",
          format(value) {
            return "$" + value.toLocaleString();
          }
        },
        {
          name: "total_retirado",
          align: "left",
          label: "SaldoTotal retirado",
          field: "total_retirado",
          format(value) {
            return "$" + value.toLocaleString();
          }
        }
      ],
      data: []
    };
  }
};
</script>
