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
      <q-card class="my-card" style="width: 100%; margin:auto; cursor:pointer">
        <q-bar style="background: transparent;">
          <div class="q-px-sm q-pt-md">
            <div class="text-h6 text-dark ft text-center">
              Nuevo Pedido
            </div>
          </div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-bar>
        <q-form ref="pedido" class="q-gutter-md" @submit="onSubmitAddPedido()">
          <div class="q-gutter-md" style="padding: 15px">
            <q-item-label caption>
              Estos pedidos son llevados por domiciliarios de ikiero, pero no
              entran por la App.
            </q-item-label>
            <q-select
              v-if="sedes && sedes.length > 0"
              outlined
              v-model="sede_id"
              :options="sedes"
              label="Seleccione la sede"
              emit-value
              map-options
            />
            <q-input outlined v-model="fecha">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="fecha" mask="YYYY-MM-DD HH:mm">
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
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time v-model="fecha" mask="YYYY-MM-DD HH:mm" format24h>
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
              label="Valor del pedido"
              mode="currency"
              prefix="$"
              outlined
              currency="COP"
              :precision="0"
              v-model="subtotal"
              :rules="[
                val =>
                  (val && val !== '' && !esNumero(val)) ||
                  'Este campo es requerido y debe ser numérico'
              ]"
            ></q-decimal>
            <div>
              <q-btn label="Guardar" type="submit" color="primary" />
            </div>
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import ServiceApi from "../../helpers/ServiceApi";
import { Loading, Noty } from "../../mixins/index";
import Moment from "moment";

export default {
  name: "AddPedido",
  mixins: [Loading, Noty],
  computed: {},
  data() {
    return {
      show: false,
      subtotal: 0,
      comercioId: null,
      fecha: Moment().format("YYYY-MM-DD HH:mm"),
      sedes: [],
      sede_id: null
    };
  },
  created() {
    this.comercioId = this.$router.history.current.params.id;
    ServiceApi.get("/customers/list/campus?comercioId=" + this.comercioId)
      .then(response => {
        const { status, message, campus, municipios } = response.data;
        if (status) {
          if (campus && campus.length > 0) {
            campus.map((i, k) => {
              if (k === 0) this.sede_id = i.id;
              this.sedes.push({ label: i.nombre, value: i.id });
            });
          }
        } else {
          this.Noty("error", message);
        }
        this.hideLoading();
      })
      .catch(error => {
        this.Noty("error", error.message);
        this.hideLoading();
      });
  },
  updated() {},
  watch: {},
  methods: {
    closeModal() {
      this.show = false;
    },
    esNumero(val) {
      return isNaN(val);
    },
    onSubmitAddPedido() {
      this.$refs.pedido.validate().then(success => {
        if (success) {
          this.showLoading("Guardando pedido...");
          ServiceApi.post("/customers/guardar/pedido", {
            comercio_id: parseInt(this.comercioId),
            fecha: this.fecha + ":00",
            sede_id: this.sede_id,
            subtotal: this.subtotal
          })
            .then(response => {
              this.hideLoading();
              this.Noty("success", response.data.message);
              this.show = false;
            })
            .catch(e => {
              console.log("error:::", e);
              this.hideLoading();
              this.Noty(
                "error",
                "Ocurrió un error al guardar el pedido, intenta nuevamente."
              );
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
