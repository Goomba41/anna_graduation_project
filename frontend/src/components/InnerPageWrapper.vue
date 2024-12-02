<template>
  <Sidebar />

  <main
    class="tw-mx-auto tw-flex tw-flex-row tw-py-8 tw-pr-8 tw-w-[1px] tw-flex-1 tw-h-screen tw-pl-8"
  >
    <div class="tw-flex tw-flex-col tw-w-full">
      <div
        v-if="loadingStore.loadingState"
        class="loading-skeleton tw-justify-between tw-pb-6 tw-w-full tw-items-center tw-flex tw-flex-row"
        :class="[pageSubTitle ? 'tw-h-[96px]' : ' tw-h-[80px]']"
      >
        <div class="skeleton-box tw-w-1/2 tw-h-full tw-rounded-lg"></div>
        <div class="tw-flex tw-flex-row tw-min-w-fit tw-h-full">
          <div
            class="skeleton-box tw-rounded-lg tw-h-full tw-w-14 tw-mr-2"
          ></div>
          <div class="skeleton-box tw-rounded-lg tw-h-full tw-w-32"></div>
        </div>
      </div>

      <div
        v-if="!loadingStore.loadingState"
        class="page-header tw-flex tw-flex-row tw-justify-between tw-pb-6 tw-w-full tw-items-center"
      >
        <div class="tw-flex tw-flex-col tw-w-3/5">
          <div class="tw-flex tw-flex-row tw-items-center breadcrumbs">
            <template v-if="route.name !== 'home'">
              <router-link :to="{ name: 'home' }">
                <HomePage class="tw-mr-2 tw-text-2xl" />
              </router-link>
              <span class="tw-mr-2 tw-text-2xl">•</span>
            </template>
            <h1
              class="page-header-text tw-font-bold tw-text-3xl tw-whitespace-pre tw-overflow-x-hidden tw-text-ellipsis tw-w-full tw-h-10"
              :title="pageTitle"
            >
              {{ pageTitle }}
            </h1>
          </div>
          <h4
            v-if="pageSubTitle"
            class="page-subheader-text tw-font-bold tw-text-sm tw-whitespace-pre tw-overflow-x-hidden tw-text-ellipsis tw-w-full tw-h-6 tw-text-gray-300"
            :title="pageSubTitle"
          >
            {{ pageSubTitle }}
          </h4>
        </div>

        <div class="right-part tw-flex tw-flex-row tw-min-w-fit">
          <div class="notification tw-mr-4">
            <div
              :class="[
                'icon-container',
                unreadedNotifications > 0 ? 'new' : '',
              ]"
            >
              <BellTwotone class="icon" />
            </div>

            <div class="overlay-panel">
              <div class="overlay-wrapper">
                <div
                  v-if="!notifications.length"
                  class="empty tw-w-full tw-h-full tw-flex tw-flex-col tw-items-center tw-justify-center tw-text tw-text-gray-400 tw-font-semibold tw-select-none"
                >
                  Нет новых уведомлений
                  <span class="tw-text-3xl">🤷</span>
                </div>
                <ScrollPanel v-else>
                  <div class="notifications-wrapper">
                    <div
                      v-for="notification in notifications"
                      :key="notification.MessageId"
                      class="notification tw-flex tw-flex-row tw-w-full tw-border-b tw-border-gray-300 tw-border-solid last:tw-border-b-0"
                      @click="checkAsReaded(notification.MessageId)"
                    >
                      <div class="notification-controls tw-flex tw-flex-row">
                        <div
                          v-if="
                            notification.MessageTypeId ===
                            'ad98c117-5eb1-4446-b60c-ff6ade1afe43'
                          "
                          class="action"
                        >
                          <ExclamationTriangle class="icon" />
                        </div>
                      </div>
                      <div class="notification-content">
                        <div class="notification-info">
                          <div class="notification-state">
                            <CheckIcon
                              v-if="notification?.readed"
                              class="icon"
                            />
                            <CheckDouble v-else class="icon" />
                          </div>
                          <div class="notification-datetime">
                            {{ notification.MessageDate }}
                          </div>
                        </div>
                        <div
                          class="notification-text"
                          :title="notification.Message"
                        >
                          {{ notification.Message }}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollPanel>
              </div>
            </div>
          </div>

          <div class="user-data">
            <div
              class="user-link tw-flex tw-flex-row tw-items-center tw-h-full"
            >
              <UserCircle
                class="icon tw-mr-2 tw-text-primary tw-font-semibold tw-text-3xl"
              />
              <div class="user-name tw-text-xl tw-cursor-default">
                {{
                  `${authStore.user ? fioParse(authStore.user.UserName) : "🤷"} @${authStore.user?.UserLogin}`
                }}
              </div>
            </div>

            <div class="overlay-panel">
              <div class="overlay-wrapper">
                <router-link
                  :to="{ name: 'preferences' }"
                  class="router-link item-wrapper"
                >
                  <div class="item item-info">
                    <UserGear class="icon tw-text-xl" />
                    <div class="text">Предпочтения</div>
                  </div>
                  <div class="active-state"></div>
                </router-link>

                <div class="divider"></div>

                <router-link
                  :to="{ name: 'about' }"
                  class="router-link item-wrapper"
                >
                  <div class="item item-info">
                    <InfoCircle class="icon tw-text-xl" />
                    <div class="text">О программе</div>
                  </div>
                  <div class="active-state"></div>
                </router-link>

                <div class="divider"></div>

                <div class="item-wrapper">
                  <div class="item item-logout" @click="authStore.logout()">
                    <SignOut class="icon tw-text-xl" />
                    <div class="text">Выйти</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch, type Ref } from "vue";
