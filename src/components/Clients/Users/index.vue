<template>
  <div class="q-pa-md">
    <q-table
      title="Usuarios"
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
        <q-btn color="primary" @click="openModalUser()">Crear usuario</q-btn>
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
            <q-item>{{ props.row.name }}</q-item>
          </q-td>
          <q-td>
            <q-item>{{ props.row.lastname }}</q-item>
          </q-td>
          <q-td>
            <q-item>{{ props.row.phone }}</q-item>
          </q-td>
          <q-td>
            <q-item>{{ props.row.email }}</q-item>
          </q-td>
          <q-td>
            <q-item>{{ props.row.created_at | date }}</q-item>
          </q-td>
          <q-td auto-width>
            <q-btn flat round dense icon="list">
              <q-menu>
                <q-list style="min-width: 100px">
                  <q-item clickable v-close-popup>
                    <q-item-section @click="openModalUser(props.row)"
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
    <modal-user ref="modalUser" :roles="roles" :permissions="permissions" :comercio_id="comercio_id"
                :onRequest="onRequest"></modal-user>
  </div>
</template>

<script>
import ServiceApi from "src/helpers/ServiceApi";
import qs from "qs";

import {Filters} from "../../../mixins/index";
import ModalUser from "./ModalUser";

export default {
  name: "Usuarios-dashboard",
  components: {ModalUser},
  props: {},
  mixins: [Filters],
  created() {
    this.onRequest();
  },
  methods: {
    onRequest() {
      this.loading = true;
      const str = qs.stringify({comercio_id: this.$router.history.current.params.id});
      ServiceApi.get("/admin/users?" + str)
        .then(response => {
          const {roles, users, permissions} = response.data;
          const {data, page, lastPage, total} = users;

          //Modificar la data del usuario para poder mostrar los roles y permisos
          const newUser = data.map(user => {
            user.roles = user.roles.map(rol => {
              rol.value = rol.id;
              rol.label = rol.name
              return rol;
            })
            user.permissions = user.permissions.map(permission => {
              permission.value = permission.id;
              permission.label = permission.name
              return permission;
            })
            return user;
          })

          this.data = newUser;
          this.roles = roles;
          this.permissions = permissions
          this.pagination.totalPage = lastPage;
          this.pagination.total = total;
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
      ServiceApi.detroy("/admin/users/" + id)
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
    openModalUser(user = {id: null, name: "", lastname: "", phone: "", email: "", roles: [], permissions: []}) {
      this.$refs.modalUser.show = true;
      this.$refs.modalUser.user = user;
      this.$refs.modalUser.title = user.id ? "Editar usuario" : "Crear usuario";
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
        {name: "name", align: "left", label: "Nombre", field: "name"},
        {name: "lastname", align: "left", label: "Apellido", field: "lastname"},
        {name: "phone", align: "left", label: "Celular", field: "phone"},
        {name: "email", align: "left", label: "Correo", field: "email"},
        {name: "created_at", align: "left", label: "Fecha", field: "created_at"},
        {name: "actions", align: "left", label: "Acciones", field: "actions"}
      ],
      data: [],
      roles: [],
      permissions: [],
      comercio_id: parseInt(this.$router.history.current.params.id)
    };
  }
};
</script>
