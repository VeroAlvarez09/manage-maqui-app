<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">Nuevo / editar</div>
                <div class="text-subtitle1">{{ data.name }}</div>
              </div>
              <div class="col-auto">
                <q-btn color="grey-7" round flat icon="more_vert">
                  <q-menu cover auto-close>
                    <q-list>
                      <q-item clickable>
                        <q-item-section @click="back">Regresar</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            <q-form
              ref="registerRole"
              class="q-gutter-md"
              @submit="onSubmit()"
              @reset="onReset()"
            >
              <div
                :class="`${$q.screen.width > 1000 ? 'row' : 'col'} q-gutter-md`"
              >
                <q-input
                  outlined
                  dense
                  class="col-md-5"
                  v-model="data.name"
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
                  v-model="data.slug"
                  label="Slug"
                  lazy-rules
                  :rules="[
                    val => (val && val.length > 0) || 'El campo es requerido.'
                  ]"
                />
                <q-input
                  outlined
                  dense
                  class="col-md-5"
                  v-model="data.description"
                  label="Descripción"
                  lazy-rules
                  :rules="[
                    val => (val && val.length > 0) || 'El campo es requerido.'
                  ]"
                />
                <q-select
                  outlined
                  dense
                  v-model="data.permissions"
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
      </div>
      <div class="col-12 col-md-1"/>
      <div class="col-12 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-h6">Acciones</div>
            <div class="text-subtitle1">Estas acciones no podran ser reversibles.</div>
          </q-card-section>
          <q-card-actions vertical>
            <q-btn flat @click="back">Regresar</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>

</template>

<script>
import ServiceApi from "src/helpers/ServiceApi";
import {Loading, Noty} from "../../mixins/index";

export default {
  mounted() {
    this.onRequest();
  },
  mixins: [Loading, Noty],
  methods: {
    onRequest() {
      this.showLoading("consultando rol...");
      ServiceApi.get("/admin/roles/" + this.data.id).then(response => {
        const {status, message, role, permissions} = response.data;
        if (status) {
          this.data = role.length > 0 ? role[0] : {};
          this.permissions = permissions;
        } else {
          this.Noty("error", message);
        }
        this.hideLoading();
      }).catch(error => {
        this.Noty("error", error.message);
        this.hideLoading();
      });

    },
    onSubmit() {
      this.$refs.registerRole.validate().then(success => {
        if (success) {
          this.showLoading("Guardando información...");
          const {name, slug, description, id} = this.data;
          let permissions = this.data.permissions.map(permission => {
            return permission.id
          })

          let api = null;

          if (id && id > 0) {
            api = ServiceApi.put("/admin/roles/" + id, {name, slug, description, permissions})
          } else {
            api = ServiceApi.post("/admin/roles", {name, slug, description, permissions})
          }

          api.then(response => {
            this.hideLoading();
            if (response.data.status) {
              this.Noty(
                "success",
                "Se han guardado los datos del rol de manera éxitosa."
              );
              this.onRequest();
              this.$router.push("/admin/role")
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
    },
    onReset() {
      this.data.name = null;
      this.data.slug = null;
      this.data.permissions = [];
      this.data.description = null;
    },
    back() {
      this.$router.push('/admin/role');
    },
  },
  data() {
    return {
      loading: true,
      permissions: [],
      data: {
        id: this.$router.history.current.params.id,
        name: null,
        slug: null,
        permissions: [],
        description: null,
      },
    }
  }
}
</script>
