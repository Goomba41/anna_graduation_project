<template>
  <Dialog
    v-model:visible="visible"
    :header="formHeader"
    :style="{ width: '50vw', height: '30vh' }"
    :modal="true"
  >
    <FormPreloader :number-of-fields="1" />

    <ScrollPanel v-show="!loadingStore.loadingState" class="tw-w-full">
      <form
        id="formUserRights"
        autocomplete="off"
        @submit.prevent="onSubmit"
        @reset.prevent="resetData(props.userRights)"
      >
        <div
          v-if="['create', 'update'].includes(mode)"
          class="equal-split tw-flex tw-flex-col tw-w-full tw-p-1"
        >
          <template v-for="field in Rights" :key="field.AppId">
            <div class="field tw-flex tw-flex-col tw-w-full tw-mb-4">
              <div class="tw-flex tw-flex-row tw-items-center">
                <label
                  :for="`Right-${field.value.AppId}`"
                  :title="
                    props.userRights.find((ur) => ur.AppId === field.value.AppId)?.AppName || ''
                  "
                  class="tw-mr-4 tw-font-bold tw-text-base tw-overflow-x-hidden tw-text-ellipsis tw-whitespace-nowrap"
                >
                  <!-- <span
                    class="asterisk tw-text-danger"
                    v-if="$form.data.SrcId.required"
                    >*</span
                  > -->
                  {{ props.userRights.find((ur) => ur.AppId === field.value.AppId)?.AppName }}
                </label>
                <Dropdown
                  :id="`Right-${field.value.AppId}`"
                  v-model="field.value.GroupsId"
                  :input-id="`Right-${field.value.AppId}`"
                  class="tw-flex tw-flex-auto tw-w-4"
                  :options="options.groups[field.value.AppId]"
                  option-label="Name"
                  option-value="Id"
                  :virtual-scroller-options="
                    options.groups[field.value.AppId]?.length > 50 ? { itemSize: 35 } : undefined
                  "
                  :filter="options.groups[field.value.AppId]?.length > 20"
                  @change="setFieldTouched('Rights', true)"
                />
              </div>
            </div>
          </template>
        </div>
      </form>

      <!-- {{ errors }} <br /><br />
      {{ meta }} <br /><br />
      {{ Rights }} -->
    </ScrollPanel>

    <template #footer>
      <div class="tw-flex tw-flex-row tw-justify-end">
        <Button icon-pos="left" class="neutral tw-mr-4" @click="closeModal">
          <font-awesome-icon
            :icon="['fas', 'fa-xmark']"
            :class="['p-button-icon p-button-icon-left']"
          ></font-awesome-icon>
          <div class="p-button-label">Закрыть</div>
        </Button>
        <Button
          v-if="mode !== 'read'"
          icon-pos="left"
          class="warning tw-mr-4"
          type="reset"
          form="formUserRights"
          :disabled="!meta.dirty"
        >
          <font-awesome-icon
            :icon="['fas', 'fa-eraser']"
            :class="['p-button-icon p-button-icon-left']"
          ></font-awesome-icon>
          <div class="p-button-label">Сбросить</div>
        </Button>
        <Button
          v-if="mode !== 'read'"
          icon-pos="left"
          class="success"
          type="submit"
          form="formUserRights"
          :disabled="!(meta.dirty && meta.valid)"
        >
          <font-awesome-icon
            :icon="['fas', `${mode === 'create' ? 'fa-check' : 'fa-floppy-disk'}`]"
            :class="['p-button-icon p-button-icon-left']"
          ></font-awesome-icon>
          <div class="p-button-label">
            {{ mode === 'create' ? 'Создать' : 'Сохранить' }}
          </div>
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { z } from 'zod'
import axios from 'axios'
import { toTypedSchema } from '@vee-validate/zod'
import { useFieldArray, useForm } from 'vee-validate'

import { computed, ref, watch, type Ref, type PropType } from 'vue'

import FormPreloader from '@/components/FormPreloader.vue'

import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import ScrollPanel from 'primevue/scrollpanel'

import toast from '@/utils/toast'
import typeError from '@/utils/type-parse-error'
import useEmitter from '@/utils/emitter'
import callParseErrorToast from '@/utils/type-parse-error'

import { ZRights, TRights, TRight } from '@/typings/user.types'
import { errorResult, successResult } from '@/typings/http.types'

import { useUsersStore } from '@/stores/users.store'
import { useLoadingStore } from '@/stores/loading.store'
import { useDropdownsOptionsStore } from '@/stores/dropdowns-options.store'

const visible: Ref<boolean> = ref(false)

let formHeader: Ref<string> = ref('...')

