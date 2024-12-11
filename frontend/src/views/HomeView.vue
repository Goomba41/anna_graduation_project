<script setup lang="ts">
import { ref } from "vue";
import { DateTime as luxon } from "luxon";

import Chart from "primevue/chart";

import { useLoadingStore } from "@/stores/loading.store";
import { useAuthStore } from "@/stores/auth.store";

import fioParse from "@/utils/fio-formatter";
import nameSystem from "@/utils/meme-naming";

// const signalRStore = useSignalRStore();

const loadingStore = useLoadingStore();
const authStore = useAuthStore();

function dayTimeString() {
  const currentHour: number = luxon.now().hour;

  if (currentHour >= 4 && currentHour <= 11) return "доброе утро 🌅"; // 🌅
  if (currentHour >= 12 && currentHour <= 16) return "добрый день ☀️"; // ☀️
  if (currentHour >= 17 && currentHour <= 23) return "добрый вечер 🌇"; // 🌇
  if (currentHour >= 0 && currentHour <= 3) return "доброй ночи 🌙"; // 🌙
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
  import.meta.env.MODE === "development"
    ? nameSystem()
    : "АИС «Документооборот»";

const chartsData = ref([
  {
    labels: ["A", "B", "C", "D", "E", "F", "G"],
    datasets: [
      {
        data: [540, 325, 702],
      },
    ],
  },
]);

const chartOptions = ref({
  plugins: {
    legend: {
      labels: {
        cutout: "60%",
      },
    },
  },
});
</script>

<template>
  <div class="greatings tw-flex tw-flex-col tw-w-full tw-text-center tw-flex-1">
    <p
      class="tw-text-3xl tw-font-bold tw-mb-8 tw-text-gray-700 first-letter:tw-capitalize"
    >
      {{ dayTimeString()
      }}{{
        authStore.user?.UserName
          ? `, ${fioParse(authStore.user?.UserName, {
              f: { enabled: false, short: false },
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
    <p class="tw-text-base tw-mb-2 tw-text-gray-500">
      Для начала работы воспользуйтесь боковым меню и перейдите на необходимую
      страницу системы.
    </p>
    <p class="tw-text-xl tw-mb-4 tw-font-semibold tw-text-gray-700">
      Ознакомьтесь с последними изменениями и показателями:
    </p>

    <div class="charts tw-grid tw-grid-cols-6 tw-grid-rows-2">
      <div class="tw-flex tw-flex-col tw-h-full">
        <h4>Материалы по типам</h4>
        <Chart type="doughnut" :data="chartsData[0]" :options="chartOptions" />
      </div>
      <div class="tw-flex tw-flex-col tw-h-full">
        <h4>Материалы по пользователям</h4>
        <Chart type="doughnut" :data="chartsData[0]" :options="chartOptions" />
      </div>
      <div class="tw-flex tw-flex-col tw-h-full">
        <h4>Входящие по видам</h4>
        <Chart type="doughnut" :data="chartsData[0]" :options="chartOptions" />
      </div>
      <div class="tw-flex tw-flex-col tw-h-full">
        <h4>Входящие по продуктам</h4>
        <Chart type="doughnut" :data="chartsData[0]" :options="chartOptions" />
      </div>
      <div class="tw-flex tw-flex-col tw-h-full">
        <h4>Исходящие по видам</h4>
        <Chart type="doughnut" :data="chartsData[0]" :options="chartOptions" />
      </div>
      <div class="tw-flex tw-flex-col tw-h-full">
        <h4>Исходящие по продуктам</h4>
        <Chart type="doughnut" :data="chartsData[0]" :options="chartOptions" />
      </div>
    </div>
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

.charts :deep(.p-chart) > canvas {
  width: 100%;
  height: 100%;
  flex: 1 1 0px;
}
</style>
