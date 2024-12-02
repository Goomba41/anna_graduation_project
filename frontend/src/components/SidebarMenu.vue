<template>
  <div
    class="menu-container tw-ml-4 tw-self-center tw-bg-primary tw-rounded-2xl tw-flex tw-flex-row tw-transition-width tw-h-[calc(100vh-2rem)]"
    :class="[sidebarState ? 'tw-w-[12%]' : 'tw-w-24']"
    @mouseover="toggleSidebar(true)"
  >
    <div
      class="menu-items-wrapper tw-w-full tw-h-full tw-flex tw-flex-col tw-p-6 tw-justify-between tw-max-h-screen"
    >
      <router-link class="logo to-top" to="/">
        <logo class="icon" />

        <div class="text" :class="[sidebarState ? 'tw-ml-2' : 'tw-opacity-0']">
          АИС «Документооборот»
        </div>
      </router-link>

      <div
        v-if="!loadingStore.loadingState"
        class="items-group custom-items !tw-my-auto tw-mx-0"
      >
        <template v-for="item in customMenuItems" :key="item.id">
          <router-link
            v-if="item.type === 'router-link'"
            :to="item.to"
            class="router-link item-wrapper tw-flex tw-flex-row tw-items-center"
          >
            <div class="active-state"></div>
            <div :class="['item', `item-${item.id}`]">
              <div
                v-if="!(item.children && item.children.length)"
                class="hint"
                :style="sidebarState ? 'left: 14rem' : ''"
              >
                {{ item.text }}
              </div>

              <div
                v-if="item.children && item.children.length"
                :class="[
                  'submenu-overlay-panel',
                  `${sidebarState ? '-tw-mr-[26rem]' : '-tw-mr-[18rem]'}`,
                ]"
              >
                <div class="overlay-wrapper tw-flex tw-flex-col">
                  <div class="submenu-title">
                    {{ item.text }}
                  </div>

                  <template v-for="child in item.children" :key="child.id">
                    <router-link
                      v-if="child.type === 'router-link'"
                      :to="child.to"
                      class="router-link item-wrapper tw-flex tw-flex-row tw-items-center"
                    >
                      <div :class="['item', `item-${child.id}`]">
                        <IconComponent :icon="child.icon" class="icon" />
                        <div class="text">{{ child.text }}</div>
                      </div>
                      <div class="active-state"></div>
                    </router-link>
                    <div
                      v-else
                      class="router-link item-wrapper tw-flex tw-flex-row tw-items-center"
                    >
                      <div :class="['item', `item-${child.id}`]">
                        <IconComponent :icon="child.icon" class="icon" />
                        <div class="text">
                          {{ child.text }}
                        </div>
                      </div>
                      <div class="active-state"></div>
                    </div>
                  </template>
                </div>
              </div>

              <IconComponent
                :icon="item.icon"
                :class="['icon', sidebarState ? '' : 'single']"
              />
              <div
                class="text"
                :class="[sidebarState ? 'tw-ml-2' : 'tw-opacity-0']"
              >
                {{ item.text }}
              </div>
            </div>
          </router-link>
          <div
            v-else
            class="router-link item-wrapper tw-flex tw-flex-row tw-items-center"
          >
            <div class="active-state"></div>
            <div :class="['item', `item-${item.id}`]">
              <div
                v-if="!(item.children && item.children.length)"
                class="hint"
                :style="sidebarState ? 'left: 14rem' : ''"
              >
                {{ item.text }}
              </div>

              <div
                v-if="item.children && item.children.length"
                :class="[
                  'submenu-overlay-panel',
                  `${sidebarState ? '-tw-mr-[26rem]' : '-tw-mr-[18rem]'}`,
                ]"
              >
                <div class="overlay-wrapper tw-flex tw-flex-col">
                  <div class="submenu-title">
                    {{ item.text }}
                  </div>

                  <template v-for="child in item.children" :key="child.id">
                    <router-link
                      v-if="child.type === 'router-link'"
                      :to="child.to"
                      class="router-link item-wrapper tw-flex tw-flex-row tw-items-center"
                    >
                      <div :class="['item', `item-${child.id}`]">
                        <IconComponent :icon="child.icon" class="icon" />
                        <div class="text">
                          {{ child.text }}
                        </div>
                      </div>
                      <div class="active-state"></div>
                    </router-link>
                    <div
                      v-else
                      class="router-link item-wrapper tw-flex tw-flex-row tw-items-center"
                    >
                      <div :class="['item', `item-${child.id}`]">
                        <IconComponent :icon="child.icon" class="icon" />
                        <div class="text">
                          {{ child.text }}
                        </div>
                      </div>
                      <div class="active-state"></div>
                    </div>
                  </template>
                </div>
              </div>

              <IconComponent :icon="item.icon" />
              <div
                class="text"
                :class="[sidebarState ? 'tw-ml-2' : 'tw-opacity-0']"
              >
                {{ item.text }}
              </div>
            </div>
          </div>
        </template>
      </div>

      <div
        v-else
        class="skeleton-box tw-rounded-lg tw-bg-primary-light tw-h-full tw-w-full"
      ></div>
    </div>
  </div>

  <div
    class="tw-flex tw-flex-col tw-justify-center tw-z-10"
    @mouseover="toggleSidebar(sidebarState)"
    @mouseleave="toggleSidebar(false)"
  >
    <div
      id="pin"
      class="tw-h-12 tw-w-12 -tw-ml-5 tw-bg-primary hover:tw-bg-primary-dark tw-rounded-full tw-cursor-pointer tw-z-10 tw-text-white tw-flex tw-flex-col tw-content-center tw-justify-center tw-text-2xl tw-border-solid tw-border-8 tw-border-gray-200 tw-transition-colors tw-flex-wrap"
      :style="[sidebarPinState ? '' : 'transform: rotate(45deg)']"
      @click="pinSidebar"
    >
      <ThumbtackTwotone />
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import { onMounted, ref, watch, type Ref } from "vue";
import { useRoute } from "vue-router";