let mode: Ref<string> = ref('create')

const usersStore = useUsersStore()
const loadingStore = useLoadingStore()
const optionsStore = useDropdownsOptionsStore()

const validationSchema = computed(() => toTypedSchema(z.object({ Rights: ZRights })))

const { handleSubmit, resetForm, meta, setFieldTouched } = useForm({
  validationSchema,
})

const onSubmit = handleSubmit(onSuccess, onInvalid)

const { fields: Rights } = useFieldArray<TRight>('Rights')

const props = defineProps({
  userRights: {
    type: Array as PropType<TRights>,
    default: () => [],
    validator(value: unknown) {
      if (value !== undefined) {
        const parsed = ZRights.safeParse(value)
        if (parsed.success != true) {
          console.warn(parsed)
          typeError(parsed.error, 'warn')
        }
      }
      return true
    },
  },
  disabled: {
    type: Boolean,
    default: () => false,
  },
  user: {
    type: Object as PropType<{ Id: number | null | undefined; Fio: string }>,
    required: true,
  },
})

const { bus } = useEmitter()

const options: Ref<{ [key: string]: unknown[] } | { [key: number | string]: unknown }> = ref({})

watch(
  () => bus.value.get('openAdminUserRightsForm'),
  async () => {
    visible.value = true

    const isNotEmpty = props.userRights // && props.userRights.length !== 0

    mode.value = props.disabled ? 'read' : isNotEmpty ? 'update' : 'create'

    formHeader.value = props.disabled
      ? `Просмотр прав доступа пользователя ${'«' + props.user.Fio + '»' || ''}`
      : isNotEmpty
        ? `Редактирование прав доступа пользователя ${'«' + props.user.Fio + '»' || ''}`
        : 'Этого заголовка не должно быть'

    options.value.groups = {}

    if (isNotEmpty) {
      const appIds: number[] = props.userRights.map((ur) => ur.AppId)

      // Составим список Promise и дождемся их выполнения синхронно
      await Promise.all(
        appIds.map(async (app) => {
          options.value.groups[app] =
            (await optionsStore.read('rights-groups', undefined, {
              apps: app,
            })) || []
        }),
      )

      usersStore.activity(
        'write',
        2,
        `Просмотр прав пользователя ${props.user.Id} ${props.user.Fio}`,
      )
    }

    if (props.userRights) {
      resetData(props.userRights)
    } else {
      resetData()
    }
  },
)

async function onSuccess(form: { Rights: TRights }) {
  const parsed = ZRights.safeParse(form.Rights)
  if (parsed.success) {
    // В теории здесь всегда редактирование,
    // потому что если прав нет в базе, они сгенерятся на бэке и
    // после отправки сохранятся в базе.
    // Без использования хранилища, так как нет смысла его заводить
    // ради одного запроса, еще и данные не надо хранить и передавать
    axios
      .put(`/api/users/${props.user.Id}/subsystems/rights`, parsed.data)
      .then(async (responseJSON) => {
        // const result = successResult.extend({ createdId: z.number(), data: ZUser })

        const error = errorResult.safeParse(responseJSON)
        const response = successResult.safeParse(responseJSON)

        if (response.success === true) {
          // const { createdId, data: form } = response.data

          toast('Успех', 'Права пользователя обновлены', 'success')
          closeModal()
          return Promise.resolve(parsed.data)
        } else if (error.success === true) {
          const { data } = error
          toast('Ошибка', data.ErrorMsg || data.Error, 'error')
          return Promise.reject(data.ErrorMsg || data.Error)
        } else {
          callParseErrorToast(response.error)
          callParseErrorToast(error.error)
          return Promise.reject(`${error.error}; ${response.error}`)
        }
      })
      .catch((error) => {
        callParseErrorToast(error)
        return Promise.reject(error)
      })
  } else {
    toast('Ошибка!', "Ошибка приведения к типу 'Rights'", 'error')
  }
}

function onInvalid({ values, errors, results }) {
  console.log(values) // current form values
  console.error(errors) // a map of field names and their first error message
  console.warn(results) // a detailed map of field names and their validation results
}

// Сброс формы
function resetData(form?: TRights) {
  if (form) {
    resetForm({ values: { Rights: form } })
  } else {
    resetForm()
    // resetForm({
    //   values: {
    //     Id: undefined,
    //     Fio: undefined,
    //     Fam: null,
    //     Nam: null,
    //     Ot: null,
    //     Name: null,
    //     Email: null,
    //     Telephone: null,
    //     Sysadmin: false,
    //   },
    // })
  }
}

const closeModal = () => {
  resetData()
  visible.value = false
}
</script>

<style lang="css" scoped></style>
