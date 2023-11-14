const routes = [
  {
    path: "/login",
    component: () => import("layouts/LoginLayout.vue"),
    children: [{ path: "", component: () => import("pages/Login.vue") }]
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Index.vue") },
      {
        path: "/configuraciones",
        component: () => import("components/Configs/index.vue")
      },
      //Rutas para los comercios
      {
        path: "/clients",
        component: () => import("components/Clients/List.vue")
      },
      {
        path: "/client/detail/:id",
        component: () => import("components/Clients/Detail.vue")
      },

      // Rutas para los pedidos.
      {
        path: "/orders",
        component: () => import("components/Orders/index.vue")
      },

      {
        path: "/services",
        component: () => import("components/Servicios/index.vue")
      },

      // Rutas para los socios.
      {
        path: "/zone/partners",
        component: () => import("components/ZonePartners/List.vue")
      },
      {
        path: "/zone/partner/detail/:id",
        component: () => import("components/ZonePartners/Detail.vue")
      },
      {
        path: "/zone/partner/new/:id",
        component: () => import("components/ZonePartners/New.vue")
      },

      // Rutas para los empleados.
      {
        path: "/employees",
        component: () => import("components/Employees/List.vue")
      },
      {
        path: "/employee/detail/:id",
        component: () => import("components/Employees/Detail.vue")
      },
      {
        path: "/employee/new/:id",
        component: () => import("components/Employees/New.vue")
      },

      // Rutas para las maquina
      {
        path: "/machines",
        component: () => import("components/Machines/List.vue")
      },
      {
        path: "/machine/detail/:id",
        component: () => import("components/Machines/Detail.vue")
      },
      {
        path: "/machine/new/:id",
        component: () => import("components/Machines/New.vue")
      },

      // Rutas para los domiciliarios.
      {
        path: "/domiciliary",
        component: () => import("components/Domiciliary/List.vue")
      },
      {
        path: "/domiciliary/detail/:id",
        component: () => import("components/Domiciliary/Detail.vue")
      },
      {
        path: "/domiciliary/new/:id",
        component: () => import("components/Domiciliary/New.vue")
      },
      //Cobrar
      {
        path: "/cobros",
        component: () => import("components/Employees/Hours/List.vue")
      },
      {
        path: "/marketing",
        component: () => import("components/Marketing/index.vue")
      },

      //Rutas para los Usuarios App
      {
        path: "/users",
        component: () => import("components/UsersApp/List.vue")
      },
      {
        path: "/user/detail/:id",
        component: () => import("components/UsersApp/Detail.vue")
      },

      //Rutas para los roles
      {
        path: "/admin/role",
        component: () => import("components/Roles/List.vue")
      },
      {
        path: "/admin/role/detail/:id",
        component: () => import("components/Roles/Detail.vue")
      },
      {
        path: "/admin/role/new/:id",
        component: () => import("components/Roles/New.vue")
      },

      //Rutas para los permisos
      {
        path: "/admin/permission",
        component: () => import("components/Permissions/List.vue")
      },
      {
        path: "/admin/permission/detail/:id",
        component: () => import("components/Permissions/Detail.vue")
      },
      {
        path: "/admin/permission/new/:id",
        component: () => import("components/Permissions/New.vue")
      },

      //Rutas para los modulos
      {
        path: "/admin/module",
        component: () => import("components/Modules/List.vue")
      },
      {
        path: "/admin/module/detail/:id",
        component: () => import("components/Modules/Detail.vue")
      },
      {
        path: "/admin/module/new/:id",
        component: () => import("components/Modules/New.vue")
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
