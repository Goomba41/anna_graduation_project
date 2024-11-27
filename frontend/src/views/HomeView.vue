<script setup lang="ts">
import { useRouter } from "vue-router";

import { DateTime as luxon } from "luxon";

import { useUsersStore } from "@/stores/users.store";
import { useLoadingStore } from "@/stores/loading.store";
import { useAuthStore } from "@/stores/auth.store";

import fioParse from "@/utils/fio-formatter";
import nameSystem from "@/utils/meme-naming";

import ScrollPanel from "primevue/scrollpanel";
import { onMounted } from "vue";

// const signalRStore = useSignalRStore();
const router = useRouter();

const loadingStore = useLoadingStore();
const usersStore = useUsersStore();
const authStore = useAuthStore();

const routerRoutesList = router.getRoutes();

function findInRouter(name: string): { name: string } | object {
  let resultObject = {};
  const subsystemHasRoute = routerRoutesList.find(
    (route) => route.name === name,
  );

  if (subsystemHasRoute) resultObject = { name };

  return resultObject;
}

function dayTimeString() {
  const currentHour: number = luxon.now().hour;

  if (currentHour >= 4 && currentHour <= 11) return "доброе утро"; // 🌅
  if (currentHour >= 12 && currentHour <= 16) return "добрый день"; // ☀️
  if (currentHour >= 17 && currentHour <= 23) return "добрый вечер"; // 🌇
  if (currentHour >= 0 && currentHour <= 3) return "доброй ночи"; // 🌙
}

// Чтение по роутеру
// надо бы придумать как это интегрировать с запросом с сервера
// const subsystems: RouteRecordRaw[] =
//   router.getRoutes().find((subsystem: any) => subsystem.name === "subsystems")
//     ?.children || [];

// for (let index = 0; index < 4; index++) {
//   subsystems.push(subsystems[1]);
// }

// function call401() {
//   axios.get("/api/Login/UnauthorizedForever");
// }

// function test() {
//   axios.get("/api/Help/ChangeLog").then((response: AxiosResponse) => {
//   });
// }

// function notificationSend() {
//   signalRStore.connection?.invoke("SendMessage", {
//     message: "Тестовое сообщение, для отладки",
//     sendToEmployee: ["30adb3ba-df5a-48eb-8fd6-953d115190c7"],
//   });
// }

const app_name: string | string[] =
  process.env.NODE_ENV === "development"
    ? nameSystem()
    : "АИС «Документооборот»";

onMounted(() => {
  usersStore.readSubsystems();
});
</script>

