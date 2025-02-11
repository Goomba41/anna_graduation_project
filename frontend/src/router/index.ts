import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "@/stores/auth.store";
import { useLoadingStore } from "@/stores/loading.store";

import toast from "@/utils/toast";
import jwtParse, { type TToken } from "@/utils/jwt-parse";
import nameSystem from "@/utils/meme-naming";

// import adminRoutes from "./admin-routes";
// import monitoringRoutes from "./monitoring-routes";

/* Создание объекта маршрутизатора */
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: "smooth", top: 15 };
    }
    if (savedPosition) {
      return savedPosition;
    }

    return { top: 0 };
  },
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
      meta: {
        tabTitle: "Вход в систему",
      },
    },
    {
      path: "/",
      name: "wrapper",
      component: () => import("../components/InnerPageWrapper.vue"),
      children: [
        {
          path: "/",
          name: "home",
          component: () => import("../views/HomeView.vue"),
          meta: {
            pageTitle:
              import.meta.env.MODE !== "development"
                ? nameSystem()[2]
                : "АИС «Документооборот» - документооборот ООО «Находка-АИС»",
            id: "c3e1f260-d618-4b21-9594-c99d5aabf026",
            menuItems: [
              {
                id: "f712bb93-6265-45d8-acf5-c2e6f6b0e549",
                type: "router-link",
                to: { name: "home" },
                text: "Дэшборд",
                icon: "dashboard",
              },
              {
                id: "673bb66c-d07f-462e-99cc-242acf3f1f1c",
                type: "router-link",
                to: { name: "incoming" },
                text: "Входящие",
                icon: "incoming",
              },
              {
                id: "a913b33a-814e-42d4-9a16-42844959ca48",
                type: "router-link",
                to: { name: "outgoing" },
                text: "Исходящие",
                icon: "outgoing",
              },
              {
                id: "222e2376-33ed-4928-bf7b-62eec3fb918b",
                text: "Администрирование",
                icon: "admin",
                children: [
                  // {
                  //   id: "0056054b-f4b9-4b6c-b72a-687c092a5714",
                  //   type: "router-link",
                  //   // to: { name: "dbArchiving" },
                  //   text: "Архивация БД",
                  //   icon: "database",
                  // },
                  {
                    id: "f60a2b70-342e-49b9-a098-3ab92de5a096",
                    type: "router-link",
                    to: { name: "users" },
                    text: "Пользователи",
                    icon: "users",
                  },
                  {
                    id: "b1343077-fe38-4b9e-9471-a7036912b6a9",
                    type: "router-link",
                    to: { name: "institutions" },
                    text: "Учреждения",
                    icon: "organizations",
                  },
                  {
                    id: "92c2320a-4e20-4c58-bea3-4b916e9c7ce3",
                    type: "router-link",
                    to: { name: "log" },
                    text: "Журнал действий",
                    icon: "log",
                  },
                ],
              },
            ],
          },
        },
        {
          path: "incoming",
          name: "incoming",
          component: () => import("../views/materials/IncomingView.vue"),
          meta: {
            id: "ecd694c6-45ed-40d9-a99e-452659b7cf31",
            pageTitle: "Входящие материалы",
            tabTitle: "Входящие",
          },
        },
        {
          path: "outgoing",
          name: "outgoing",
          component: () => import("../views/materials/OutgoingView.vue"),
          meta: {
            id: "ffddbe4f-55d2-4624-9121-dbdce71452ad",
            pageTitle: "Исходящие материалы",
            tabTitle: "Исходящие",
          },
        },
        {
          path: "",
          name: "admin",
          redirect: { name: "users" },
          children: [
            {
              path: "/admin/users",
              name: "users",
              component: () => import("../views/admin/UsersView.vue"),
              meta: {
                id: "",
                pageTitle: "Пользователи",
                tabTitle: "Пользователи",
              },
            },
            {
              path: "/admin/institutions",
              name: "institutions",
              component: () => import("../views/admin/InstitutionsView.vue"),
              meta: {
                id: "1b0caf33-98ce-4f26-8f17-c7199f7a7d8f",
                pageTitle: "Учреждения",
                tabTitle: "Учреждения",
              },
            },
            {
              path: "/admin/log",
              name: "log",
              component: () => import("../views/admin/UsersActivityView.vue"),
              meta: {
                id: "f2039e94-70bd-4c31-be68-79d9dbdd11bd",
                pageTitle: "Журнал действий",
                tabTitle: "Журнал",
              },
            },
          ],
        },
        {
          path: "/about",
          name: "about",
          component: () => import("../views/AboutView.vue"),
          meta: {
            pageTitle: "О системе",
            tabTitle: "О системе",
            id: "67de5f39-5d2a-4acb-84a9-7d17535c7c14",
          },
        },
        {
          path: "/preferences",
          name: "preferences",
          component: () => import("../views/PreferencesView.vue"),
          meta: {
            pageTitle: "Предпочтения",
            tabTitle: "Предпочтения",
            id: "90b17e5d-a04a-4924-8d42-eec9a74a0976",
          },
        },
      ],
    },
  ],
});

