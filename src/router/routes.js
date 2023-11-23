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
      {
        path: "/employees/hours",
        component: () => import("components/Employees/Hours/List.vue")
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
      {
        path: "/machines/hours",
        component: () => import("components/Machines/Hours/List.vue")
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
