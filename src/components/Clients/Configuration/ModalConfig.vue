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
      <q-card flat bordered class style="width: 800px; max-width: 80vw; height: 550px; max-height: 80vm" v-if="show">
        <q-card-section class="row items-center justify-center">
          <div class="text-h6">{{ title }}</div>
          <q-space/>
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>
        <q-separator inset></q-separator>
        <q-card-section>
          <div class="row justify-center"></div>
          <q-form
            ref="updateConfig"
            class="q-gutter-md"
            @submit="save()"
          >
            <div
              :class="`col-12 q-gutter-md`"
            >
              <q-select
                :disable="config.edit"
                outlined
                dense
                v-model="config"
                :options="configs"
                label="Configuración"
                class="col-md-5"
                lazy-rules
                :rules="[
                    val => (val) || 'El campo es requerido.'
                  ]"
              ></q-select>
            </div>
            <div
              :v-if="config"
              class="row"
              v-for="(configuration, key) in config.valor"
              :key="key"
            >
              <div class="col">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="row">
                      <div class="col-2">
                        <strong>Titulo:</strong>
                        <p>{{ configuration.title }}</p>
                      </div>
                      <div class="col-8">
                        <strong>Descripción:</strong>
                        <p>{{ configuration.description }}</p>
                      </div>
                    </div>
                    <div :class="`col-12 q-gutter-md`">
                      <p>Indica el valor que tendra esta configuración.</p>
                    </div>
                    <div :class="`col-12 q-gutter-md`">
                      <q-select
                        v-if="configuration.type === 'boolean' || configuration.type === 'select'"
                        outlined
                        dense
                        v-model="configuration.optionsValue"
                        :options="configuration.options"
                        label="Valor"
                        @input="val => configuration.value = val.value"
                        class="col-md-5"
                      ></q-select>
                      <q-input
                        v-if="configuration.type === 'text'"
                        outlined
                        dense
                        class="col-md-5"
                        v-model="configuration.value"
                        label="Valor"
                      />
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <div class="row q-gutter-md justify-center">
              <q-btn
                label="Guardar"
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
import ServiceApi from "../../../helpers/ServiceApi";
import {Loading, Noty} from "../../../mixins";

export default {
  name: "modal-config",
  mixins: [Loading, Noty],
  computed: {},
  props: {
    configs: {
      require: true,
      type: Array,
      default: []
    },
    commerceId: {
      require: true,
      type: Number,
      default: 0
    },
    onRequest: {
      require: true,
      type: Function,
      default: () => console.log("Metodo")
    },
  },
  data() {
    return {
      title: "",
      show: false,
      config: null,
      id: null
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
    save() {
      this.$refs.updateConfig.validate().then(success => {
        if (success) {
          this.showLoading("Guardando información...");
          let configuration = {...this.config};

          configuration.comercio_id = this.commerceId
          configuration.gen_config_comercio_id = configuration.id;
          configuration.activo = true;

          let api = null;

          if (configuration.edit) {
            api = ServiceApi.put("/customers/configurations/" + this.id, {configuration})
          } else {
            api = ServiceApi.post("/customers/configurations", {configuration})
          }

          api.then(response => {
            this.hideLoading();
            if (response.data.status) {
              this.Noty(
                "success",
                "Se han guardado los datos de manera éxitosa."
              );
              this.onRequest();
              this.show = false;
            } else {
              this.Noty(
                "error",
                response.data.message
              );
            }
          }).catch(e => {
            this.hideLoading();
            this.Noty(
              "error",
              "Ocurrió un error al actualizar la información."
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