import { useLoadingStore } from "@/stores/loading.store";

import logo from "@/components/icons/AppLogotype.vue";
import ThumbtackTwotone from "@/components/icons/ThumbtackTwotone.vue";

import IconComponent from "./IconComponent.vue";

import callParseErrorToast from "@/utils/type-parse-error";

const route = useRoute();

const loadingStore = useLoadingStore();

// Вешаем наблюдатель за изменением текущего маршрута
// При изменении маршрута поменять заголовок страницы
watch(
  () => route.path as string,
  async () => buildCustomMenu(),
);

// Текущее состояние сайдбара - свернут/развернут
const sidebarState: Ref<boolean> = ref(
  localStorage.getItem("sidebarState")?.toLowerCase() === "true",
);

// Текущее состояние фиксирования сайдбара
const sidebarPinState: Ref<boolean> = ref(
  localStorage.getItem("sidebarPin")?.toLowerCase() === "true",
);

function pinSidebar() {
  sidebarPinState.value = !sidebarPinState.value;
  localStorage.setItem("sidebarPin", sidebarPinState.value.toString());
}

function toggleSidebar(state: boolean) {
  if (!sidebarPinState.value) {
    sidebarState.value = state;
    localStorage.setItem("sidebarState", sidebarState.value.toString());
  }
}

const customMenuItems: Ref<any[]> = ref([]);

async function buildCustomMenu() {
  const menuItems = (route.meta?.menuItems as any[]) || undefined;

  if (menuItems && menuItems.length) {
    customMenuItems.value = menuItems.filter(
      (element) => !(element.hidden && element.hidden()),
    );

    const requestsToAsk: Promise<unknown>[] = [];

    const toGetItems = customMenuItems.value.filter(
      (mi) => mi.uploadItems?.yes,
    );

    for (const item of toGetItems) {
      requestsToAsk.push(
        axios
          .get(item.uploadItems.from)
          .then(async (responseJSON) => {
            // const result = successResult.extend({ createdId: z.number(), data: ZUser })

            const error = errorResult.safeParse(responseJSON);
            const response = successResult.safeParse(responseJSON);

            if (response.success === true) {
              // const { createdId, data: form } = response.data
              return Promise.resolve();
            }

            if (error.success === true) {
              const { data } = error;
              return Promise.reject(data.ErrorMsg || data.Error);
            }

            callParseErrorToast(response.error);
            callParseErrorToast(error.error);
            return Promise.reject(`${error.error}; ${response.error}`);
          })
          .catch((error) => {
            callParseErrorToast(error);
            return Promise.reject(error);
          }),
      );
    }

    await Promise.all(requestsToAsk).then((response) => {
      console.log(response);
    });
  } else {
    customMenuItems.value = [];
  }
}

onMounted(() => buildCustomMenu());
</script>

<style lang="css" scoped>
.menu-container {
  box-shadow:
    rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
    rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
}

.menu-items-wrapper .items-group,
.menu-items-wrapper .items-group > * {
  @apply tw-mb-3 last:tw-mb-0;
}

.overlay-wrapper .item {
  @apply tw-flex tw-flex-row tw-items-center tw-w-full tw-cursor-default tw-py-2 tw-px-4 tw-transition-all tw-justify-center tw-text-primary;
}

.overlay-wrapper .item .text {
  @apply tw-ml-4;
}

.menu-items-wrapper .items-group > .item-wrapper > .item {
  @apply tw-h-12 tw-rounded-[100px] tw-bg-primary-dark-hover tw-flex tw-flex-row tw-items-center tw-w-full tw-text-white tw-cursor-default tw-py-2 tw-px-4 hover:tw-rounded-lg tw-transition-all tw-justify-center;
}

