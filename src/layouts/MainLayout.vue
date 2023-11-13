<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="q-pa-sm">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title>Manage Maqui App</q-toolbar-title>
        <div>
          <q-btn flat round dense icon="account_circle">
            <q-menu>
              <q-list style="min-width: 100px">
                <!--                <q-item clickable v-close-popup>-->
                <!--                  <q-item-section>Mi perfil</q-item-section>-->
                <!--                </q-item>-->
                <q-item clickable v-close-popup>
                  <q-item-section @click="logout"
                  >Cerrar session
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>

      <!--      <q-toolbar inset>-->
      <!--        <q-breadcrumbs active-color="white" style="font-size: 16px">-->
      <!--          <q-breadcrumbs-el icon="home" to="/"/>-->
      <!--          <q-breadcrumbs-el label="customer" icon="assignment_ind" to="/start/pick-quasar-flavour"/>-->
      <!--        </q-breadcrumbs>-->
      <!--      </q-toolbar>-->
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="250"
      :breakpoint="600"
    >
      <q-scroll-area
        style="height: calc(100% - 220px); margin-top: 220px; border-right: 1px solid #ddd"
      >
        <q-list padding>
          <EssentialLink
            v-for="link in essentialLinks"
            :key="link.title"
            v-bind="link"
            :to="link"
          />
        </q-list>
      </q-scroll-area>

      <div class="absolute-top">
        <div class="bg-primary text-center">
          <q-img
            src="../assets/maquiApp.png"
            style="width: 55%"
          />
        </div>
        <div class="q-mb-lg">
          <br/>
          <div class="text-center text-weight-bold">
            {{ this.$store.state.user.name }}
            {{ this.$store.state.user.lastName }}
          </div>
          <div class="text-center q-ml-md q-mr-md overflow-hidden">
            {{ this.$store.state.user.email }}
          </div>
        </div>
        <q-separator/>
      </div>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink";
import {mapMutations, mapState} from "vuex";

export default {
  name: "MainLayout",
  components: {
    EssentialLink
  },
  computed: {
    ...mapState(["user"])
  },
  methods: {
    ...mapMutations(["SET_TOKEN", "SET_USER"]),
    logout() {
      localStorage.setItem("token", "");
      localStorage.setItem("user", "");
      this.SET_USER("");
      this.SET_TOKEN("");
      this.$router.push({path: "/login"});
    }
  },
  created() {
    if (!this.$store.state.token || !localStorage.getItem("token")) {
      this.$router.push({path: "/login"});
    } else {
      this.SET_USER(JSON.parse(localStorage.getItem("user")));
      this.SET_TOKEN(localStorage.getItem("token"));
    }
  },
  data() {
    return {
      login: false,
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: "Operadores",
          icon: "supervisor_account",
          link: "/employees"
        },
        {
          title: "Maquinas",
          icon: "settings",
          link: "/machines"
        },
        {
          title: "Horas totales",
          icon: "access_time",
          link: "/cobros"
        },
        {
          title: "Orden de servicio",
          icon: "monetization_on",
          link: "/cobros"
        },
        // {
        //   title: "Administración",
        //   icon: "beenhere",
        //   link: "#",
        //   expand: true,
        //   expandItem: false,
        //   links: [
        //     {
        //       title: "Roles (Dashboard)",
        //       icon: "settings_applications",
        //       link: "/admin/role"
        //     },
        //     {
        //       title: "Permisos (Dashbaord)",
        //       icon: "lock",
        //       link: "/admin/permission"
        //     },
        //     {
        //       title: "Modulos (Dashbaord)",
        //       icon: "list",
        //       link: "/admin/module"
        //     }
        //   ]
        // }
      ]
    };
  }
};
</script>
