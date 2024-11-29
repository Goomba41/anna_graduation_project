<template>
  <div
    v-if="loadingStore.loadingState"
    class="loading-skeleton tw-items-center tw-flex tw-flex-col"
  >
    <div class="tw-w-full tw-mb-2 tw-flex-row tw-flex tw-h-1/2">
      <div class="skeleton-box tw-rounded-lg tw-h-full tw-w-1/3 tw-mr-2"></div>
      <div class="skeleton-box tw-rounded-lg tw-h-full tw-w-2/3"></div>
    </div>
    <div class="tw-w-full tw-mb-2 tw-flex-row tw-flex tw-h-1/2">
      <div class="skeleton-box tw-rounded-lg tw-h-full tw-w-full tw-mr-2"></div>
      <div class="skeleton-box tw-rounded-lg tw-h-full tw-w-full"></div>
    </div>
  </div>

  <div v-if="!loadingStore.loadingState" class="tw-flex tw-flex-col">
    <div class="tw-flex tw-flex-row">
      <Panel panel-title="О системе">
        <div class="tw-flex tw-flex-col">
          <span class="tw-font-semibold">АИС «Документооборот»</span>
          <span class=""
            >©️ Островская Анна Ивановна {{ copyrightYearString }}</span
          >
          <span class="tw-text-xs">Сделано с 💖</span>
        </div>
        <div class="versions-list tw-flex tw-flex-col tw-mt-6">
          <div
            v-for="pckg in aboutStore.packages"
            :key="pckg.id"
            class="package-version tw-flex tw-flex-row tw-justify-between"
          >
            <div
              class="package tw-text-primary tw-font-semibold tw-mr-4 tw-whitespace-pre"
            >
              {{ pckg.name }}
            </div>
            <div class="version tw-text-right">{{ pckg.version }}</div>
          </div>
        </div>
      </Panel>
      <Panel panel-title="Техническая поддержка">
        <p class="description tw-pb-4">
          Обнаружили ошибку или проблему в работе системы?
        </p>
        <div class="tech-contacts">
          <div
            v-for="contact in aboutStore.techEmployeesContacts"
            :key="contact.id"
            class="contact tw-pb-6 last:tw-pb-0"
          >
            <div
              class="employee tw-flex tw-flex-row tw-items-center tw-font-semibold tw-text-lg"
            >
              <TechSupport class="tw-mr-2" />
              <div class="name">{{ contact.name }}</div>
            </div>
            <div
              class="post tw-mb-2 tw-text-xs tw-text-gray-400 tw-font-semibold"
            >
              {{ contact.post }}
            </div>
            <div class="phone">{{ phoneParse(contact.phone) }}</div>
            <a
              class="email tw-text-primary hover:tw-text-primary-light tw-transition-colors"
              :href="`mailto:${contact.email}?subject=Вопрос по «Находка-РИАС»`"
              >{{ contact.email }}</a
            >
          </div>
        </div>
      </Panel>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";

import Panel from "@/components/PanelItem.vue";

import phoneParse from "@/utils/phone-formatter";

import { useLoadingStore } from "@/stores/loading.store";
import { useAboutStore } from "@/stores/about.store";

import TechSupport from "@/components/icons/TechSupport.vue";

const projectStartYear: number = 2022;

const currentYear: number = new Date().getFullYear();

const loadingStore = useLoadingStore();

const aboutStore = useAboutStore();

const copyrightYearString: string =
  currentYear <= projectStartYear
    ? `${projectStartYear}`
    : `${projectStartYear} - ${currentYear}`;

function getData() {
  aboutStore.readSoftware();
}

onMounted(() => {
  getData();
});
</script>

<style lang="css" scoped>
:root > .tw-flex-row {
  @apply tw-mb-4 last:tw-mb-0;
}

.loading-skeleton {
  @apply tw-flex-auto tw-h-0;
}
</style>
