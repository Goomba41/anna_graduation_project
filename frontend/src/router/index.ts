import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "@/stores/auth.store";
import { useLoadingStore } from "@/stores/loading.store";

import { DateTime as luxon } from "luxon";

import toast from "@/utils/toast";
import jwtParse from "@/utils/jwt-parse";
import nameSystem from "@/utils/meme-naming";

import adminRoutes from "./admin-routes";
// import reportingRoutes from './reporting-routes'
import monitoringRoutes from "./monitoring-routes";

/* Создание объекта маршрутизатора */
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: "smooth", top: 15 };
    } else if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
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
              process.env.NODE_ENV === "development"
                ? nameSystem()[2]
                : "АИС «Документооборот» - система документооборота ООО «Находка-АИС»",
            // "ИС «ЭКО» - Экономика Кировской области",
          },
        },
        {
          path: "/about",
          name: "about",
          component: () => import("../views/AboutView.vue"),
          meta: {
            pageTitle: "О системе",
            tabTitle: "О системе",
          },
        },
        {
          path: "/preferences",
          name: "preferences",
          component: () => import("../views/PreferencesView.vue"),
          meta: {
            pageTitle: "Предпочтения",
            tabTitle: "Предпочтения",
          },
        },
        {
          path: "",
          name: "subsystems",
          children: [
            ...adminRoutes,
            /*...reportingRoutes,*/ ...monitoringRoutes,
          ],
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

  const openPages = ["/login", "/preferences", "/about"]; // Страницы, не требующие проверки прав
  const authRequiredPage = !["/login"].includes(to.path); // Страницы, не требующие авторизации

  // Проверим не истек ли токен, на случай, если на странице не запрашивается бэк
  // и если истек, делаем выход и показываем тостер
  const token: object | null = jwtParse(
    localStorage.getItem("token"),
  ) as object;
  const nowSinceEpoch: number = Math.round(Date.now() / 1000);

  const tokenExpired: boolean = token && token["exp"] < nowSinceEpoch;

  let userExpired: boolean = !auth.user;

  if (auth.user?.exp)
    userExpired = luxon.fromISO(auth.user?.exp).toSeconds() < nowSinceEpoch;

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
    .find((r) => r.meta && r.meta.tabTitle);

  const subsystemTitle = to.matched[2]
    ? ` • ${to.matched[2].meta.pageTitle}`
    : ``;

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
  if (
    to.matched.filter(
      (route) => route.path !== "/" && !openPages.includes(route.path),
    ).length > 0
  ) {
    // Найдем id подсистемы, к которому принадлежит страница
    const appPageNumber = Number.parseInt(
      // Для этого в пути найдем часть, отмеченную как корневую для подсистемы и выберем name,
      // в котором содержится id подсистемы (зашивается жосско), если не найден, то -1
      to.matched.find((route) => route.meta.subsystem)?.name?.toString() ||
        "-1",
      10,
    );

    // Для найденного id подсистемы извлечем права из авторизационных данных пользователя
    // т.е. право есть, и группа права не -1 ("Нет доступа")
    const hasRight = auth.user?.UserRights.find(
      (right) =>
        right.AppId == appPageNumber &&
        right.GroupId !== null &&
        right.GroupId > -1,
    );

    // Если права нет
    if (!hasRight) {
      // Найдем в пути индекс корневой страницы подсистемы
      const pathIndex: number = to.matched.findIndex(
        (route) => route.meta.subsystem,
      );

      if (pathIndex > -1) {
        // Если индекс найден, редирект на ближайшую страницу к корневой странице подсистемы
        return to.matched[pathIndex - 1].path;
      } else {
        // Иначе если индекс не найден
        if (auth.user) {
          // И пользователь авторизован, вернуть туда, откуда пришел с некоторыми исключениями
          if (from.fullPath !== "/login" && from.fullPath !== to.fullPath) {
            return from.fullPath;
          } else {
            return "/";
          }
        } else {
          // И пользователь не авторизован, редирект на страницу входа
          return "/login";
        }
      }
    }
  }
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
