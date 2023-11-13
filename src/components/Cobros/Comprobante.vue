<template>
  <div>
    <div class="q-pa-md container">
      <div class="row">
        <div class="col-xs-12">
          <div class="invoice-title">
            <img
              src="https://ikiero.s3.amazonaws.com/Produccion/Comercios/227/logos/IMG-20201026-WA0069.jpg.jpeg"
              style="width: 10%"
            />
            <h3 style="margin: auto;">Cuenta de cobro</h3>
            <address>
              <strong>{{ fecha }}</strong
              ><br />
            </address>
          </div>
          <hr />
          <div class="row">
            <div class="col-xs-6">
              <address>
                <strong>Ikiero Technology</strong><br />
                Calle 129 Sur # 53 - 48<br />
                ikiero.com<br />
                info@ikiero.com <br />
                Alejandro Castañeda Ocampo<br />
                <b>CC.</b> 1.026.150.902
              </address>
              <hr />
            </div>

            <div class="col-xs-6">
              <address>
                <strong>{{ comercio.comercio }}</strong
                ><br />
                Nit/Cc: {{ comercio.nit || "N/A" }} <br />
                Dirección: {{ comercio.direccion_comercio }} <br />
              </address>
            </div>
          </div>
          <hr />
          <div class="row">
            <div class="col-xs-6">
              <div class="col-xs-6">
                {{ descripcion() }}
              </div>
            </div>
            <div class="row col-xs-6 q-gutter-md">
              <hr />
              <div class="row">
                <div class="col-xs-12">
                  <address>
                    Subtotal: <b>${{ comercio.total | currency }}</b
                    ><br />
                    Valor a pagar: <b>${{ comercio.total | currency }}</b
                    ><br />
                  </address>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Moment from "moment";
import { Filters } from "../../mixins/index";
export default {
  name: "comprobante",
  mixins: [Filters],
  props: {
    comercio: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      fecha: Moment().format("YYYY-MM-DD")
    };
  },
  methods: {
    descripcion() {
      return `Pago de servicio ikiero.com desde ${Moment(
        this.comercio.desde
      ).format("LLL")} hasta ${Moment(this.comercio.hasta).format(
        "LLL"
      )}, un total de ${
        this.comercio.cantidad_pedidos
      } pedidos ingresados desde la aplicación.\n${
        this.comercio.pedidosNoApp.cantidad !== 0
          ? `Y un total de ${this.comercio.pedidosNoApp.cantidad} servicios de mensajeria.`
          : ""
      }`;
    }
  }
};
</script>
