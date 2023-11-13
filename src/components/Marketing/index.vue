<template>
  <q-layout view="lHh lpr lFf" class="shadow-2 rounded-borders">
    <q-card flat bordered class>
      <q-card-section>
        <div class="text-h6">Envío de emails</div>
      </q-card-section>
      <q-separator inset></q-separator>
      <q-card-section>
        <q-form @submit="onSubmit" ref="email">
          <div class="q-gutter-md">
            <q-select
              label="Destinatarios"
              dense
              v-model="destinatarios"
              use-input
              use-chips
              multiple
              hide-dropdown-icon
              input-debounce="0"
              new-value-mode="add"
              lazy-rules
              :rules="[
                val =>
                  (val && val.length > 0) ||
                  'El o los destinatarios son requeridos.'
              ]"
            />
            <q-input
              dense
              v-model="asunto"
              label="Asunto"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'El asunto es requerido.'
              ]"
            />
            <q-input
              dense
              v-model="titulo"
              label="Título"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'El título es requerido.'
              ]"
            />
            <!-- <q-editor
              v-model="mensaje"
              :dense="$q.screen.lt.md"
              :toolbar="[
                [
                  {
                    label: $q.lang.editor.align,
                    icon: $q.iconSet.editor.align,
                    fixedLabel: true,
                    list: 'only-icons',
                    options: ['left', 'center', 'right', 'justify']
                  },
                  {
                    label: $q.lang.editor.align,
                    icon: $q.iconSet.editor.align,
                    fixedLabel: true,
                    options: ['left', 'center', 'right', 'justify']
                  }
                ],
                [
                  'bold',
                  'italic',
                  'strike',
                  'underline',
                  'subscript',
                  'superscript'
                ],
                ['token', 'hr', 'link', 'custom_btn'],
                ['print', 'fullscreen'],
                [
                  {
                    label: $q.lang.editor.formatting,
                    icon: $q.iconSet.editor.formatting,
                    list: 'no-icons',
                    options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
                  },
                  {
                    label: $q.lang.editor.fontSize,
                    icon: $q.iconSet.editor.fontSize,
                    fixedLabel: true,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: [
                      'size-1',
                      'size-2',
                      'size-3',
                      'size-4',
                      'size-5',
                      'size-6',
                      'size-7'
                    ]
                  },
                  {
                    label: $q.lang.editor.defaultFont,
                    icon: $q.iconSet.editor.font,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: [
                      'default_font',
                      'arial',
                      'arial_black',
                      'comic_sans',
                      'courier_new',
                      'impact',
                      'lucida_grande',
                      'times_new_roman',
                      'verdana'
                    ]
                  },
                  'removeFormat'
                ],
                ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                ['undo', 'redo'],
                ['viewsource']
              ]"
              :fonts="{
                arial: 'Arial',
                arial_black: 'Arial Black',
                comic_sans: 'Comic Sans MS',
                courier_new: 'Courier New',
                impact: 'Impact',
                lucida_grande: 'Lucida Grande',
                times_new_roman: 'Times New Roman',
                verdana: 'Verdana'
              }"
            /> -->
            <q-input
              v-model="mensaje"
              filled
              type="textarea"
              label="El mensaje"
            />
            <q-btn type="submit" color="primary" label="Enviar email" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
    <modal-image ref="modalImage"></modal-image>
  </q-layout>
</template>

<script>
import ServiceApi from "src/helpers/ServiceApi";
import { Loading, Noty, Filters } from "../../mixins/index";
export default {
  name: "Marketing",
  mixins: [Loading, Noty],
  methods: {},
  data() {
    return {
      mensaje: null,
      destinatarios: null,
      asunto: null,
      titulo: null
    };
  },
  methods: {
    onSubmit() {
      this.$refs.email.validate().then(success => {
        if (success && this.mensaje) {
          this.showLoading("Enviando emails...");
          ServiceApi.post("/send/emails", {
            titulo: this.titulo,
            asunto: this.asunto,
            mensaje: this.mensaje,
            destinatarios: this.destinatarios
          })
            .then(response => {
              this.hideLoading();
              this.Noty("success", response.data.message);
            })
            .catch(e => {
              this.hideLoading();
              this.Noty("error", e.message);
            });
        } else {
          this.Noty("error", "EL mensaje es requerido.");
        }
      });
      // to reset validations:
      this.$refs.email.resetValidation();
    }
  }
};
</script>
