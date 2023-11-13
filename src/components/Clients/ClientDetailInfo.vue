<template>
  <q-card-section>
    <div class="row justify-center">
      <div class="col-12 col-md-4">
        <strong>Id</strong>
        <p>{{ data.id }}</p>
      </div>

      <div class="col-12 col-md-4">
        <strong>Nit</strong>
        <p>{{ data.nit }}</p>
      </div>

      <div class="col-12 col-md-4">
        <strong>Nombre comercio</strong>
        <p>{{ data.nombre_comercio }}</p>
      </div>

      <div class="col-12 col-md-4">
        <strong>Usuario</strong>
        <p>{{ data.name }} {{ data.lastname }}</p>
      </div>

      <div class="col-12 col-md-4">
        <strong>Categoria</strong>
        <p>{{ data.categoria }}</p>
      </div>

      <div class="col-12 col-md-4">
        <strong>Slogan</strong>
        <p>{{ data.slogan_comercio }}</p>
      </div>

      <div class="col-12 col-md-4">
        <strong>Subdominio</strong>
        <p>
          <a :href="`https://${data.subdominio}.ikiero.com`">{{
            `https://${data.subdominio}.ikiero.com`
          }}</a>
        </p>
      </div>

      <div class="col-12 col-md-4">
        <strong>Municipio</strong>
        <p>{{ data.municipio }}</p>
      </div>

      <div class="col-12 col-md-4">
        <strong>Dirección</strong>
        <p>{{ data.direccion_comercio }}</p>
      </div>

      <div class="col-12 col-md-4">
        <strong>N° Confirmación pedidos</strong>
        <p>
          <a :href="`tel:${data.numero_confirmacion}`">{{
            data.numero_confirmacion
          }}</a>
        </p>
      </div>

      <div class="col-12 col-md-4" v-if="debeIkiero">
        <strong>Debe a ikiero</strong>
        <p>${{ debeIkiero | currency }}</p>
      </div>
      <div class="col-12 col-md-4">
        <q-input
          dense
          outline
          v-model="data.por_ganancia"
          label="% Negociación"
        >
          <template v-slot:append>
            <q-icon
              name="save"
              class="cursor-pointer"
              @click="updateInfoComercio()"
            />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-12" v-if="data.descripcion_actividad">
        <strong>Descripción actividad</strong>
        <p>{{ data.descripcion_actividad }}</p>
      </div>
    </div>
  </q-card-section>
</template>

<script>
import { Loading, Filters, Noty } from "../../mixins/index";
import ServiceApi from "../../helpers/ServiceApi";
export default {
  name: "ClientDetailInfo",
  mixins: [Filters, Loading, Noty],
  props: {
    data: Object,
    debeIkiero: Number
  },
  filters: {
    capitalize: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  methods: {
    updateInfoComercio() {
      this.showLoading("Guardando información...");
      ServiceApi.post("/update/info/commerce", {
        comercio_id: this.data.id,
        por_ganancia: this.data.por_ganancia
      })
        .then(response => {
          this.hideLoading();
          this.Noty("success", response.data.message);
        })
        .catch(e => {
          this.hideLoading();
          this.Noty("error", "Ocurrió un error intentalo nuevamente.");
        });
    }
  }
};
</script>