/* Охранник, который проверяет, вошел ли пользователь в систему. Если нет, он перенаправляет на
страницу входа. */
router.beforeEach(async (to, from) => {
  const auth = useAuthStore(); // Используем хранилище авторизации

  if (to.path !== "/login") auth.returnUrl = to.fullPath;

  // const openPages = ["/login", "/preferences", "/about"]; // Страницы, не требующие проверки прав
  const authRequiredPage = !["/login"].includes(to.path); // Страницы, не требующие авторизации

  // Проверим не истек ли токен, на случай, если на странице не запрашивается бэк
  // и если истек, делаем выход и показываем тостер
  const token: TToken | null = jwtParse(localStorage.getItem("token"));

  const tokenExpired: boolean = token ? token.exp < new Date() : true;

  let userExpired = !auth.user;

  if (auth.user?.exp) userExpired = auth.user?.exp < new Date();

  if (
    (userExpired || tokenExpired) &&
    authRequiredPage &&
    to.path !== "/login"
  ) {
    toast(
      "Закончилось действие токена",
      "Сессия истекла, необходимо войти заново!",
      "error",
    );
    auth.logout(true);
  }

  // Составление заголовка для вкладки
  // Базовая часть, есть всегда
  const appTitle: string =
    "АИС «Документооборот» - система документооборота ООО «Находка-АИС»";
  // Найдем ближайший маршрут с объявленным заголовком для вкладки
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta.tabTitle);

  const subsystemTitle = to.matched[2]
    ? ` • ${to.matched[2].meta.pageTitle}`
    : "";

  // Конкатенируем строку
  const tabTitle = `${appTitle}${subsystemTitle}${nearestWithTitle ? ` • ${nearestWithTitle.meta.tabTitle}` : ""}`;

  // console.log(auth.notificationsCount);
  auth.tabTitle = tabTitle;
  auth.updateTabTitle();

  // Если страница логина и пользователь уже авторизован -
  // перенаправить откуда пришел
  if (!authRequiredPage && to.path === "/login" && auth.user) {
    return from.fullPath;
  }

  // Если страница требует авторизации и пользователь не авторизован -
  // перенаправить на страницу логина
  if (authRequiredPage && !auth.user) {
    // auth.returnUrl = to.fullPath;
    return "/login";
  }

  // Если в текущем пути есть страницы кроме корневой (домашней с выбором подсистем),
  // то будем проверять права пользователя
  // if (
  //   to.matched.filter(
  //     (route) => route.path !== "/" && !openPages.includes(route.path),
  //   ).length > 0
  // ) {
  //   // Найдем id подсистемы, к которому принадлежит страница
  //   // const appPageNumber = Number.parseInt(
  //   //   // Для этого в пути найдем часть, отмеченную как корневую для подсистемы и выберем name,
  //   //   // в котором содержится id подсистемы (зашивается жосско), если не найден, то -1
  //   //   to.matched.find((route) => route.meta.subsystem)?.name?.toString() ||
  //   //     "-1",
  //   //   10,
  //   // );

  //   // Для найденного id подсистемы извлечем права из авторизационных данных пользователя
  //   // т.е. право есть, и группа права не -1 ("Нет доступа")
  //   // const hasRight = auth.user?.UserRights.find(
  //   //   (right) =>
  //   //     right.AppId === appPageNumber &&
  //   //     right.GroupId !== null &&
  //   //     right.GroupId > -1,
  //   // );

  //   // Если права нет
  //   // if (!hasRight) {
  //   //   // Найдем в пути индекс корневой страницы подсистемы
  //   //   const pathIndex: number = to.matched.findIndex(
  //   //     (route) => route.meta.subsystem,
  //   //   );

  //   //   if (pathIndex > -1) {
  //   //     // Если индекс найден, редирект на ближайшую страницу к корневой странице подсистемы
  //   //     return to.matched[pathIndex - 1].path;
  //   //   }

  //   //   // Иначе если индекс не найден
  //   //   if (auth.user) {
  //   //     // И пользователь авторизован, вернуть туда, откуда пришел с некоторыми исключениями
  //   //     if (from.fullPath !== "/login" && from.fullPath !== to.fullPath) {
  //   //       return from.fullPath;
  //   //     }

  //   //     return "/";
  //   //   }

  //   //   // И пользователь не авторизован, редирект на страницу входа
  //   //   return "/login";
  //   // }
  // }
});

// Перед загрузкой страницы отметить старт загрузки маршрута
router.beforeResolve((to, from, next) => {
  if (to.name) {
    useLoadingStore().loading(true, "route");
  }
  next();
});

// После загрузки отметить завершение загрузки маршрута
router.afterEach(() => {
  useLoadingStore().loading(false, "route");
});

export default router;
