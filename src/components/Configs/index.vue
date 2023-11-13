<template>
  <div class="q-pa-md">
    <q-card>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="cities" label="Ciudades" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="cities">
          <cities></cities>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script>
import ServiceApi from "src/helpers/ServiceApi";
import { Filters } from "../../mixins/index";
import Cities from "./Ciudades";
export default {
  name: "config-app",
  mixins: [Filters],
  components: {
    Cities
  },
  data() {
    return {
      tab: "cities"
    };
  }
};
</script>
