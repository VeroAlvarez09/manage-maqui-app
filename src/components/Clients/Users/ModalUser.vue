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
            ref="updateUser"
            class="q-gutter-md"
            @submit="save()"
          >
            <div
              :class="`${$q.screen.width > 1000 ? 'row' : 'col'} q-gutter-md`"
            >
              <q-input
                outlined
                dense
                class="col-md-5"
                v-model="user.name"
                label="Nombre"
                lazy-rules
                :rules="[
                    val => (val && val.length > 0) || 'El campo es requerido.'
                  ]"
              />
              <q-input
                outlined
                dense
                class="col-md-5"
                v-model="user.lastname"
                label="Apellidos"
                lazy-rules
                :rules="[
                    val => (val && val.length > 0) || 'El campo es requerido.'
                  ]"
              />
              <q-input
                outlined
                dense
                class="col-md-10"
                v-model="user.email"
                label="Usuario/Email"
                type="email"
                lazy-rules
                :rules="[
                    val => (val && val.length > 0) || 'El campo es requerido.'
                  ]"
              />
              <q-input
                outlined
                dense
                class="col-md-3"
                v-model="user.indicativo"
                label="Indicativo"
                type="tel"
                lazy-rules
                :rules="[
                    val => (val && val.length > 0) || 'El campo es requerido.',
                    val => !esNumero(val) || 'Debe ser un valor numérico.'
                  ]"
              />
              <q-input
                outlined
                dense
                class="col-md-7"
                v-model="user.phone"
                label="Celular/Whatssap"
                type="tel"
                lazy-rules
                :rules="[
                    val => (val && val.length > 0) || 'El campo es requerido.',
                    val => !esNumero(val) || 'Debe ser un valor numérico.'
                  ]"
              />
              <q-select
                outlined
                dense
                v-model="user.roles"
                :options="roles"
                label="Roles"
                class="col-md-5"
                multiple
                lazy-rules
                :rules="[
                    val => (val && val.length > 0) || 'El campo es requerido.'
                  ]"
              >
                <template v-slot:selected-item="scope">
                  <q-chip
                    removable
                    dense
                    @remove="scope.removeAtIndex(scope.index)"
                    :tabindex="scope.tabindex"
                    color="white"
                    text-color="secondary"
                    class="q-ma-none"
                  >
                    {{ scope.opt.label }}
                  </q-chip>
                </template>
              </q-select>
              <q-select
                outlined
                dense
                v-model="user.permissions"
                :options="permissions"
                label="Permisos"
                class="col-md-5"
                multiple
                lazy-rules
                :rules="[
                    val => (val && val.length >= 0) || 'El campo es requerido.'
                  ]"
              >
                <template v-slot:selected-item="scope">
                  <q-chip
                    removable
                    dense
                    @remove="scope.removeAtIndex(scope.index)"
                    :tabindex="scope.tabindex"
                    color="white"
                    text-color="secondary"
                    class="q-ma-none"
                  >
                    {{ scope.opt.label }}
                  </q-chip>
                </template>
              </q-select>
              <q-input
                outlined
                dense
                class="col-md-5"
                v-model="password"
                type="password"
                label="Contraseña"
                lazy-rules
                :rules="
                    !user.id
                      ? [
                          val =>
                            (val && val.length > 0) || 'El campo es requerido.',
                          val => val.length > 7 || 'Mínimo 8 caracteres.'
                        ]
                      : []
                  "
              >
                <template v-slot:prepend>
                  <q-icon name="lock"/>
                </template>
              </q-input>
              <q-input
                outlined
                dense
                class="col-md-5"
                v-model="retryPassword"
                type="password"
                label="Repita contraseña"
                lazy-rules
                :rules="
                    !user.id
                      ? [
                          val =>
                            (val && val.length > 0) || 'El campo es requerido.',
                          val => val.length > 7 || 'Mínimo 8 caracteres.',
                          val => val === password || 'No hay coincidencias.'
                        ]
                      : []
                  "
              >
                <template v-slot:prepend>
                  <q-icon name="lock"/>
                </template>
              </q-input>
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
  name: "modal-user",
  mixins: [Loading, Noty],
  computed: {},
  props: {
    roles: {
      require: true,
      type: Array,
      default: []
    },
    permissions: {
      require: true,
      type: Array,
      default: []
    },
    comercio_id: {
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
      user: null,
      password: null,
      retryPassword: null
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
      this.$refs.updateUser.validate().then(success => {
        if (success) {
          this.showLoading("Guardando información...");
          let user = {...this.user};
          if (this.password) {
            user.password = this.password;
          }
          user.configuracion_comercio_id = this.comercio_id
          let roles = user.roles.map(rol => {
            return rol.id
          })
          let permissions = user.permissions.map(permission => {
            return permission.id
          })
          delete user.roles;
          delete user.permissions;

          let api = null;

          if (user.id) {
            api = ServiceApi.put("/admin/users/" + user.id, {user, roles, permissions})
          } else {
            api = ServiceApi.post("/admin/users", {user, roles, permissions})
          }

          api.then(response => {
            this.hideLoading();
            if (response.data.status) {
              this.Noty(
                "success",
                "Se han guardado los datos del usuario de manera éxitosa."
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
              "Ocurrió un error al actualizar la información del usuario."
            );
            console.log(e)
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