.menu-items-wrapper .logo {
  @apply tw-h-12 tw-flex tw-flex-row tw-items-center tw-w-full tw-text-white tw-cursor-default tw-mb-3 tw-justify-between;
}

.menu-items-wrapper .logo .icon {
  /* Для fontawesome */
  /* @apply tw-w-fit tw-justify-start tw-h-full; */
  @apply tw-min-w-[48px] tw-justify-start tw-h-[150%];
}

.menu-items-wrapper .logo .text {
  @apply tw-text-xl tw-font-black;
}

.menu-items-wrapper .logo .text .menu-items-wrapper .item:focus {
  outline: 0 none;
  @apply tw-outline-offset-0;
  box-shadow: 0 0 0 0.2rem theme("colors.primary-light");
}

.menu-items-wrapper .item .text,
.menu-items-wrapper .logo .text {
  @apply tw-overflow-x-hidden tw-text-ellipsis tw-whitespace-pre tw-w-full tw-text-center;
}

.active-state {
  @apply -tw-ml-6 tw-w-1 tw-h-0 tw-transition-height;
}

.overlay-wrapper .submenu-title {
  @apply tw-text-white tw-bg-gray-500 tw-font-bold tw-text-center tw-py-1 tw-rounded-t;
}

.overlay-wrapper .active-state {
  @apply tw-ml-0;
}

.router-link-active > .active-state {
  @apply tw-bg-white tw-rounded-r-md tw-h-12;
}

.overlay-wrapper .router-link-active > .active-state {
  @apply tw-bg-primary tw-rounded-l-lg;
}

/* .router-link-active .item {
  @apply tw-rounded-lg;
} */

.router-link .item {
  @apply tw-ml-5;
}

.overlay-wrapper .router-link .item {
  @apply tw-ml-0;
}

.items-group > .item-wrapper:hover .item {
  @apply hover:tw-rounded-lg;
}

.item-wrapper:hover > .active-state {
  @apply tw-bg-white tw-rounded-r-md tw-h-6;
}

.overlay-wrapper .item-wrapper:hover > .active-state {
  @apply tw-bg-primary tw-rounded-l-lg;
}

.item-wrapper:hover .hint,
.item:hover .hint {
  @apply tw-inline-block;
}

.hint {
  @apply tw-hidden tw-absolute tw-whitespace-pre tw-left-24 tw-bg-slate-700 tw-rounded-lg tw-py-1 tw-px-3 tw-opacity-80 tw-z-50 tw-max-w-3xl tw-text-ellipsis tw-overflow-x-hidden tw-text-xs;
}

.item-wrapper:hover .submenu-overlay-panel,
.item:hover .submenu-overlay-panel {
  @apply tw-flex;
}

.submenu-overlay-panel {
  @apply tw-hidden tw-absolute tw-max-h-60 tw-min-h-[3rem] tw-w-60;
}

.submenu-overlay-panel .overlay-wrapper {
  @apply tw-ml-5 tw-relative tw-w-full tw-rounded tw-bg-gray-50 tw-z-[999] tw-shadow-lg tw-border-gray-200 tw-border-y-[1px] tw-border-r-[1px];
}

.submenu-overlay-panel .overlay-wrapper:before,
.submenu-overlay-panel .overlay-wrapper:after {
  rotate: -90deg;
  bottom: calc(50% - 10px);
  right: 100%;
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

.items-group .item-wrapper:first-child .submenu-overlay-panel {
  top: 13.5rem;
}

.items-group .item-wrapper:last-child .submenu-overlay-panel {
  bottom: 21rem;
}

.items-group
  .item-wrapper:first-child
  .submenu-overlay-panel
  .overlay-wrapper:before,
.items-group
  .item-wrapper:first-child
  .submenu-overlay-panel
  .overlay-wrapper:after {
  top: calc(1.5rem - 10px);
}

.item-wrapper:last-child .submenu-overlay-panel .overlay-wrapper:before,
.item-wrapper:last-child .submenu-overlay-panel .overlay-wrapper:after {
  bottom: calc(1.5rem - 10px);
}

.menu-items-wrapper .item :deep(.icon) {
  @apply tw-w-8 tw-justify-start tw-text-2xl;

  &.single {
    @apply tw-absolute tw-w-6;
  }
}

.overlay-wrapper > .item-wrapper:first-child .item:first-child {
  @apply tw-rounded-lg;
}

.overlay-wrapper > .item-wrapper:last-child .item:first-child {
  @apply tw-rounded-lg;
}

.overlay-wrapper > .item-wrapper {
  @apply tw-h-12 tw-text-black;
}
</style>
