<template>
  <q-dialog ref="dialog" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin" style="width: 360px">
      <q-toolbar>
        <q-toolbar-title><span class="text-weight-bold flex flex-center">Tiempo de recogida</span></q-toolbar-title>
      </q-toolbar>
      <q-card-section class="row items-center flex flex-center">
        <div class="text-subtitle2">
          <span class="text-grey">Por favor ingrese el tiempo en que el domiciliario puede llegar a recoger el pedido en el comercio.</span>
        </div>
        <q-btn class="glossy" round color="primary" icon="remove" size="sm" @click="onChangeRemove"/>
        <q-knob
          :min="0"
          :max="60"
          v-model="time"
          show-value
          font-size="16px"
          class="text-red q-ma-md"
          size="60px"
          :thickness="0.22"
          color="primary"
          track-color="grey-3"
        >
          <q-icon name="timer" class="q-mr-xs"/>
          {{ time }} Min
        </q-knob>
        <q-btn class="glossy" round color="primary" icon="add" size="sm" @click="onChangeAdd"/>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn color="primary" label="Aceptar Pedido" @click="onOKClick"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    minutes: {
      type: Number,
      require: true,
      default: 0
    }
  },
  data() {
    return {
      time: this.minutes
    }
  },
  emits: [
    'ok', 'hide'
  ],

  methods: {
    show() {
      this.$refs.dialog.show()
    },
    hide() {
      this.$refs.dialog.hide()
    },
    onChangeAdd() {
      if (this.time < 60) {
        this.time = this.time + 5;
      }
    },
    onChangeRemove() {
      if (this.time > 0) {
        this.time = this.time - 5;
      }
    },
    onDialogHide() {
      this.$emit('hide')
    },

    onOKClick() {
      this.$emit('ok', "00:" + this.time + ":00")
      this.hide()
    },
  }
}
</script>
