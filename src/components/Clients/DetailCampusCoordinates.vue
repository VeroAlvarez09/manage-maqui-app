<template>
  <q-dialog v-model="openCoordinates" :maximized="this.$q.platform.is.mobile" persistent>
    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-page-container>
        <q-page padding>
          <q-card style="max-width: 500px">
            <q-card-section>
              <q-btn flat round icon="keyboard_backspace" v-close-popup @click="closeOpenCoordinates(campus,false)"/>
            </q-card-section>
            <q-separator/>

            <q-card-section>
              <gmap-map
                :center="center"
                :zoom="17"
                :options="mapObtions"
                style="width: 100%; height: calc(100vh - 50px)"
                @center_changed="setPlace"
              >
                <GmapMarker :position="markerPosition" :icon="markerOptions"/>
              </gmap-map>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="primary" type="reset" v-close-popup :disable="loading"
                     @click="closeOpenCoordinates(campus,false)"/>
              <q-btn label="Guardar" type="submit" color="green" :disable="loading" :loading="loading"
                     @click="updateCoordinates(campus.id)"/>
            </q-card-actions>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>
<script>
  import ServiceApi from "src/helpers/ServiceApi";
  import {Loading, Noty} from "../../mixins/index";
  import Vue from "vue";
  import * as VueGoogleMaps from "vue2-google-maps";

  Vue.use(VueGoogleMaps, {
    load: {
      key: process.env.API_KEY_MAPS
    }
  });
  export default {
    name: "ClientDetailCampusCoordinates",
    mounted() {
      if (!this.propsCampus.latitud || !this.propsCampus.longitud) this.geolocate();
      this.onRequest();
    },
    mixins: [Loading, Noty],
    props: {
      propsCampus: Object,
      propsOpenCoordinates: Boolean,
      closeOpenCoordinates: Function,
    },
    methods: {
      geolocate: function () {
        navigator.geolocation.getCurrentPosition(position => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.markerPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        });
      },
      setPlace(place) {
        this.markerPosition.lat = place.lat();
        this.markerPosition.lng = place.lng();
      },
      onRequest() {
        if (!this.propsCampus) {
          this.showLoading("consultando coordenadas...");
          ServiceApi.get("/customers/get/campus?id=" + this.campus.id).then(response => {
            const {status, message, campus} = response.data;
            if (status) {
              let {latitud, longitud} = campus;
              this.campus = campus;
              this.center = {lat: latitud, lng: longitud};
            } else {
              this.Noty("error", message)
            }
            this.loading = false;
            this.hideLoading()
          }).catch(error => {
            this.Noty("error", error.message)
            this.hideLoading()
          });
        }
      },
      updateCoordinates(id) {
        this.loading = true;
        ServiceApi.post("/customers/set/campus/update/coordinates", {
          latitud: this.markerPosition.lat,
          longitud: this.markerPosition.lng,
          id
        }).then(response => {
          const {status, message, campus} = response.data;
          this.loading = false;
          if (status) {
            this.Noty("success", message)
            this.closeOpenCoordinates(campus, false)
          } else {
            this.Noty("error", message)
            this.closeOpenCoordinates(this.campus, false)
          }
        }).catch(error => {
          this.Noty("error", error.message)
          this.loading = false;
          this.closeOpenCoordinates(this.campus, false)
        });
      },
    },
    data() {
      return {
        loading: false,
        campus: this.propsCampus,
        openCoordinates: this.propsOpenCoordinates,

        mapObtions: {
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
          disableDefaultUi: false
        },
        markerOptions: {
          url: "https://ikiero.s3.amazonaws.com/Recursos+ikiero/location.png",
          size: {width: 50, height: 50, f: "px", b: "px"},
          scaledSize: {width: 45, height: 45, f: "px", b: "px"}
        },

        markerPosition: {lat: parseFloat(this.propsCampus.latitud), lng: parseFloat(this.propsCampus.longitud)},
        center: {lat: parseFloat(this.propsCampus.latitud), lng: parseFloat(this.propsCampus.longitud)},
      }
    }
  }
</script>
