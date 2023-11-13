<template>
  <div class="q-pa-md">
    <q-table
      title="Confuguraciones"
      :data="data"
      :columns="columns"
      :pagination.sync="pagination"
      row-key="id"
      :loading="loading"
      :filter="filter"
      @request="onRequest"
      binary-state-sort
      :max="5"
      rows-per-page-label="Columnas por página"
      loading-label="Consultando Usuarios"
      no-results-label="No hay resultados"
      no-data-label="No hay resultados"
    >
      <template v-slot:top-left>
        <q-btn color="primary" @click="openModalConfig()">Crear configuración</q-btn>
      </template>
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
          <q-td>
            <q-item>{{ props.row.id }}</q-item>
          </q-td>
          <q-td>
            <q-item>{{ props.row.genConfigurationCommerce.nombre }}</q-item>
          </q-td>
          <q-td>
            <q-item>{{ props.row.genConfigurationCommerce.descripcion }}</q-item>
          </q-td>
          <q-td>
            <q-item>{{ props.row.activo === 1 ? "SI" : "NO" }}</q-item>
          </q-td>
          <q-td>
            <q-item>{{ props.row.created_at | date }}</q-item>
          </q-td>
          <q-td auto-width>
            <q-btn flat round dense icon="list">
              <q-menu>
                <q-list style="min-width: 100px">
                  <q-item clickable v-close-popup>
                    <q-item-section
                      @click="openModalConfig(props.row.genConfigurationCommerce,props.row.valor,props.row.id)"
                    >Editar
                    </q-item-section
                    >
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section @click="onDelete(props.row.id)"
                    >Eliminar
                    </q-item-section
                    >
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
          <q-td auto-width>
            <q-btn
              v-if="props.row.valor"
              size="sm"
              color="primary"
              round
              dense
              @click="props.expand = !props.expand"
              :icon="props.expand ? 'remove' : 'add'"
            />
          </q-td>
        </q-tr>

        <q-tr v-show="props.expand" :props="props" v-if="props.row.valor.length > 0">
          <q-td colspan="100%">
            <div class="text-left">
              <b>Configuración</b>
            </div>
            <q-card :style="$q.screen.width < 800 ? `` : 'width: 60%;'">
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label caption v-for="config in props.row.valor" class="q-pt-xs">
                      <div class="text-left">
                        <b>{{ config.description }}</b>
                      </div>
                      <b>{{ config.title }}: </b>
                      <label v-if="config.type === 'text' || config.type === 'boolean'"> {{ config.value }} </label>
                      <label v-else>{{ config.value }} - {{ config.optionsValue.label }}</label>

                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </q-td>
        </q-tr>

      </template>
      <div slot="pagination" slot-scope="props" class="row flex-center q-py-sm">
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
    <!-- MODAL ADD USUARIO -->
    <modal-config ref="updateConfig" :configs="configs" :commerceId="commerceId"
                  :onRequest="onRequest"></modal-config>
  </div>
</template>

<script>
import ServiceApi from "src/helpers/ServiceApi";
import qs from "qs";

import {Filters} from "src/mixins";
import ModalConfig from "./ModalConfig";

export default {
  name: "configuration-commerce",
  components: {ModalConfig},
  props: {},
  mixins: [Filters],
  created() {
    this.onRequest();
  },
  methods: {
    onRequest() {
      this.loading = true;
      const str = qs.stringify({commerceId: this.$router.history.current.params.id});
      ServiceApi.get("/customers/configurations?" + str)
        .then(response => {
          const {result, configs} = response.data;
          const {data, page, lastPage, total} = result;

          this.data = data;
          this.pagination.totalPage = lastPage;
          this.pagination.total = total;
          this.configs = configs
          this.pagination.page = page;
          this.pagination.rowsNumber = lastPage;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    onDelete(id) {
      this.loading = true;
      ServiceApi.detroy("/customers/configurations/" + id)
        .then(response => {
          this.loading = false;
          if (response.data.status) {
            this.data = this.data.filter(d => d.id !== id);
          }
        })
        .catch(error => {
          console.log(error)
          this.loading = false;
        });
    },
    openModalConfig(config = {id: null, label: "", value: null, edit: false}, value = null, id = null) {
      if (id) {
        this.$refs.updateConfig.id = id;
        config.valor = value;
        config.edit = true;
      }
      config.label = config.nombre;
      this.$refs.updateConfig.show = true;
      this.$refs.updateConfig.config = config;
      this.$refs.updateConfig.title = id ? "Editar configuración" : "Crear configuración";
    },
  },
  data() {
    return {
      modal: false,
      loading: true,
      filter: "",
      pagination: {
        sortBy: "id",
        descending: false,
        page: 1,
        rowsPerPage: 15
      },
      columns: [
        {name: "id", align: "left", field: "id", sortable: true, label: "ID"},
        {name: "name", align: "left", label: "Nombre", field: "nombre"},
        {name: "descripcion", align: "left", label: "descripcion", field: "descripcion"},
        {name: "activo", align: "left", label: "Activo", field: "activo"},
        {name: "created_at", align: "left", label: "Fecha", field: "created_at"},
        {name: "actions", align: "left", label: "Acciones", field: "actions"},
        {name: "more", align: "left", label: "Ver mas", field: "more"},
      ],
      data: [],
      configs: [],
      commerceId: parseInt(this.$router.history.current.params.id)
    };
  }
};
</script>
