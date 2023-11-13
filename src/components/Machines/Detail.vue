<template>
    <div class="q-pa-md">
      <div class="row justify-center">
        <div class="col-12 col-md-8">
          <q-card flat bordered class="my-card">
            <q-card-section>
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-h6">Detalle</div>
                  <div class="text-subtitle1">{{data.brand}} {{data.serial}}</div>
                </div>
                <div class="col-auto">
                  <q-btn color="grey-7" round flat icon="more_vert">
                    <q-menu cover auto-close>
                      <q-list>
                        <q-item clickable>
                          <q-item-section @click="deleteUser">Eliminar</q-item-section>
                        </q-item>
                        <q-item clickable>
                          <q-item-section @click="edit">Editar</q-item-section>
                        </q-item>
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
              <div class="row justify-center">
                <div class="col-12 col-md-4" v-for="(value,key) in data">
                  <strong>{{key | capitalize}}</strong>
                  <p>{{value}}</p>
                </div>
              </div>
            </q-card-section>

            <q-separator/>

            <q-card-actions>
<!--              <q-btn color="green">Guardar</q-btn>-->
              <q-btn flat @click="back">Regresar</q-btn>
            </q-card-actions>
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
              <q-btn color="accent" @click="edit">Editar</q-btn>
              <br>
              <q-btn color="secondary" @click="deleteUser" disable>Eliminar</q-btn>
              <br>
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
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    },
    mixins: [Loading, Noty],
    methods: {
      edit() {
        this.$router.push('/machine/new/' + this.id)
      },
      back() {
        this.$router.push('/machines');
      },
      deleteUser() {
        console.log(this.id)
      },
      onRequest() {
        this.showLoading("consultando empleado...");
        ServiceApi.get("/machine/" + this.id).then(response => {
            this.data = response.data;
          this.hideLoading()
        }).catch(error => {
          this.Noty("error", error.message)
          this.hideLoading()
        });
      }
    },
    data() {
      return {
        id: this.$router.history.current.params.id,
        loading: true,
        data: {},
      }
    }
  }
</script>
