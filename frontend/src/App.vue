<template>
  <div class="tw-flex tw-flex-row tw-flex-auto">
    <RouterView />
  </div>

  <Toast position="bottom-right" />

  <Toast group="progress" position="bottom-right">
    <template #message="slotProps">
      <div class="tw-flex tw-flex-col tw-w-full">
        <div
          class="p-toast-summary"
          :class="[
            signalRStore.received?.percent != undefined ? 'tw-mb-2' : '',
          ]"
        >
          {{ ((signalRStore.received?.title || "") as string).trim() }}
        </div>
        <ProgressBar
          :value="signalRStore.received?.percent || 0"
          :class="`tw-w-full ${slotProps.message.severity}`"
        />
      </div>
    </template>
  </Toast>

  <Dialog
    v-model:visible="displayConfirmation"
    header="Подтвердите удаление"
    :style="{ width: '25vw' }"
    :modal="true"
  >
    <div class="tw-flex tw-flex-col tw-items-center">
      <div class="tw-flex tw-flex-row tw-items-center">
        <ExclamationTriangle class="tw-mr-8 tw-text-3xl tw-text-danger" />
        <div class="message">{{ confirmationMessage }}</div>
      </div>

      <div v-if="customConfirmationTextual" class="tw-mt-4 tw-flex tw-flex-col">
        <div class="tw-mx-auto">
          Для подтверждения, наберите «<strong class="tw-select-none">{{
            customConfirmationTextualCT
          }}</strong
          >» в поле ниже:
        </div>
        <InputText
          id="ct"
          v-model.trim="customConfirmationCT"
          input-id="ct"
          class="tw-flex tw-flex-auto tw-flex-col tw-mt-2"
          :pt="{ root: { autocomplete: 'off' } }"
          placeholder="Наберите подтверждающий текст"
          :class="[
            customConfirmationCT?.toLowerCase() !==
            customConfirmationTextualCT.toLowerCase()
              ? 'invalid'
              : '',
          ]"
          @input="checkCT"
        />
      </div>
    </div>
    <template #footer>
      <div class="tw-flex tw-flex-row tw-justify-end">
        <Button
          label="Да"
          icon-pos="left"
          class="deletion-confirmation-yes"
          :disabled="
            time !== 0 ||
            customConfirmationCT?.toLowerCase() !==
              customConfirmationTextualCT.toLowerCase()
          "
          @click="onConfirm"
        >
          <font-awesome-icon
            :icon="['fas', 'fa-fire']"
            :class="['p-button-icon p-button-icon-left']"
          ></font-awesome-icon>
          <div class="p-button-label">Да{{ time !== 0 ? ` ${time}` : "" }}</div>
        </Button>
        <Button
          ref="noDeletionButton"
          label="Нет"
          icon-pos="left"
          class="deletion-confirmation-no"
          @click="onReject"
        >
          <font-awesome-icon
            :icon="['fas', 'fa-fire-extinguisher']"
            :class="['p-button-icon p-button-icon-left']"
          ></font-awesome-icon>
          <div class="p-button-label">Нет</div>
        </Button>
      </div>
    </template>
  </Dialog>

  <Dialog
    v-model:visible="displayCustomConfirmation"
    header="Подтвердите действие"
    :style="{ width: '25vw' }"
    :modal="true"
  >
    <div class="tw-flex tw-flex-col tw-items-center">
      <div class="tw-flex tw-flex-row">
        <font-awesome-icon
          :icon="['fas', 'fa-exclamation-triangle']"
          :class="`${
            customConfirmationStyle
              ? `tw-text-${customConfirmationStyle}`
              : 'tw-text-primary'
          } tw-mr-8 tw-text-3xl`"
        ></font-awesome-icon>
        <div class="message" v-html="customConfirmationMessage"></div>
      </div>

      <div v-if="customConfirmationTextual" class="tw-mt-4 tw-flex tw-flex-col">
        <div class="tw-mx-auto">
          Для подтверждения, наберите «<strong class="tw-select-none">{{
            customConfirmationTextualCT
          }}</strong
          >» в поле ниже:
        </div>
        <InputText
          id="ct"
          v-model.trim="customConfirmationCT"
          input-id="ct"
          class="tw-flex tw-flex-auto tw-flex-col tw-mt-2"
          :pt="{ root: { autocomplete: 'off' } }"
          placeholder="Наберите подтверждающий текст"
          :class="[
            customConfirmationCT?.toLowerCase() !==
            customConfirmationTextualCT.toLowerCase()
              ? 'invalid'
              : '',
          ]"
          @input="checkCT"
        />
      </div>
    </div>
    <template #footer>
      <div class="tw-flex tw-flex-row tw-justify-end">
        <Button
          label="Да"
          icon-pos="left"
          :class="`${customConfirmationStyle} tw-mr-4`"
          :disabled="
            time !== 0 ||
            customConfirmationCT?.toLowerCase() !==
              customConfirmationTextualCT.toLowerCase()
          "
          @click="onCustomConfirm"
        >
          <font-awesome-icon
            :icon="['fas', 'fa-check']"
            :class="['p-button-icon p-button-icon-left']"
          ></font-awesome-icon>
          <div class="p-button-label">Да{{ time !== 0 ? ` ${time}` : "" }}</div>
        </Button>
        <Button
          ref="noCustomButton"
          label="Нет"
          icon-pos="left"
          class="neutral tw-mr-4"
          @click="onCustomReject"
        >
          <font-awesome-icon
            :icon="['fas', 'fa-times']"
            :class="['p-button-icon p-button-icon-left']"
          ></font-awesome-icon>
          <div class="p-button-label">Нет</div>
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch, type Ref } from "vue";
import { RouterView } from "vue-router";

import * as chroma from "chroma.ts";

import { useFocus } from "@vueuse/core";
// import { toTypedSchema } from '@vee-validate/zod'
// import { useForm } from 'vee-validate'

import Toast from "primevue/toast";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
// import InputSwitch from 'primevue/inputswitch'
import ProgressBar from "primevue/progressbar";

import ruMessages from "devextreme/localization/messages/ru.json";
import { locale, loadMessages } from "devextreme/localization";

import useEmitter from "./utils/emitter";

// import { useAuthStore } from './stores/auth.store'
// import { useLoadingStore } from './stores/loading.store'
import { useSignalRStore } from "./stores/signalr.store";
// import { useSettingsStore } from './stores/settings.store'

// import { Setting } from './typings/settings.types'
import { type TCustomColor, ZCustomColor } from "./typings/preferences.types";

import ExclamationTriangle from "./components/icons/ExclamationTriangle.vue";

const { bus, emit } = useEmitter();

// * Убрано пока не починятся настройки
// const authStore = useAuthStore()
// const loadingStore = useLoadingStore()
const signalRStore = useSignalRStore();

// * Убрано пока не починятся настройки
// const settingsStore = useSettingsStore()

// Подтверждения удаления
const displayConfirmation: Ref<boolean> = ref(false);

const confirmationMessage: Ref<string> = ref("Тестовое сообщение, для отладки");

// Для кастомных подтверждений
const displayCustomConfirmation: Ref<boolean> = ref(false);

const customConfirmationMessage: Ref<string> = ref(
  "Тестовое сообщение, для отладки",
);

const customConfirmationStyle: Ref<string> = ref("");

let customConfirmationId: string | undefined = undefined;

let customConfirmationParams:
  | { textual: boolean; timeoutAnswer: number; ct: string }
  | undefined = undefined;

const customConfirmationTextual: Ref<boolean> = ref(false);

const customConfirmationTextualCT: Ref<string> = ref("Подтверждаю");

const customConfirmationCT: Ref<string | null> = ref(null);

const noDeletionButton = ref();

const noCustomButton = ref();

const time: Ref<number> = ref(0);

watch(
  () => bus.value.get("initializeTheme"),
  (theme?: unknown[]) => {
    initializeTheme(theme[0] as string | TCustomColor | null);
  },
);

watch(
  () => bus.value.get("openDeletionConfirmation"),
  (value?: unknown[]) => {
    // Деструктурим параметры (потому что параметры пишутся в массив)
    const [params] = value ?? [];

    displayConfirmation.value = params[0];
    confirmationMessage.value = params[1];
    customConfirmationParams = params[2] || {};

    customConfirmationTextual.value = customConfirmationParams.textual ?? false;

    if (!customConfirmationTextual.value) {
      customConfirmationCT.value = customConfirmationTextualCT.value;

      const timeout = customConfirmationParams.timeoutAnswer ?? 0;
      time.value = timeout;

      if (timeout > 0)
        timer = setInterval(() => {
          time.value -= 1;
          if (time.value === 0) clearInterval(timer);
        }, 1000);
    } else {
      customConfirmationTextualCT.value =
        customConfirmationParams.ct ?? customConfirmationTextualCT.value;
    }

    useFocus(noDeletionButton, { initialValue: true });
  },
);

let timer: ReturnType<typeof setTimeout>;

watch(
  () => bus.value.get("openCustomConfirmation"),
  (value?: unknown[]) => {
    // Деструктурим параметры (потому что параметры пишутся в массив)
    const [params] = value ?? [];

    displayCustomConfirmation.value = params[0];
    customConfirmationMessage.value = params[1];
    customConfirmationStyle.value = params[2];
    customConfirmationId = params[3];
    customConfirmationParams = params[4];

    customConfirmationTextual.value =
      customConfirmationParams?.textual ?? false;

    if (!customConfirmationTextual.value) {
      customConfirmationCT.value = customConfirmationTextualCT.value;

      const timeout = customConfirmationParams?.timeoutAnswer ?? 0;
      time.value = timeout;

      if (timeout > 0)
        timer = setInterval(() => {
          time.value -= 1;
          if (time.value === 0) clearInterval(timer);
        }, 1000);
    } else {
      customConfirmationTextualCT.value =
        customConfirmationParams?.ct ?? customConfirmationTextualCT.value;
    }

    useFocus(noCustomButton, { initialValue: true });
  },
);

function checkCT() {
  if (
    customConfirmationTextual.value &&
    customConfirmationCT.value?.toLowerCase() ===
      customConfirmationTextualCT.value.toLowerCase()
  ) {
    const timeout = customConfirmationParams.timeoutAnswer ?? 0;

    time.value = timeout;

    if (timeout > 0)
      timer = setInterval(() => {
        time.value -= 1;
        if (time.value === 0) clearInterval(timer);
      }, 1000);
  }
}

function onConfirm() {
  time.value = 0;
  customConfirmationCT.value = null;

  emit("deletionConfirmation", true);
  displayConfirmation.value = false;
}

function onReject() {
  time.value = 0;
  customConfirmationCT.value = null;

  emit("deletionConfirmation", false);
  displayConfirmation.value = false;

  clearInterval(timer);
}

function onCustomConfirm() {
  time.value = 0;
  customConfirmationCT.value = null;

  emit(
    `customConfirmation${customConfirmationId || ""}`,
    true,
    customConfirmationParams,
  );
  displayCustomConfirmation.value = false;
}

function onCustomReject() {
  time.value = 0;
  customConfirmationCT.value = null;

  emit(`customConfirmation${customConfirmationId || ""}`, false);
  displayCustomConfirmation.value = false;

  clearInterval(timer);
}

const appThemes: Ref<{ [key: string]: boolean }> = ref({
  "default-theme": false,
  "blue-theme": false,
  "green-theme": false,
  "purple-theme": false,
  "orange-theme": false,
  "pink-theme": false,
  "fuuu-theme": false,
});

const root = document.querySelector(":root") as HTMLElement;

function chooseCustomTheme(mainColorValue: TCustomColor) {
  if (root) {
    for (const theme of Object.keys(appThemes.value)) {
      appThemes.value[theme] = false;
    }

    cleanThemes();

    localStorage.setItem("theme", JSON.stringify(mainColorValue));

    const colors: { variable: string; color?: chroma.Color }[] = [
      { variable: "--colors-primary" },
      { variable: "--colors-primary-dark" },
      { variable: "--colors-primary-dark-hover" },
      { variable: "--colors-primary-light" },
      { variable: "--colors-primary-light-hover" },
    ];

    const chromaBase = chroma.color(Object.values(mainColorValue));

    colors[0].color = chromaBase;
    colors[1].color = chromaBase.darker(0.35).saturate(2);
    colors[2].color = colors[1].color.brighter(0.35);
    colors[3].color = chromaBase.brighter(0.35);
    colors[4].color = colors[3].color.darker(0.35);

    for (const item of colors) {
      root.style.setProperty(item.variable, item.color.rgb().join(" "));
    }
  }
}

function chooseTheme(name: string) {
  if (name !== "default-theme") {
    localStorage.setItem("theme", name);
    cleanThemes();
    root.removeAttribute("style");
    document.body.classList.add(name);
  } else {
    const defaultColorValues: { variable: string; rgb: number[] }[] = [
      { variable: "--colors-primary", rgb: [187, 38, 73] },
      { variable: "--colors-primary-dark", rgb: [122, 12, 38] },
      { variable: "--colors-primary-dark-hover", rgb: [165, 16, 51] },
      { variable: "--colors-primary-light", rgb: [221, 124, 147] },
      { variable: "--colors-primary-light-hover", rgb: [178, 46, 77] },
    ];

    for (const color of defaultColorValues) {
      root.style.setProperty(color.variable, color.rgb.join(" "));
    }

    appThemes.value["default-theme"] = true;

    localStorage.removeItem("theme");
    cleanThemes();
  }

  for (const theme of Object.keys(appThemes.value)) {
    appThemes.value[theme] = false;
  }

  appThemes.value[name] = true;
}

function cleanThemes() {
  for (const theme of Object.keys(appThemes.value)) {
    document.body.classList.remove(theme);
  }
}

function initializeTheme(
  usedTheme: string | TCustomColor | null = "default-theme",
) {
  const themesNames = Object.keys(appThemes.value);

  if (
    usedTheme &&
    typeof usedTheme === "string" &&
    themesNames.includes(usedTheme)
  ) {
    chooseTheme(usedTheme);
  } else {
    try {
      const rgb =
        typeof usedTheme === "string"
          ? ZCustomColor.parse(JSON.parse(usedTheme))
          : ZCustomColor.parse(usedTheme);

      if (rgb.r && rgb.g && rgb.b) {
        chooseCustomTheme(rgb);
      } else {
        chooseTheme("default-theme");
      }
    } catch (error) {
      console.error(error);
      chooseTheme("default-theme");
    }
  }
}

onMounted(() => {
  loadMessages(ruMessages);
  locale(navigator.language);

  const usedTheme: string = localStorage.getItem("theme") || "default-theme";

  initializeTheme(usedTheme);
});

onBeforeUnmount(() => {
  // const rabbitStore = useRabbitStore()
  // rabbitStore.stop('NotifyMe')
});
</script>

<style scoped>
.deletion-confirmation-yes,
.deletion-confirmation-no {
  @apply tw-w-fit;
}

.deletion-confirmation-yes {
  @apply hover:!tw-bg-danger-dark hover:!tw-border-danger-dark tw-mr-6 tw-bg-danger tw-border-danger;
}

.deletion-confirmation-no {
  @apply hover:!tw-bg-gray-500 hover:!tw-border-gray-500 tw-bg-gray-400 tw-border-gray-400;
}

.deletion-confirmation-yes:focus {
  outline: 0 none;
  outline-offset: 0px;
  box-shadow: 0 0 0 0.2rem theme("colors.danger-light");
}

.deletion-confirmation-no:focus {
  outline: 0 none;
  outline-offset: 0px;
  box-shadow: 0 0 0 0.2rem theme("colors.gray.300");
}

.p-inputswitch {
  height: 1.25rem;
  width: 2rem;
}

:deep(.p-inputswitch) .p-inputswitch-slider:before {
  margin-top: -0.45rem;
  height: 0.9rem;
  width: 0.9rem;
}

:deep(.p-inputswitch.p-inputswitch-checked) .p-inputswitch-slider:before {
  --tw-translate-x: 0.625rem;
}
</style>
