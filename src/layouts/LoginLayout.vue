<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="q-pa-md">
      <q-toolbar>
        <q-toolbar-title class="row absolute-center">
          Manage Maqui App
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-footer class="bg-warning q-pa-lg-md">
      <q-toolbar>
        <q-toolbar-title class="text-center text-md-left mb-0 mb-md-0 px-0"><b class="color-gray">Copyright
          2023</b> <br> maquiapp.com
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
  export default {
    name: 'LoginLayout',

    data() {
      return {
        leftDrawerOpen: false,
      }
    }
  }
</script>
