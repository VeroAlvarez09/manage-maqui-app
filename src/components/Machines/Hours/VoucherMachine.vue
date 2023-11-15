<template>
  <div class="row">
    <div class="col-10 text-h4 q-mb-lg">
      <strong>Comprobante de Pago</strong>
    </div>
    <div class="col-2">
      <img
        src="../../../assets/maquiApp.png"
        style="width: 100%"
      />
    </div>
    <div class="col-12 q-mb-md">
      <q-card>
        <q-toolbar-title>
          <strong class="q-pa-md text-h6">Empresa</strong>
        </q-toolbar-title>
        <q-separator></q-separator>
        <q-card-section class="row">
          <div class="col-6"><b>Nombre empresa:</b> Inge Rental S.A.S</div>
          <div class="col-6"><b>NIT:</b> 123456</div>

          <div class="col-6"><b>Correo Electrónico:</b> admin@ingerental.com</div>
          <div class="col-6"><b>Telefono:</b> 2147483647</div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 q-mb-md">
      <q-card>
        <q-toolbar-title>
          <strong class="q-pa-md text-h6">Maquina</strong>
        </q-toolbar-title>
        <q-separator></q-separator>
        <q-card-section class="row">
          <div class="col-6"><b>Marca:</b> {{ data.brand }}</div>
          <div class="col-6"><b>Modelo:</b> {{ data.model }}</div>

          <div class="col-6"><b>Serial:</b> {{ data.serial }}</div>
          <div class="col-6"><b>Color:</b> {{ data.color }}</div>

        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 q-mb-lg">
      <strong class="text-h6">Listado de Horas Trabajadas</strong>
      <table style="border-collapse: collapse" border="1" width="100%">
        <tr>
          <th v-for="col in columns">{{ col.label }}</th>
        </tr>
        <tr v-for="dat in workedHours">
          <td class="text-center">{{ dat.id }}</td>
          <td class="text-center">{{ dat.machine.brand }}</td>
          <td class="text-center">{{ dat.workedAt }}</td>
          <td class="text-center">{{ dat.totalHours }}</td>
          <td class="text-center">${{ dat.valuePerHour | currency }}</td>
          <td class="text-center">${{ dat.totalValue | currency }}</td>
        </tr>
      </table>
    </div>

    <div class="col-8 q-mr-md">
      {{ descripcion() }}
    </div>
    <div class="col-3 text-right">
      <b>Horas:</b> {{ data.totalHours }}<br>
      <b>Bonificación:</b> ${{ data.totalValue | currency }}
    </div>
  </div>
</template>

<script>
import {Filters} from "../../../mixins/index";

export default {
  mixins: [Filters],
  props: {
    data: {
      type: Object,
      default: null
    },
    filter: {
      type: Object,
      default: null
    },
    workedHours: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      columns: [
        {label: "Id"},
        {label: "Maquina"},
        {label: "Fecha"},
        {label: "Horas Trabajadas"},
        {label: "Valor por hora"},
        {label: "Bonificación"},
      ]
    };
  },
  methods: {
    descripcion() {
      return `Orden de servicio Ingerenta S.A.S para la fecha: ${this.filter.month}-${this.filter.year}, un total de ${
        this.data.totalHours
      } horas registradas para la maquina.\n`;
    },
  },
  computed: {
    totalPagar() {
      return this.horasTrabajadas.reduce((total, hora) => total + hora.horas, 0);
    },
  },
};
</script>

<style scoped>
/* Agrega estilos según sea necesario */
</style>
