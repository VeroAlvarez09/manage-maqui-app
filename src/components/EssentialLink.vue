<template>
  <div>
    <q-expansion-item v-if="expand"
                      v-model="expandItem"
                      :icon="icon"
                      :label="title"
    >
      <q-item
        v-for="link in links"
        clickable
        tag="a"
        :to="link.link"
        class="q-ml-md"
      >
        <q-item-section
          v-if="link.icon"
          avatar
        >
          <q-icon :name="link.icon"/>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ link.title }}</q-item-label>
          <q-item-label caption>
            {{ link.caption }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-expansion-item>

    <q-item
      v-if="!expand"
      clickable
      tag="a"
      :to="link"
    >
      <q-item-section
        v-if="icon"
        avatar
      >
        <q-icon :name="icon"/>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ title }}</q-item-label>
        <q-item-label caption>
          {{ caption }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
export default {
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: '#'
    },
    icon: {
      type: String,
      default: ''
    },
    expand: {
      type: Boolean,
      default: false
    },
    expandItem: {
      type: Boolean,
      default: false
    },
    links: {
      type: Array,
      default: []
    }
  }
}
</script>
