// import { h } from 'vue'
import { h } from "vue";
import {
  /* RouterView,  type RouteLocation, */ RouterView,
  type RouteRecordRaw,
} from "vue-router";

// import { UserRight, useAuthStore } from '@/stores/auth.store'

// function redirectToClosestPage(to: RouteLocation, from: RouteLocation) {
//   const authStore = useAuthStore() // Используем хранилище авторизации
//   // Найдем в пути индекс корневой страницы подсистемы
//   const pathIndex: number = to.matched.findIndex((route) => route.meta.subsystem)

//   if (pathIndex > -1) {
//     // Если индекс найден, редирект на ближайшую страницу к корневой странице подсистемы
//     return to.matched[pathIndex].path
//   } else {
//     // Иначе если индекс не найден
//     if (authStore.user) {
//       // И пользователь авторизован, вернуть туда, откуда пришел с некоторыми исключениями
//       if (from.fullPath !== '/login' && from.fullPath !== to.fullPath) {
//         return from.fullPath
//       } else {
//         return '/'
//       }
//     } else {
//       // И пользователь не авторизован, редирект на страницу входа
//       return '/login'
//     }
//   }
// }

// function adminOrSysadminCheckup(to: RouteLocation, from: RouteLocation) {
//   const authStore = useAuthStore() // Используем хранилище авторизации
//   const hasRight = authStore.user?.UserRights.find(
//     (right: UserRight) => right.AppId === 1 && (right.RightId === 4 || right.GroupId === 1),
//   )
//   if (!(hasRight || authStore.user?.IsAdmin)) return redirectToClosestPage(to, from)
// }

// function hiddenItemForCommons(): boolean {
//   const authStore = useAuthStore() // Используем хранилище авторизации
//   const hasRight = authStore.user?.UserRights.find(
//     (right: UserRight) => right.AppId === 1 && (right.RightId === 4 || right.GroupId === 1),
//   )

//   if (hasRight || authStore.user?.IsAdmin) return false

//   return true
// }

export default [
  {
    path: "/operational-monitoring",
    name: "1",
    redirect: { name: "dashboardMonitoring" },
    meta: {
      id: "5a301b10-8fa0-4743-897f-c8d7cc32def2",
      subsystem: true,
      pageTitle: "Оперативный мониторинг",
      tabTitle: "Оперативный мониторинг",
      menuItems: [
        {
          id: "f5e4eb5f-8d4d-436b-95f7-abde77a7fa0e",
          type: "router-link",
          to: { name: "dashboardMonitoring" },
          text: "Главная",
          icon: "house",
        },
        // {
        //   id: 'eb23d5fb-cab8-4561-bc97-e42252566827',
        //   type: 'router-link',
        //   to: { name: 'calendarMonitoring' },
        //   text: 'Календарь',
        //   icon: 'calendar-days',
        // },
        // {
        //   id: '5ba9c9ca-83e3-4969-916a-dcab09a880c6',
        //   type: 'router-link',
        //   to: { name: 'reportsList' },
        //   text: 'Отчёты',
        //   icon: 'file-excel',
        //   // hidden: hiddenReportItem,
        //   // children: [
        //   //   {
        //   //     id: "0f5dce1c-d07c-41ac-9aaa-21dd8ef9ddb6",
        //   //     type: "router-link",
        //   //     to: { name: "usersActivity" },
        //   //     text: "Активность",
        //   //     icon: "chart-simple",
        //   //   },
        //   // ],
        // },
        // {
        //   id: '8551ae82-e8fe-4556-b457-6e43d1c51ad8',
        //   type: 'router-link',
        //   to: { name: 'templatesList' },
        //   text: 'Шаблоны',
        //   icon: 'file',
        //   // hidden: hiddenAdminItem,
        //   // children: [
        //   //   {
        //   //     id: "0f5dce1c-d07c-41ac-9aaa-21dd8ef9ddb6",
        //   //     type: "router-link",
        //   //     to: { name: "usersActivity" },
        //   //     text: "Активность",
        //   //     icon: "chart-simple",
        //   //   },
        //   // ],
        // },
      ],
    },
    children: [
      {
        path: "dashboard",
        name: "dashboardMonitoring",
        component: () => import("../views/monitoring/DashboardView.vue"),
        meta: {
          id: "c7e23263-17a2-490e-b2bc-aa344f9be99d",
          pageTitle: "Главная",
          tabTitle: "Главная",
        },
      },
      // {
      //   path: 'calendar',
      //   name: 'calendarMonitoring',
      //   component: () => import('../views/monitoring/CalendarView.vue'),
      //   meta: {
      //     id: 'c096db73-bfe4-48b3-bcde-ba10f636b72b',
      //     pageTitle: 'Календарь',
      //     tabTitle: 'Календарь',
      //   },
      //   //   beforeEnter: [adminOrSysadminCheckup],
      // },
      // {
      //   path: 'reports',
      //   name: 'reportsWrap',
      //   component: { render: () => h(RouterView) },
      //   children: [
      //     // {
      //     //       path: '',
      //     //       name: 'reportsList',
      //     //       component: () => import('../views/monitoring/ReportsView.vue'),
      //     //       meta: {
      //     //         id: '7fe5be45-70d8-4c8e-8234-15aa39623f38',
      //     //         pageTitle: 'Отчёты',
      //     //         tabTitle: 'Отчёты',
      //     //       },
      //     //       // Можно сделать проверку права входа через этот хук, а можно и через компонентный guard
      //     //       // beforeEnter: [rightsToReportsCheckup],
      //     // },
      //     {
      //       path: ':reportId',
      //       name: 'reportItem',
      //       component: () => import('../views/monitoring/ReportView.vue'),
      //       meta: {
      //         id: 'f1e9a289-4198-4829-883f-7d44f9a96b91',
      //         pageTitle: 'Отчёт',
      //         tabTitle: 'Отчёт',
      //       },
      //       // Либо другую проверку (если любое право на подсистему), либо убрать
      //       // beforeEnter: [rightsToReportsCheckup],
      //     },
      //   ],
      // },
      // {
      //   path: 'templates',
      //   name: 'templatesWrap',
      //   component: { render: () => h(RouterView) },
      //   children: [
      //     // {
      //     //   path: '',
      //     //   name: 'templatesList',
      //     //   component: () => import('../views/monitoring/TemplatesView.vue'),
      //     //   meta: {
      //     //     id: '00395a20-153d-43b1-920f-6e78fe952636',
      //     //     pageTitle: 'Шаблоны',
      //     //     tabTitle: 'Шаблоны',
      //     //   },
      //     //   // beforeEnter: [adminCheckup],
      //     // },
      //     {
      //       path: ':templateId',
      //       name: 'templateItem',
      //       component: () => import('../views/monitoring/TemplateView.vue'),
      //       meta: {
      //         id: '5aeaf462-62e8-4c55-9461-63fd8a89a96d',
      //         pageTitle: 'Моделирование шаблона',
      //         tabTitle: 'Моделирование шаблона',
      //       },
      //       // beforeEnter: [adminCheckup],
      //     },
      //   ],
      // },
    ],
  },
] as RouteRecordRaw[];
