<template>
  <div class="full-width">
    <q-dialog
      v-model="show"
      :persistent="false"
      class="q-pa-xs ro"
      transition-show="scale"
      transition-hide="scale"
      @hide="closeModal"
    >
      <q-card flat bordered class v-if="show">
        <q-card-section class="row items-center justify-center">
          <div class="text-h6">{{ comercio }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator inset></q-separator>
        <q-card-section>
          <div class="row justify-center"></div>
          <q-form ref="registrarPago" class="q-gutter-md" @submit="onSubmit()">
            <div
              :class="`${$q.screen.width > 1000 ? 'row' : 'col'} q-gutter-md`"
            >
              <q-input
                dense
                v-model="desde"
                label="Desde"
                lazy-rules
                :rules="[
                  val => (val && val.length > 0) || 'El campo es requerido.'
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="desde"
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        @input="() => $refs.desde.hide()"
                        v-model="desde"
                        mask="YYYY-MM-DD HH:mm"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      ref="hasta"
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time
                        @input="() => $refs.hasta.hide()"
                        v-model="desde"
                        mask="YYYY-MM-DD HH:mm"
                        format24h
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input
                dense
                v-model="hasta"
                label="Hasta"
                lazy-rules
                :rules="[
                  val => (val && val.length > 0) || 'El campo es requerido.'
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="hasta" mask="YYYY-MM-DD HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time v-model="hasta" mask="YYYY-MM-DD HH:mm" format24h>
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-decimal
                label="Valor a pagar"
                mode="currency"
                prefix="$"
                currency="COP"
                :precision="0"
                v-model="valor"
                :rules="[
                  val =>
                    (val && val !== '' && !esNumero(val)) ||
                    'Campo requerido, debe ser numérico'
                ]"
              ></q-decimal>
            </div>
            <div class="row q-gutter-md justify-center">
              <q-btn
                push
                label="Registrar pago"
                type="submit"
                color="primary"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import ServiceApi from "../../helpers/ServiceApi";
import { Loading, Noty } from "../../mixins/index";
import Moment from "moment";
export default {
  name: "RegistrarPago",
  mixins: [Loading, Noty],
  props: {
    comercio_id: {
      type: Number
    },
    comercio: {
      type: String,
      default: ""
    },
    desde: {
      type: String
    },
    hasta: {
      type: String
    },
    valor: {
      type: Number,
      default: 0
    },
    object: {
      type: Object
    }
  },
  data() {
    return {
      show: false
    };
  },
  watch: {},
  methods: {
    closeModal() {
      this.show = false;
    },
    esNumero(val) {
      return isNaN(val);
    },
    onSubmit() {
      this.$refs.registrarPago.validate().then(success => {
        if (success) {
          this.$q
            .dialog({
              title: "Ingresar pago",
              message: `Esta seguro de ingresar el pago al comercio ${this.comercio}?`,
              cancel: true,
              persistent: true
            })
            .onOk(() => {
              this.showLoading("Registrando pago...");
              ServiceApi.post("/registrar/pago", {
                comercio_id: this.comercio_id,
                desde: this.desde,
                hasta: this.hasta,
                total_facturado: this.valor,
                observaciones: `Total vendido ${this.object.total} de ${
                  this.object.cantidad_pedidos
                } pedidos procesados por la app. ${
                  this.object.pedidosNoApp.cantidad > 0
                    ? `${this.object.pedidosNoApp.cantidad} servicios de mensajeria por un valor de ${this.object.pedidosNoApp.totalVendido}`
                    : ""
                }`,
                servicio_desde: this.object.pedidosNoApp.desde
                  ? Moment(this.object.pedidosNoApp.desde).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  : null,
                servicio_hasta: this.object.pedidosNoApp.hasta
                  ? Moment(this.object.pedidosNoApp.hasta).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  : null
              })
                .then(response => {
                  this.hideLoading();
                  this.$emit("onFinish");
                  this.closeModal();
                })
                .catch(e => {
                  this.hideLoading();
                  this.Noty("error", e.message);
                });
            });
        }
      });
    }
  }
};
</script>
<style lang="scss">
.p20 {
  padding: 20px;
}
</style>