import { useRoute } from "vue-router";

import axios from "axios";
import { DateTime as luxon } from "luxon";

import { useAuthStore } from "@/stores/auth.store";
import { useLoadingStore } from "@/stores/loading.store";
import { useSignalRStore } from "@/stores/signalr.store";

import toast from "@/utils/toast";
import fioParse from "@/utils/fio-formatter";

import ScrollPanel from "primevue/scrollpanel";

import Sidebar from "./SidebarMenu.vue";

import HomePage from "./icons/HomePage.vue";
import BellTwotone from "./icons/BellTwotone.vue";
import ExclamationTriangle from "./icons/ExclamationTriangle.vue";
import CheckIcon from "./icons/CheckIcon.vue";
import CheckDouble from "./icons/CheckDouble.vue";
import UserGear from "./icons/UserGear.vue";
import UserCircle from "./icons/UserCircle.vue";
import SignOut from "./icons/SignOut.vue";
import InfoCircle from "./icons/InfoCircle.vue";

const route = useRoute();
const authStore = useAuthStore();
const loadingStore = useLoadingStore();
const signalRStore = useSignalRStore();

const pageTitle: Ref<string> = ref(route.meta.pageTitle as string);

const pageSubTitle: Ref<string> = ref(route.meta.pageSubTitle as string);

// TODO: исправить any после того, как будет известна структура объекта уведомлений
const notifications: Ref<unknown[]> = ref([]);

const unreadedNotifications: Ref<number> = ref(0);

// Вешаем наблюдатель за изменением текущего маршрута
// При изменении маршрута поменять заголовок страницы
watch(
  () => route.meta.id,
  async () => {
    pageTitle.value = route.meta.pageTitle as string;
    pageSubTitle.value = route.meta.pageSubTitle as string;
  },
);

// Вешаем наблюдатель за состоянием соединения с WS
watch(
  () => signalRStore.connection?.state,
  async (state) => {
    // Если присоединился, повесим действие на событие
    if (state === "Connected")
      signalRStore.connection?.on("NotifyMe", (wsMessage) => {
        setTimeout(() => {
          // Если не сообщение с обновленным токеном
          if (
            wsMessage.MessageTypeId !== "449439cc-1bbf-4d6c-b236-32b9e2753824"
          ) {
            const formattedDateTime = luxon
              .fromISO(wsMessage.MessageDate)
              .setLocale("ru-ru")
              .toFormat("EEEE, d MMMM в T");
            wsMessage.MessageDate =
              formattedDateTime[0].toUpperCase() + formattedDateTime.slice(1);

            wsMessage.readed = false;
            unreadedNotifications.value += 1;
            notifications.value.unshift({ ...wsMessage });

            // Если сообщение для локального хранения
            if (
              wsMessage.MessageTypeId === "ad98c117-5eb1-4446-b60c-ff6ade1afe43"
            ) {
              const lsvalue = localStorage.getItem("localNotifications");
              const localNotifications: any[] = lsvalue
                ? (JSON.parse(lsvalue) as any)
                : [];
              localNotifications.push({ ...wsMessage });
              localStorage.setItem(
                "localNotifications",
                JSON.stringify(localNotifications),
              );
            }
          } else {
            authStore.refreshToken(wsMessage.Message);
          }
        }, 500);
      });
  },
);