<template>
  <div class="greatings tw-flex tw-flex-col tw-w-full tw-mb-8 tw-text-center">
    <p
      class="tw-text-3xl tw-font-bold tw-mb-8 tw-text-gray-700 first-letter:tw-capitalize"
    >
      {{ dayTimeString()
      }}{{
        authStore.user?.FIO
          ? `, ${fioParse(authStore.user?.FIO, {
              f: { enabled: true, short: false },
              i: { enabled: false, short: false },
              o: { enabled: false, short: false },
            })}`
          : ""
      }}! <span class="emoji wave tw-ml-4 -tw-mt-1 tw-absolute">👋</span>
    </p>
    <p class="tw-text-xl tw-font-semibold tw-text-gray-700">
      Добро пожаловать в систему
      <span :title="typeof app_name === 'string' ? app_name : app_name[1]"
        >«{{ typeof app_name === "string" ? app_name : app_name[2] }}»</span
      >!
    </p>
    <p class="tw-text-md tw-text-gray-500">
      Для продолжения работы выберите одну из доступных ниже подсистем. В
      случае, если подсистемы не найдены, обратитесь к администратору системы!
    </p>
  </div>

  <div
    v-if="loadingStore.loadingState"
    class="loading-skeleton tw-items-center tw-grid tw-grid-cols-4 tw-gap-4 tw-h-full"
  >
    <div class="skeleton-box tw-rounded-lg tw-h-full tw-w-full"></div>
    <div class="skeleton-box tw-rounded-lg tw-h-full tw-w-full"></div>
    <div class="skeleton-box tw-rounded-lg tw-h-full tw-w-full"></div>
    <div class="skeleton-box tw-rounded-lg tw-h-full tw-w-full"></div>
    <div class="skeleton-box tw-rounded-lg tw-h-full tw-w-full"></div>
    <div class="skeleton-box tw-rounded-lg tw-h-full tw-w-full"></div>
    <div class="skeleton-box tw-rounded-lg tw-h-full tw-w-full"></div>
    <div class="skeleton-box tw-rounded-lg tw-h-full tw-w-full"></div>
  </div>

  <ScrollPanel v-else class="tw-w-full -tw-ml-2">
    <div
      v-if="usersStore.subsystems?.length"
      :class="[
        'subsystems-grid tw-grid tw-gap-4 tw-px-4 tw-pb-4 tw-justify-center',
      ]"
    >
      <template v-for="subsystem in usersStore.subsystems" :key="subsystem!.Id">
        <router-link
          v-if="subsystem!.Enabled"
          class="subsystem"
          :to="
            subsystem!.WorkInProgress
              ? {}
              : findInRouter(subsystem.Id.toString())
          "
          :disabled="!subsystem!.WorkInProgress"
          :event="!subsystem!.WorkInProgress ? '' : 'click'"
        >
          <div
            :class="[
              'subsystem__subsystem-wrapper',
              subsystem.WorkInProgress
                ? 'subsystem__subsystem-wrapper_disabled'
                : '',
            ]"
          >
            <h2 class="subsystem__header">
              {{ subsystem!.AppName }}
              <template v-if="subsystem!.WorkInProgress">
                <br /><br />{{
                  subsystem!.WorkInProgress ? "(в разработке)" : ""
                }}
              </template>
            </h2>

            <div
              :class="[
                'subsystem__logo',
                subsystem!.WorkInProgress ? 'tw-w-full' : 'tw-w-4/5',
              ]"
            >
              <font-awesome-icon
                :icon="`fas ${subsystem!.WorkInProgress ? 'fa-person-digging' : subsystem!.Icon}`"
                class="icon tw-text-[6rem]"
              ></font-awesome-icon>
            </div>

            <div v-if="!subsystem!.WorkInProgress" class="subsystem__enter">
              <font-awesome-icon
                icon="fas fa-door-open"
                class="icon tw-text-2xl"
              ></font-awesome-icon>
            </div>
          </div>
        </router-link>
      </template>
    </div>
    <div
      v-else
      class="empty tw-h-full tw-w-full tw-flex tw-flex-row tw-justify-center tw-items-center tw-text-3xl tw-text-gray-400 tw-font-semibold tw-select-none"
    >
      Не найдено подсистем 🤷
    </div>
  </ScrollPanel>
</template>

<style scoped lang="scss">
.subsystems-grid {
  grid-template-columns: repeat(auto-fill, minmax(0, 320px));
}

.subsystem__subsystem-wrapper {
  @apply tw-rounded-2xl tw-shadow-lg tw-flex tw-flex-row tw-h-80 tw-w-80 tw-m-0 tw-bg-gray-100;

  &:hover {
    .subsystem__header {
      @apply tw-flex;
    }

    .subsystem__logo {
      @apply tw-hidden;
    }

    .subsystem__enter {
      @apply tw-bg-transparent tw-text-primary;
    }
  }

  .subsystem__header {
    @apply tw-hidden tw-h-full tw-w-4/5 tw-p-8 tw-font-bold tw-text-xl tw-pointer-events-none tw-place-items-center;
  }

  .subsystem__logo {
    @apply tw-h-full tw-p-8 tw-font-bold tw-text-xl tw-pointer-events-none tw-flex tw-items-center tw-justify-center tw-text-primary;
  }

  .subsystem__enter {
    @apply tw-h-full tw-w-1/5 tw-bg-primary tw-rounded-r-2xl tw-flex tw-flex-row tw-justify-center tw-items-center tw-transition-colors tw-text-white;
  }
}

.subsystem__subsystem-wrapper_disabled {
  @apply tw-opacity-50;

  .subsystem__enter {
    @apply tw-hidden;
  }
}
</style>
