<template>
  <q-card style="width: 360px" v-if="domiciliario">
    <q-toolbar>
      <q-toolbar-title><span class="text-weight-bold">Información del domiciliario</span></q-toolbar-title>
      <q-btn flat round dense icon="close" v-close-popup/>
    </q-toolbar>
    <q-card-section class="row items-center">
      <div class="col-12">
        <b>ID:</b><span class="q-ml-sm">{{ domiciliario.id }}</span>
      </div>
      <div class="col-12">
        <b>Nombres/Apellido:</b><span
        class="q-ml-sm">{{ domiciliario.nombre }} {{ domiciliario.apellidos }}</span>
      </div>
      <div class="col-12">
        <b>Celular:</b><span
        class="q-ml-sm">+57 {{ domiciliario.celular }}</span>
      </div>
      <div class="absolute-top-right q-mr-md cursor-pointer">
        <q-btn no-caps size="sm" icon="chat" @click="sendMessageWhatsapp()"/>
      </div>
      <div class="absolute-top-right q-mr-md q-mt-xl cursor-pointer">
        <q-btn size="sm" no-caps icon="phone_in_talk" @click="goCall()"/>
      </div>
    </q-card-section>
  </q-card>
  <q-card v-else-if="!domiciliario">
    <q-toolbar>
      <q-toolbar-title><span class="text-weight-bold">El pedido no tiene domiciliario asignado.</span></q-toolbar-title>
      <q-btn flat round dense icon="close" v-close-popup/>
    </q-toolbar>
  </q-card>
</template>
<script>
export default {
  name: "ModalDomi",
  props: {
    domiciliario: {
      type: Object,
      default: {}
    },
  },
  methods: {
    sendMessageWhatsapp() {
      const {celular, nombre, apellidos} = this.domiciliario;
      window.open(
        `https://api.whatsapp.com/send?phone=57${celular}&text=Hola%20${nombre} ${apellidos}%20cuentanos%20por%20favor%20¿en%20que%20proceso%20del%20pedido%20te%20encuentras?`
      );
    },
    goCall() {
      const {celular} = this.domiciliario;
      window.location = "tel:+57" + celular;
    },
  }
}
</script>
