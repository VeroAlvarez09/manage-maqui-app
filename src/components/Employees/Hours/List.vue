<template>
  <q-page>
    <div class="q-pa-md">
      <div class="q-pb-lg top-right">
        <q-card flat bordered class>
          <q-card-section class="row">
            <div class="col-8 text-h6">Filtros</div>
            <div class="col-4 q-ma-sm">
              <q-select
                v-model="filter.month"
                :options="months"
                clearable
                borderless
                dense
                outlined
                debounce="300"
                emit-value
                map-options
                label="Mes"
              />
            </div>
            <div class="col-2 q-ma-sm">
              <q-select
                v-model="filter.year"
                :options="years"
                clearable
                borderless
                dense
                outlined
                debounce="300"
                emit-value
                map-options
                label="Mes"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
      <q-table
        title="Horas operadas"
        :data="data"
        :columns="columns"
        :pagination.sync="pagination"
        row-key="idEmployee"
        :loading="loading"
        :filter="filterInput"
        @request="onRequest"
        binary-state-sort
        rows-per-page-label="Columnas por página"
        loading-label="Consultando horas"
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
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.value }}
            </q-td>
            <q-td auto-width>
              <q-btn flat round dense icon="print" @click="openModal(props.row)"/>
            </q-td>
            <q-dialog v-model="modalVoucherEmployee">
              <q-card style="width: 700px; max-width: 80vw;" v-if="props.row">
                <q-card-section class="q-pt-none">
                  <voucher-employee id="voucher-employee" :data="employee" :filter="filter"
                                    :workedHours="workedHours"></voucher-employee>
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn label="Imprimir" @click="imprimir" v-close-popup/>
                </q-card-actions>
              </q-card>
            </q-dialog>
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
import Moment from "moment/moment";
import VoucherEmployee from "components/Employees/Hours/VoucherEmployee.vue";
import Comprobante from "components/Cobros/Comprobante.vue";

export default {
  components: {Comprobante, VoucherEmployee},
  mounted() {
    this.onRequest();
  },
  methods: {
    openModal(employee) {
      ServiceApi.get(`/employee/report/hours/${employee.idEmployee}?year=${this.filter.year}&month=${this.filter.month}`)
        .then(response => {
          this.workedHours = response.data;
          this.employee = employee
          this.modalVoucherEmployee = true;
        })
        .catch(error => {
          console.log(error)
        });

    },
    imprimir() {
      let element = document.getElementById("voucher-employee");
      var ventana = window.open("", "PRINT", "height=500,width=700");
      ventana.document.write(
        "<html><head><title>" +
        `_${Moment().format("YYYY-MM-DD")}` +
        "</title>"
      );
      ventana.document.write("</head><body >");
      ventana.document.write(element.innerHTML);
      ventana.document.write("</body></html>");
      ventana.document.close();
      ventana.focus();
      ventana.print();
      ventana.close();
      return true;
    },
    onRequest() {
      this.loading = true;
      ServiceApi.get(`/employee/report/hours?year=${this.filter.year}&month=${this.filter.month}&page=${this.pagination.page}&perPage=${this.pagination.rowsPerPage}`)
        .then(response => {
          const {data, meta} = response.data;
          this.data = data;
          this.pagination = {
            page: meta.current_page,
            pagesNumber: meta.per_page
          }
          this.loading = false;
        })
        .catch(error => {
          console.log(error)
          this.loading = false;
        });
    }
  },
  data() {
    return {
      modalVoucherEmployee: false,
      employee: {},
      workedHours: {},
      loading: true,
      filterInput: "",
      filter: {
        year: "2023",
        month: "11"
      },
      pagination: {
        sortBy: "name",
        descending: false,
        page: 1,
        pagesNumber: 20
      },
      years: [
        {label: "2023", value: "2023"},
        {label: "2024", value: "2024"},
        {label: "2025", value: "2025"},
        {label: "2026", value: "2026"},
        {label: "2027", value: "2027"},
        {label: "2028", value: "2028"},
        {label: "2029", value: "2029"},
        {label: "2030", value: "2030"},
      ],
      months: [
        {label: "Enero", value: "01"},
        {label: "Febrero", value: "02"},
        {label: "Marzo", value: "03"},
        {label: "Abril", value: "04"},
        {label: "Mayo", value: "05"},
        {label: "Junio", value: "06"},
        {label: "Julio", value: "07"},
        {label: "Agosto", value: "08"},
        {label: "Septiembre", value: "09"},
        {label: "Octubre", value: "10"},
        {label: "Noviembre", value: "11"},
        {label: "Diciembre", value: "12"},
      ],
      columns: [
        {name: "id", align: "left", label: "Id empleado", field: "idEmployee"},
        {name: "nombre", align: "left", label: "Nombres", field: "name"},
        {name: "apellidos", align: "left", label: "Apellidos", field: "lastName"},
        {name: "docType", align: "left", label: "Tipo documento", field: "docType"},
        {name: "documento", align: "left", label: "Documento", field: "document"},
        {name: "email", align: "left", label: "Correo electrónico", field: "email"},
        {
          name: "salary",
          align: "left",
          label: "Salario",
          field: "salary",
          format: val => `$${val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`
        },
        {name: "totalHours", align: "left", label: "Horas totales", field: "totalHours"},
        {
          name: "totalValue",
          align: "left",
          label: "Valor bonificación",
          field: "totalValue",
          format: val => `$${val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`
        }
      ],
      data: []
    };
  }
};
</script>
