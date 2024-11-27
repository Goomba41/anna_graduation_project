// * Всё, что закомменчено - вырезанный функционал, для некоторых есть готовые (но чуть не доделанные)
// * страницы

import { h } from 'vue'
import { RouterView, type RouteRecordRaw } from 'vue-router'

export default [
  {
    path: '/admin',
    name: '2',
    redirect: { name: 'dashboardAdmin' },
    meta: {
      id: 'd94e813a-18ff-4775-8ade-ab0ad7536a94',
      subsystem: true,
      pageTitle: 'АРМ Администратора',
      tabTitle: 'АРМ Администратора',
      menuItems: [
        {
          id: '6dcb5628-9270-43f5-8a90-7ad8fc9d03d3',
          type: 'router-link',
          to: { name: 'dashboardAdmin' },
          text: 'Главная',
          icon: 'house',
        },
        {
          id: '0056054b-f4b9-4b6c-b72a-687c092a5714',
          type: 'router-link',
          to: { name: 'dbArchiving' },
          text: 'Архивация БД',
          icon: 'database',
        },
        {
          id: 'f60a2b70-342e-49b9-a098-3ab92de5a096',
          type: 'router-link',
          to: { name: 'usersList' },
          text: 'Пользователи',
          icon: 'users',
          children: [
            {
              id: 'b1343077-fe38-4b9e-9471-a7036912b6a9',
              type: 'router-link',
              to: { name: 'usersActivity' },
              text: 'Активность',
              icon: 'chart-simple',
            },
          ],
        },
        {
          id: '8a1e0952-3010-4772-a507-2fa86d7a4526',
          getItems: { yes: true, from: '/api/handbooks' },
          text: 'Справочники',
          icon: 'book',
          children: [],
        },
      ],
    },
    children: [
      {
        path: 'dashboard',
        name: 'dashboardAdmin',
        component: () => import('../views/admin/AdminDashboardView.vue'),
        meta: {
          id: '58b40f5b-7578-48d2-87ae-e68aead09c2d',
          pageTitle: 'Главная',
          tabTitle: 'Главная',
        },
      },
      {
        path: 'users',
        name: 'usersWrap',
        component: { render: () => h(RouterView) },
        children: [
          {
            path: '',
            name: 'usersList',
            component: () => import('../views/admin/AdminUsersView.vue'),
            meta: {
              id: '1dc51439-66b4-47ad-8e94-ef935f14be11',
              pageTitle: 'Пользователи',
              tabTitle: 'Пользователи',
            },
          },
          {
            path: 'activity',
            name: 'usersActivity',
            component: () => import('../views/admin/AdminUsersActivityView.vue'),
            meta: {
              id: '524d5f21-ef2a-463a-a0f0-262b8db990d7',
              pageTitle: 'Активность пользователей',
              tabTitle: 'Активность пользователей',
            },
          },
        ],
      },
      {
        path: 'databases-archiving',
        name: 'dbArchiving',
        component: () => import('../views/admin/AdminDBArchivingView.vue'),
        meta: {
          id: '1cafe8f1-9926-41b6-8df9-04817f44f208',
          pageTitle: 'Архивация БД',
          tabTitle: 'Архивация БД',
        },
      },
      {
        path: 'handbooks',
        name: 'handbooks',
        // component: { render: () => h(RouterView) },
        children: [
          {
            path: 'handbooke-one',
            name: 'handbookOne',
            component: () => import('../views/admin/handbooks/handbook-one.vue'),
            meta: {
              id: '5a45b06c-d977-48bc-ad95-35065c501394',
              pageTitle: 'Справочник 1',
              tabTitle: 'Справочник 1',
            },
          },
          {
            path: 'handbooke-two',
            name: 'handbookTwo',
            component: () => import('../views/admin/handbooks/handbook-two.vue'),
            meta: {
              id: '9aaaaf2a-5570-4478-9a56-b98b49a9fd42',
              pageTitle: 'Справочник 2',
              tabTitle: 'Справочник 2',
            },
          },
          // {
          //   path: ":indicatorId/accordance",
          //   name: "indicatorAccordance",
          //   component: () =>
          //     import("../views/admin/AdminIndicatorAccordanceView.vue"),
          //   meta: {
          //     id: "8adeb926-37cd-4d7f-9d8d-be9789a0e5ac",
          //     pageTitle:
          //       "Соответствие показателя и источников данных",
          //     tabTitle: "Соответствие показателя и источников данных",
          //   },
          // },
        ],
      },
    ],
  },
] as RouteRecordRaw[]