// Функция, которая вызывается, когда пользователь щелкает уведомление
function checkAsReaded(id: string) {
  const nonAffectableNotificationTypes: string[] = [
    "378499e8-122c-43db-9ffc-48280d7d5c5c", // Мероприятия, по которым нужны отчеты или задания
    "f946502d-174b-49f1-a105-57b7d6697647", // Документы с просроком
    "ad98c117-5eb1-4446-b60c-ff6ade1afe43", // Локальное уведомление
  ];

  const notification = notifications.value.find(
    (item: any) => item.MessageId === id,
  );

  const index = notifications.value.findIndex(
    (object: any) => object.MessageId === id,
  );

  if (!nonAffectableNotificationTypes.includes(notification.MessageTypeId)) {
    axios.post(`/api/Messages/${id}`).then((response: any) => {
      if (response && response.result === 0) {
        notifications.value.splice(index, 1);
        unreadedNotifications.value -= 1;
        authStore.notificationsCount -= 1;
        authStore.updateTabTitle();
      } else if (response && response.result === -1) {
        toast("Ошибка!", response.Error || response.ErrorMsg, "error");
      }
    });
  } else {
    notification.readed = true;
    unreadedNotifications.value -= 1;
    authStore.notificationsCount -= 1;
    authStore.updateTabTitle();

    if (notification.MessageTypeId === "ad98c117-5eb1-4446-b60c-ff6ade1afe43") {
      const lsvalue = localStorage.getItem("localNotifications");
      let localNotifications: any[] = lsvalue
        ? (JSON.parse(lsvalue) as any)
        : [];

      localNotifications = localNotifications.filter(
        (notification: any) => notification.MessageId !== id,
      );
      localStorage.setItem(
        "localNotifications",
        JSON.stringify(localNotifications),
      );
    }
  }
}

onMounted(() => {
  // ! Отключено, пока что не нужны уведомления
  // axios.get("/api/MyTasks/GetMyInformation").then((response: any) => {
  //   if (response && response.result !== 0) {
  //     toast("Ошибка", "Ошибка при получении уведомлений", "error");
  //   } else {
  //     response.notifications.forEach((notification: any) => {
  //       const notificationItem = notification;
  //       const formattedDateTime = luxon
  //         .fromISO(notificationItem.MessageDate)
  //         .setLocale("ru-ru")
  //         .toFormat("EEEE, d MMMM в T");
  //       notificationItem.MessageDate =
  //         formattedDateTime[0].toUpperCase() + formattedDateTime.slice(1);

  //       notificationItem.readed = false;
  //       unreadedNotifications.value += 1;
  //       authStore.notificationsCount += 1;
  //       authStore.updateTabTitle();
  //       notifications.value.unshift({ ...notificationItem });
  //     });
  //   }
  // });

  const lsvalue = localStorage.getItem("localNotifications");
  const localNotifications: any[] = lsvalue ? (JSON.parse(lsvalue) as any) : [];

  for (const notification of localNotifications) {
    unreadedNotifications.value += 1;
    authStore.notificationsCount += 1;
    authStore.updateTabTitle();
    notifications.value.unshift({ ...notification });
  }

  if (!signalRStore.connection) {
    signalRStore.connect();
  } else if (
    signalRStore.connection &&
    signalRStore.connection.state === "Disconnected"
  ) {
    signalRStore.start();
  }
});

onBeforeUnmount(() => {
  const signalRStore = useSignalRStore();
  signalRStore.stop("NotifyMe");
});
</script>

<style lang="css" scoped>
.notification {
  @apply tw-cursor-pointer;
}

.notification > .icon-container {
  @apply tw-text-xl tw-p-3 tw-rounded-full tw-bg-gray-50 tw-cursor-pointer tw-text-gray-200;
}

.notification > .icon-container.new .fa-bell {
  transform-origin: 50% 0%;
  animation: bell-ringing 2s infinite;
}

.notification > .icon-container.new {
  box-shadow: 0 0 0 0 rgba(var(--colors-primary), 1);
  transform: scale(1);
  animation: pulse-notify 2s infinite;

  @apply tw-bg-primary tw-text-white;
}

