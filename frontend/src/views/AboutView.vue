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

  <!-- tw-w-[101.2%] -->
  <ScrollPanel v-if="!loadingStore.loadingState" class="tw-w-full -tw-ml-2">
    <div class="tw-flex tw-flex-col">
      <div class="tw-flex tw-flex-row">
        <Panel panel-title="О системе">
          <!-- <div class="app-info tw-flex tw-flex-col tw-w-full">
            <div class="app-name tw-flex tw-flex-row tw-items-center">
              <div class="name tw-mr-4 tw-font-semibold tw-text-lg">
                ИС «ЭКО»
              </div>
              💖
            </div>
            <div
              class="subname tw-text-xs tw-text-gray-400 tw-font-semibold tw-whitespace-pre"
            >
              {{
                `Экономика Кировской области ©️ ${copyrightYearString}`
              }}
            </div>
          </div> -->
          <div class="versions-list tw-flex tw-flex-col tw-mt-6">
            <div
              v-for="pckg in aboutStore.packages"
              :key="pckg.id"
              class="package-version tw-flex tw-flex-row tw-justify-between"
            >
              <div class="package tw-text-primary tw-font-semibold tw-mr-4 tw-whitespace-pre">
                {{ pckg.name }}
              </div>
              <div class="version tw-text-right">{{ pckg.version }}</div>
            </div>
          </div>
        </Panel>
        <Panel
          panel-class="tw-w-full"
          panel-content-class="tw-flex tw-flex-col"
          panel-title="Обновления системы"
        >
          <ScrollPanel class="tw-w-full">
            <div class="changes-history tw-flex tw-flex-col">
              <div
                v-for="change in aboutStore.changelog"
                :key="change.Id"
                class="change-item tw-flex-col tw-mb-4"
              >
                <div class="app-version-number tw-font-semibold tw-text-lg tw-mb-4">
                  Версия {{ change.Number }}
                  <sub class="date tw-text-xs tw-text-gray-400 tw-font-semibold tw-whitespace-pre">
                    {{ change.Date }}
                  </sub>
                </div>

                <div class="app-version-info-list">
                  <div
                    v-for="detail of change.Changelogs"
                    :key="detail.Id"
                    class="app-version-detail tw-flex tw-flex-row tw-items-center"
                  >
                    <font-awesome-icon
                      :icon="['fas', `fa-${detail.Icon}`]"
                      class="icon fa-fw tw-mr-4 tw-text-primary tw-font-semibold"
                    ></font-awesome-icon>
                    <span>{{ detail.Text }}</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollPanel>
        </Panel>
      </div>
      <div class="tw-flex tw-flex-row">
        <Panel panel-class="tw-w-full" panel-title="Руководства и документация">
          <p class="description tw-pb-4">
            Прежде чем приступить к работе или обратиться в техническую поддержку, пожалуйста,
            внимательно изучите документацию по системе!
          </p>
          <div class="documentations-list">
            <div
              v-for="item in aboutStore.documentationDocs"
              :key="item.id"
              class="documentation-item tw-pb-2 last:tw-pb-0 tw-w-fit"
            >
              <!--
              Можно получить из папки assets либо из public, 
              В данном случае лучше из public
            -->
              <!-- Из assets: :href="getAsset(item.link)" -->
              <a
                :href="`${publicPath}${item.link}`"
                target="_blank"
                class="document-link tw-text-primary hover:tw-text-primary-light tw-flex tw-flex-row tw-items-center tw-font-semibold tw-text-lg"
                :class="
                  item.icon === 'arrow-up-right-from-square'
                    ? 'tw-underline tw-decoration-dotted tw-underline-offset-4'
                    : ''
                "
              >
                <font-awesome-icon
                  :icon="['fas', `fa-${item.icon}`]"
                  class="icon tw-mr-2"
                ></font-awesome-icon>
                <div class="name">{{ item.text }}</div>
              </a>
              <div class="date tw-mb-2 tw-text-xs tw-text-gray-400 tw-font-semibold">
                от {{ item.date }}
              </div>
            </div>
          </div>
        </Panel>

        <Panel panel-class="tw-w-2/5" panel-title="Техническая поддержка">
          <p class="description tw-pb-4">Обнаружили ошибку или проблему в работе системы?</p>
          <div class="tech-contacts">
            <div
              v-for="contact in aboutStore.techEmployeesContacts"
              :key="contact.id"
              class="contact tw-pb-6 last:tw-pb-0"
            >
              <div class="employee tw-flex tw-flex-row tw-items-center tw-font-semibold tw-text-lg">
                <font-awesome-icon
                  :icon="['fas', `fa-${contact.icon}`]"
                  class="icon tw-mr-2"
                ></font-awesome-icon>
                <div class="name">{{ contact.name }}</div>
              </div>
              <div class="post tw-mb-2 tw-text-xs tw-text-gray-400 tw-font-semibold">
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
  </ScrollPanel>
</template>

<script lang="ts" setup>
import { onMounted, ref, type Ref } from 'vue'

import ScrollPanel from 'primevue/scrollpanel'

import Panel from '@/components/PanelItem.vue'

import phoneParse from '@/utils/phone-formatter'

import { useLoadingStore } from '@/stores/loading.store'
import { useAboutStore } from '@/stores/about.store'

// const projectStartYear: number = 2022;

// const currentYear: number = new Date().getFullYear();

const loadingStore = useLoadingStore()

const aboutStore = useAboutStore()

// const copyrightYearString: string =
//   currentYear <= projectStartYear
//     ? `${projectStartYear}`
//     : `${projectStartYear} - ${currentYear}`;

// const publicPath: Ref<string> = ref(new URL(import.meta.env.BASE_URL, import.meta.url).href);
const publicPath: Ref<string> = ref(import.meta.env.BASE_URL)

/**
 * Получение URL-адреса файла в assets.
 * @param {string} link - путь до файла
 */
// function getAsset(link: string) {
//   return new URL(`../assets/${link}`, import.meta.url).href
// }

function getData() {
  aboutStore.readSoftware()
  aboutStore.readChangelog()
}

onMounted(() => {
  getData()
})
</script>

<style lang="css" scoped>
:root > .tw-flex-row {
  @apply tw-mb-4 last:tw-mb-0;
}

.loading-skeleton {
  @apply tw-flex-auto tw-h-0;
}
</style>
