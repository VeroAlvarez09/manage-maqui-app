<template>
    <q-page class="row bg-grey-3 items-center justify-evenly">
      <login/>
    </q-page>
</template>

<script lang="ts">
import Login from 'components/Login/Index.vue'

export default {
  name: 'PageLogin',
  components: { Login }
}
</script>