.notification-controls {
  @apply tw-mr-4;
}

.notification-controls .action .icon {
  @apply tw-text-2xl;
}

.notification-controls .action {
  /* tw-bg-white  */
  @apply tw-flex tw-flex-row tw-text-primary hover:tw-text-white hover:tw-bg-primary tw-items-center tw-justify-center tw-w-10;
}

.notifications-wrapper > .notification:first-child .action:first-child {
  @apply tw-rounded-tl-xl;
}

.notification-content {
  @apply tw-w-full tw-py-3 tw-flex tw-flex-col;
}

.notification-content .notification-info {
  @apply tw-flex tw-flex-row tw-text-xs tw-text-gray-400 tw-font-medium tw-pb-2;
}

.notification-content .notification-info .notification-state {
  @apply tw-mr-4;
}

.notification-content .notification-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  @apply tw-overflow-hidden tw-text-ellipsis;
}

@keyframes bell-ringing {
  0% {
    transform: rotate(0deg);
  }

  35% {
    transform: rotate(-45deg);
  }

  70% {
    transform: rotate(45deg);
  }

  100% {
    transform: rotate(0deg);
  }
}

@keyframes pulse-notify {
  0% {
    transform: scale(0.85);
    box-shadow: 0 0 0 0 rgba(var(--colors-primary), 0.7);
  }

  30% {
    box-shadow: 0 0 0 10px rgba(var(--colors-primary), 0);
  }

  34% {
    box-shadow: 0 0 0 0px rgba(var(--colors-primary), 0);
  }

  35% {
    box-shadow: 0 0 0 0 rgba(var(--colors-primary), 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(var(--colors-primary), 0);
  }

  100% {
    transform: scale(0.85);
    box-shadow: 0 0 0 0 rgba(var(--colors-primary), 0);
  }
}

.notification:hover .overlay-panel,
.user-data:hover .overlay-panel {
  @apply tw-flex;
}

.overlay-panel {
  @apply tw-hidden tw-absolute;
}

.user-data .overlay-panel {
  @apply tw-right-10 tw-w-48;
}

.notification .overlay-panel {
  @apply tw-h-60 tw-w-80 -tw-ml-[272px];
}

.overlay-wrapper {
  @apply tw-flex tw-flex-col tw-mt-4 tw-relative tw-w-full tw-rounded-xl tw-bg-gray-50 tw-z-[999] tw-shadow-lg;
}

.overlay-wrapper:before,
.overlay-wrapper:after {
  bottom: 100%;
  right: calc((49px / 2) - 10px);
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
  border: solid transparent;
  border-color: rgba(255, 255, 255, 0);
  /* border-bottom-color: #ffffff; */
  border-width: 10px;
  margin-left: -10px;
  @apply tw-border-b-gray-50;
}

.item-wrapper > .item {
  @apply tw-h-12 tw-flex tw-flex-row tw-items-center tw-w-full tw-text-gray-700 hover:tw-text-primary-dark-hover tw-cursor-default tw-py-2 tw-px-4;
}

.item-wrapper > .item .text {
  @apply tw-ml-4;
}

.item-wrapper > .item * {
  @apply tw-transition-none;
}

.overlay-panel :deep(.p-scrollpanel-wrapper) {
  @apply tw-rounded-l-xl;
}

.overlay-panel :deep(.p-scrollpanel-content) {
  @apply tw-pb-0;
}

.overlay-wrapper .divider {
  @apply tw-h-[2px] tw-bg-gray-200;
}

.item-wrapper {
  @apply tw-flex tw-flex-row tw-items-center tw-h-12;
}

.overlay-wrapper .item-wrapper:hover > .active-state {
  @apply tw-bg-primary tw-rounded-l-lg tw-h-6;
}

.overlay-wrapper > .item-wrapper:first-child .item:first-child {
  @apply tw-rounded-lg;
}

.overlay-wrapper > .item-wrapper:last-child .item:first-child {
  @apply tw-rounded-lg;
}

.active-state {
  @apply tw-w-1 tw-h-0 tw-transition-height;
}

.router-link-exact-active > .active-state {
  @apply tw-bg-white tw-rounded-r-md tw-h-6;
}

.overlay-wrapper .router-link-exact-active > .active-state {
  @apply tw-bg-primary tw-rounded-l-lg;
}

.breadcrumbs a {
  @apply tw-text-primary;
}
</style>
