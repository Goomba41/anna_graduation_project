<template>
  <Panel panel-title="Настройки темы приложения" panel-class="tw-w-1/2">
    <div class="tw-flex tw-flex-col">
      <div class="tw-flex tw-flex-row tw-mb-4">
        <div
          class="p-selectbutton p-buttonset p-component tw-mr-4"
          role="group"
          aria-labelledby="custom"
        >
          <div
            v-for="name in Object.keys(appThemes)"
            :key="name"
            tabindex="0"
            aria-label="Left"
            role="radio"
            aria-checked="true"
            :class="[
              `p-button p-component ${name} theme-chooser`,
              appThemes[name] ? 'p-highlight' : '',
            ]"
            @click="chooseTheme(name)"
          >
            <span class="p-button-label">
              <SimpleCircle />
            </span>
          </div>
          <div
            v-if="devMode"
            tabindex="0"
            aria-label="Left"
            role="radio"
            aria-checked="true"
            :class="[`p-button p-component theme-chooser`]"
            style="
              background: linear-gradient(
                180deg,
                #f00000,
                #f00000 16.67%,
                #ff8000 16.67%,
                #ff8000 33.33%,
                #ffff00 33.33%,
                #ffff00 50%,
                #007940 50%,
                #007940 66.67%,
                #4040ff 66.67%,
                #4040ff 83.33%,
                #a000c0 83.33%,
                #a000c0
              );
            "
            @click="choosePrideTheme"
          >
            <span class="p-button-label tw-text-black">
              <SimpleCircle />
            </span>
          </div>
        </div>

        <div>
          <ColorPicker
            v-model="customColor"
            format="rgb"
            @change="chooseTheme"
          />
        </div>
      </div>

      <div class="tw-flex-row tw-items-center tw-hidden">
        <InputSwitch v-model="light" class="tw-mr-4" />
        <!-- @input="toggleLight" -->
        <LightbulbTwotone
          :class="[
            'icon tw-text-4xl',
            light ? 'tw-text-yellow-300' : 'tw-text-gray-300',
          ]"
        />
      </div>
    </div>
  </Panel>
</template>

<script lang="ts" setup>
import { ref, type Ref } from "vue";

import Panel from "@/components/PanelItem.vue";

import type { ColorPickerChangeEvent } from "primevue/colorpicker";

import ColorPicker from "primevue/colorpicker";
import InputSwitch from "primevue/inputswitch";

import useEmitter from "@/utils/emitter";

import type { TCustomColor } from "@/typings/preferences.types";

import SimpleCircle from "@/components/icons/SimpleCircle.vue";
import LightbulbTwotone from "@/components/icons/LightbulbTwotone.vue";

const { emit } = useEmitter();

const appThemes: Ref<{ [key: string]: boolean }> = ref({
  "default-theme": false,
  "blue-theme": false,
  "green-theme": false,
  "purple-theme": false,
  "orange-theme": false,
  "pink-theme": false,
  "fuuu-theme": false,
});

const customColor: Ref<TCustomColor | null> = ref(null);

const light: Ref<boolean> = ref(true);

const devMode: Ref<boolean> = ref(process.env.NODE_ENV === "development");

function choosePrideTheme() {
  const cssStyle = document.createElement("style");
  const rules = document.createTextNode(
    ".subsystem__subsystem-wrapper .subsystem__enter, .menu-items-wrapper .items-group>.item-wrapper>.item, .p-button, .tw-bg-primary, button, [type='button'], [type='reset'], [type='submit']{background: linear-gradient(180deg, #f00000, #f00000 16.67%, #ff8000 16.67%, #ff8000 33.33%, #ffff00 33.33%, #ffff00 50%, #007940 50%, #007940 66.67%, #4040ff 66.67%, #4040ff 83.33%, #a000c0 83.33%, #a000c0)}",
  );
  cssStyle.appendChild(rules);
  document.getElementsByTagName("head")[0].appendChild(cssStyle);
}

function chooseTheme(value: string | ColorPickerChangeEvent) {
  let newValue: string | TCustomColor | undefined;

  if (typeof value !== "string") {
    newValue = value.value;
  } else {
    newValue = value;
  }

  emit("initializeTheme", newValue);
}
</script>

<style lang="css" scoped>
/* Так как тема по умолчанию задается через :root, то нельзя обратиться
  напрямую к переменной главного цвета, приходится руками задавать цвет */
.theme-chooser.default-theme {
  color: #bb2649;
  background-color: white;
}

.theme-chooser.default-theme:hover,
.theme-chooser.default-theme.theme-chooser.p-highlight {
  color: #7a0c26;
  background: #bb2649;
}

.theme-chooser {
  color: rgb(var(--colors-primary));
  background: white;
}

.theme-chooser:not(.default-theme):hover {
  background: rgb(var(--colors-primary));
  /* color: rgb(var(--colors-primary-dark)); */
}

.theme-chooser.p-highlight,
.theme-chooser.p-highlight:hover {
  background: rgb(var(--colors-primary));
  color: rgb(var(--colors-primary-dark));
}

.theme-chooser,
.theme-chooser .p-button-label {
  @apply tw-transition-colors;
}
</style>
