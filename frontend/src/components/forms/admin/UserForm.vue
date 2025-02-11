<template>
  <Dialog
    v-model:visible="visible"
    :header="formHeader"
    :style="{
      width: '48vw',
      height: '60vh',
    }"
    :modal="true"
    style="left: 514px; top: 126px"
  >
    <ScrollPanel class="tw-w-full">
      <form
        id="formUser"
        autocomplete="false"
        @submit.prevent="onSubmit"
        @reset.prevent="resetData(props.user)"
      >
        <div
          v-if="['create', 'update'].includes(mode)"
          class="tw-flex tw-flex-col tw-w-full tw-p-1"
        >
          <div class="field tw-flex tw-flex-col tw-w-full tw-mb-4">
            <div class="tw-flex tw-flex-row tw-items-center">
              <label
                for="Фамилия"
                title="Фамилия, имя, отчество"
                class="tw-max-w-[50%] tw-mr-4 tw-font-bold tw-text-base tw-text-ellipsis tw-whitespace-nowrap"
              >
                <span
                  v-if="SurnameMeta.required"
                  class="asterisk tw-text-danger"
                  >*</span
                >
                ФИО
              </label>

              <div class="p-inputgroup">
                <InputText
                  id="Фамилия"
                  ref="firstFormField"
                  v-model.trim="Surname"
                  autocomplete="none"
                  :title="Surname"
                  input-id="Surname"
                  class="tw-flex tw-flex-auto tw-flex-col"
                  :class="[
                    (SurnameMeta.dirty || SurnameMeta.touched) &&
                    !SurnameMeta.valid &&
                    SurnameMeta.validated
                      ? 'invalid'
                      : '',
                  ]"
                  placeholder="*Фамилия (3-100 символов)"
                  @input="setFieldTouched('lastName', true)"
                />
                <InputText
                  id="Name"
                  v-model.trim="Name"
                  autocomplete="none"
                  :title="Name"
                  input-id="Name"
                  class="tw-flex tw-flex-auto tw-flex-col"
                  :class="[
                    (NameMeta.dirty || NameMeta.touched) &&
                    !NameMeta.valid &&
                    NameMeta.validated
                      ? 'invalid'
                      : '',
                  ]"
                  placeholder="*Имя (3-100 символов)"
                  @input="setFieldTouched('firstName', true)"
                />
                <InputText
                  v-model.trim="Patronymic"
                  autocomplete="none"
                  :title="Patronymic"
                  input-id="Patronymic"
                  class="tw-flex tw-flex-auto tw-flex-col"
                  :class="[
                    (PatronymicMeta.dirty || PatronymicMeta.touched) &&
                    !PatronymicMeta.valid &&
                    PatronymicMeta.validated
                      ? 'invalid'
                      : '',
                  ]"
                  placeholder="Отчество (3-100 символов)"
                  @input="setFieldTouched('patronymic', true)"
                />
              </div>
            </div>

            <div
              v-if="
                ((SurnameMeta.dirty || SurnameMeta.touched) &&
                  !SurnameMeta.valid &&
                  SurnameMeta.validated) ||
                ((NameMeta.dirty || NameMeta.touched) &&
                  !NameMeta.valid &&
                  NameMeta.validated) ||
                ((PatronymicMeta.dirty || PatronymicMeta.touched) &&
                  !PatronymicMeta.valid &&
                  PatronymicMeta.validated)
              "
              class="tw-mt-2"
            >
              <span
                v-for="error of Object.keys(errors)
                  .map((s) =>
                    ['lastName', 'firstName', 'patronymic'].includes(s)
                      ? s
                      : undefined,
                  )
                  .filter((s) => s !== undefined)"
                :key="error"
                class="tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
              >
                <ExclamationTriangle class="tw-mr-2" />
                {{ errors.firstName || errors.lastName || errors.patronymic }}
              </span>
            </div>
          </div>

          <div class="field tw-flex tw-flex-col tw-w-full tw-mb-4">
            <div class="tw-flex tw-flex-row tw-items-center">
              <label
                for="Login"
                title="Логин"
                class="tw-max-w-[50%] tw-mr-4 tw-font-bold tw-text-base tw-overflow-x-hidden tw-text-ellipsis tw-whitespace-nowrap"
              >
                <span v-if="LoginMeta.required" class="asterisk tw-text-danger"
                  >*</span
                >
                Логин
              </label>

              <InputText
                id="Login"
                v-model.trim="Login"
                :title="Login"
                input-id="Login"
                class="tw-flex tw-flex-auto tw-flex-col"
                :class="[
                  (LoginMeta.dirty || LoginMeta.touched) &&
                  !LoginMeta.valid &&
                  LoginMeta.validated
                    ? 'invalid'
                    : '',
                ]"
                placeholder="3-110 символов"
                @input="setFieldTouched('login', true)"
              />
            </div>

            <div
              v-if="
                (LoginMeta.dirty || LoginMeta.touched) &&
                !LoginMeta.valid &&
                LoginMeta.validated
              "
              class="tw-mt-2"
            >
              <span
                class="tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
              >
                <ExclamationTriangle class="tw-mr-2" />
                {{ errors.login }}
              </span>
            </div>
          </div>

          <div class="field tw-flex tw-flex-col tw-w-full tw-mb-4">
            <div class="tw-flex tw-flex-row tw-items-center">
              <label
                for="Password"
                title="Пароль"
                class="tw-max-w-[50%] tw-mr-4 tw-font-bold tw-text-base tw-text-ellipsis tw-whitespace-nowrap"
              >
                <span
                  v-if="PasswordMeta.required"
                  class="asterisk tw-text-danger"
                  >*</span
                >
                Пароль
              </label>

              <div class="tw-flex tw-flex-col tw-w-full">
                <div class="p-inputgroup">
                  <InputText
                    id="Password"
                    v-model.trim="Password"
                    :title="Password"
                    input-id="Password"
                    class="tw-flex tw-flex-auto tw-flex-col"
                    :class="[
                      (PasswordMeta.dirty || PasswordMeta.touched) &&
                      !PasswordMeta.valid &&
                      PasswordMeta.validated
                        ? 'invalid'
                        : '',
                    ]"
                    placeholder="от 6 символов"
                    @input="setFieldTouched('password', true)"
                  />

                  <Button icon-pos="left" class="tw-mr-2" @click="getPassword">
                    <ArrowsRotate class="p-button-icon" />
                  </Button>
                </div>
                <small
                  v-if="mode !== 'create'"
                  id="password-help"
                  class="tw-flex tw-items-center tw-text-xs tw-text-slate-400 tw-mt-2"
                >
                  <LightbulbTwotone
                    class="p-button-icon tw-mr-2 tw-h-5 tw-w-5 tw-text-amber-500"
                  />
                  При заполнении пароль будет перезаписан!</small
                >
                <small
                  v-if="Password && weak(Password)"
                  id="password-warning"
                  class="tw-text-warning tw-text-xs tw-mt-2"
                >
                  <ExclamationTriangle class="p-button-icon tw-mr-2" />
                  Слабый пароль! Используйте его на свой страх и риск!</small
                >
              </div>
            </div>

            <div
              v-if="
                (PasswordMeta.dirty || PasswordMeta.touched) &&
                !PasswordMeta.valid &&
                PasswordMeta.validated
              "
              class="tw-mt-2"
            >
              <span
                class="tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
              >
                <ExclamationTriangle class="tw-mr-2" />
                {{ errors.password }}
              </span>
            </div>
          </div>

          <div
            v-if="
              Number.parseInt(
                useAuthStore().user?.UserId.toString() || '-1',
                10,
              ) !== props.user?.id
            "
            class="field tw-flex tw-flex-col tw-w-full tw-mb-4"
          >
            <div class="tw-flex tw-flex-row tw-items-center">
              <label
                for="Sysadmin"
                title="Системный администратор"
                class="tw-max-w-[50%] tw-mr-4 tw-font-bold tw-text-base tw-text-ellipsis tw-whitespace-nowrap"
              >
                <span
                  v-if="SysadminMeta.required"
                  class="asterisk tw-text-danger"
                  >*</span
                >
                Системный администратор
              </label>

              <div class="tw-flex tw-flex-col tw-w-full">
                <div class="p-inputgroup">
                  <Checkbox
                    v-model="Sysadmin"
                    :binary="true"
                    @change="setFieldTouched('sysadmin', true)"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="row tw-flex tw-flex-row tw-w-full tw-mb-5">
            <div class="field tw-flex tw-flex-col tw-w-full">
              <div class="tw-flex tw-flex-row tw-items-center">
                <label
                  for="Phone"
                  title="Телефон"
                  class="tw-max-w-[50%] tw-mr-4 tw-font-bold tw-text-base tw-overflow-x-hidden tw-text-ellipsis tw-whitespace-nowrap"
                >
                  <span
                    v-if="PhoneMeta.required"
                    class="asterisk tw-text-danger"
                    >*</span
                  >
                  Телефон
                </label>

                <InputMask
                  id="Phone"
                  v-model.trim="Phone"
                  autocomplete="none"
                  input-id="Phone"
                  class="tw-flex tw-flex-auto tw-flex-col"
                  :class="[
                    (PhoneMeta.dirty || PhoneMeta.touched) &&
                    !PhoneMeta.valid &&
                    PhoneMeta.validated
                      ? 'invalid'
                      : '',
                  ]"
                  placeholder="+7 (ххх) ххх-хх-хх доб. хххх"
                  mask="+7 (999) 999-99-99? доб. 9999"
                  :unmask="true"
                  :auto-clear="true"
                  @keydown="setFieldTouched('phone', true)"
                />
              </div>

              <div
                v-if="
                  (PhoneMeta.dirty || PhoneMeta.touched) &&
                  !PhoneMeta.valid &&
                  PhoneMeta.validated
                "
                class="tw-mt-2"
              >
                <span
                  class="tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
                >
                  <ExclamationTriangle class="tw-mr-2" />
                  {{ errors.phone }}
                </span>
              </div>
            </div>

            <div class="field tw-flex tw-flex-col tw-w-full tw-ml-4">
              <div class="tw-flex tw-flex-row tw-items-center">
                <label
                  for="Email"
                  title="Эл. почта"
                  class="tw-max-w-[50%] tw-mr-4 tw-font-bold tw-text-base tw-overflow-x-hidden tw-text-ellipsis tw-whitespace-nowrap"
                >
                  <span
                    v-if="EmailMeta.required"
                    class="asterisk tw-text-danger"
                    >*</span
                  >
                  Эл. почта
                </label>

                <InputText
                  id="Email"
                  v-model.trim="Email"
                  autocomplete="none"
                  input-id="Email"
                  class="tw-flex tw-flex-auto tw-flex-col"
                  :class="[
                    (EmailMeta.dirty || EmailMeta.touched) &&
                    !EmailMeta.valid &&
                    EmailMeta.validated
                      ? 'invalid'
                      : '',
                  ]"
                  placeholder="example@example.ru"
                  @input="setFieldTouched('email', true)"
                />
              </div>

              <div
                v-if="
                  (EmailMeta.dirty || EmailMeta.touched) &&
                  !EmailMeta.valid &&
                  EmailMeta.validated
                "
                class="tw-mt-2"
              >
                <span
                  class="tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
                >
                  <ExclamationTriangle class="tw-mr-2" />
                  {{ errors.email }}
                </span>
              </div>
            </div>
          </div>

          <!-- {{ SurnameMeta }} <br /><br />
          {{ NameMeta }} <br /><br />
          {{ PatronymicMeta }} <br /><br />
          {{ LoginMeta }} <br /><br />
          {{ PasswordMeta }} <br /><br />
          {{ SysadminMeta }} <br /><br />
          {{ PhoneMeta }} <br /><br />
          {{ EmailMeta }} <br /><br />
          {{ meta }} <br /><br />
          {{ errors }} -->
        </div>
      </form>
    </ScrollPanel>

    <template #footer>
      <div class="tw-flex tw-flex-row tw-justify-end">
        <Button icon-pos="left" class="neutral tw-mr-4" @click="closeModal">
          <TimesCircle class="p-button-icon p-button-icon-left" />
          <div class="p-button-label">Закрыть</div>
        </Button>
        <Button
          v-if="mode !== 'read'"
          icon-pos="left"
          class="warning tw-mr-4"
          :disabled="!meta.dirty"
          type="reset"
          form="formUser"
        >
          <EraserTwotone class="p-button-icon p-button-icon-left" />
          <div class="p-button-label">Сбросить</div>
        </Button>
        <Button
          v-if="mode !== 'read'"
          icon-pos="left"
          class="success"
          :disabled="!(meta.dirty && meta.valid)"
          type="submit"
          form="formUser"
        >
          <FloppyDisk class="p-button-icon p-button-icon-left" />
          <div class="p-button-label">
            {{ mode === "create" ? "Создать" : "Сохранить" }}
          </div>
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, watch, type Ref, type PropType, computed } from "vue";

import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Checkbox from "primevue/checkbox";
import InputText from "primevue/inputtext";
import InputMask from "primevue/inputmask";
import ScrollPanel from "primevue/scrollpanel";

import { z } from "zod";
import { useFocus } from "@vueuse/core";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";

import toast from "@/utils/toast";
import typeError from "@/utils/type-parse-error";
import useEmitter from "@/utils/emitter";
import transliterate from "@/utils/transliterate";
import generate, { strengthCheck as weak } from "@/utils/password-generator";

import { useAuthStore } from "@/stores/auth.store";
import { useUsersStore } from "@/stores/users.store";

import type { TUser } from "@/typings/user.types";
import { ZUser } from "@/typings/user.types";

import FloppyDisk from "@/components/icons/FloppyDisk.vue";
import TimesCircle from "@/components/icons/TimesCircle.vue";
import EraserTwotone from "@/components/icons/EraserTwotone.vue";
import ExclamationTriangle from "@/components/icons/ExclamationTriangle.vue";
import LightbulbTwotone from "@/components/icons/LightbulbTwotone.vue";
import ArrowsRotate from "@/components/icons/ArrowsRotate.vue";

const props = defineProps({
  user: {
    type: Object as PropType<TUser>,
    default: () => undefined,
    validator(value) {
      if (value !== undefined) {
        const parsed = ZUser.safeParse(value);
        if (parsed.success === false) {
          console.warn(parsed);
          typeError(parsed.error, "warn");
          // throw new TypeError(
          //   "Invalid prop: custom validator check failed for prop 'user'"
          // );
        }
      }
      return true;
    },
  },
  disabled: {
    type: Boolean,
    default: () => false,
  },
});

const visible: Ref<boolean> = ref(false);

const formHeader: Ref<string> = ref("...");

const mode: Ref<string> = ref(
  props.disabled ? "read" : props.user ? "update" : "create",
);

const usersStore = useUsersStore();

const firstFormField = ref();

const { bus } = useEmitter();

// ? Если нужно будет запросить справочники
// const options: Ref<{ [key: string]: unknown[] }> = ref({})

const validationSchema = computed(() =>
  toTypedSchema(
    mode.value === "create"
      ? ZUser.merge(
          z.object({
            password: z
              .string()
              .min(6, "Минимум 6 символов")
              .regex(
                /^[a-zA-Z0-9!@#$%^&*()_+~|}{[\]:;?></=]*$/,
                "Только символы латиницы, цифры и спец. символы !@#$%^&*()_+~|}{[\\]:;?></=",
              )
              .nullish()
              .default(null),
          }),
        )
      : ZUser,
  ),
);

const {
  handleSubmit,
  errors,
  resetForm,
  meta,
  setFieldTouched,
  setFieldValue,
} = useForm({
  validationSchema,
});

const onSubmit = handleSubmit(onSuccess, onInvalid);

// 👇 Поля формы
const { value: Surname, meta: SurnameMeta } = useField<string>("lastName");
const { value: Name, meta: NameMeta } = useField<string>("firstName");
const { value: Patronymic, meta: PatronymicMeta } = useField<
  string | undefined
>("patronymic", undefined, {
  initialValue: undefined,
});
const { value: Password, meta: PasswordMeta } = useField<string>("password", {
  initialValue: null,
});
const { value: Login, meta: LoginMeta } = useField<string>("login");
const { value: Email, meta: EmailMeta } = useField<string | undefined>(
  "email",
  undefined,
  {
    initialValue: undefined,
  },
);
const { value: Phone, meta: PhoneMeta } = useField<string | undefined>(
  "phone",
  undefined,
  {
    initialValue: undefined,
  },
);
const { value: Sysadmin, meta: SysadminMeta } = useField<boolean>(
  "sysadmin",
  undefined,
  {
    initialValue: false,
  },
);

const emitEvent = defineEmits<{
  created: [response: { createdId: number; form: TUser }];
  updated: [response: { updatedId: number; form: TUser }];
}>();

async function onSuccess(user: TUser) {
  user.fullName = `${user.lastName} ${user.firstName}${user.patronymic ? ` ${user.patronymic}` : ""}`;

  const parsed = ZUser.safeParse(user);
  if (parsed.success) {
    let query:
      | Promise<
          | { createdId: number; form: TUser }
          | { updatedId: number; form: TUser }
        >
      | undefined;
    if (mode.value === "create") {
      query = usersStore.create(parsed.data);
    } else if (mode.value === "update") {
      query = usersStore.update(parsed.data);
    }

    await query?.then(async (response) => {
      let message = "Пользователь создан";

      if ("updatedId" in response) {
        message = "Пользователь обновлён";
        emitEvent("updated", response);
        usersStore.activity(
          "write",
          `Изменение пользователя ${response.updatedId}`,
        );
      } else if ("createdId" in response) {
        emitEvent("created", response);
        usersStore.activity(
          "write",
          `Добавление пользователя ${response.createdId}`,
        );
      }

      toast("Успех", message, "success");
      closeModal();
    });
    // console.log(parsed.data);
    // toast("Успех", `Пользователь «${parsed.data.fullName}» создан`, "success");
    // closeModal();
  } else {
    toast("Ошибка!", "Ошибка приведения к типу 'User'", "error");
  }
}

function onInvalid(data: {
  values: unknown;
  errors: unknown;
  results: unknown;
}) {
  const { values, errors, results } = data;
  console.log(values); // current form values
  console.error(errors); // a map of field names and their first error message
  console.warn(results); // a detailed map of field names and their validation results
}

watch(
  () => bus.value.get("openAdminUserForm"),
  async () => {
    visible.value = true;

    const isNotEmpty = props.user;

    mode.value = props.disabled ? "read" : isNotEmpty ? "update" : "create";

    formHeader.value = props.disabled
      ? `Просмотр пользователя «${props.user?.login}»`
      : isNotEmpty
        ? `Редактирование пользователя «${props.user.login}»`
        : "Новый пользователь";

    // ? Если нужно будет запросить справочники
    // const optionsToAsk = [
    //   'users',
    //   'templatecategory',
    //   'orggroup',
    //   'templateinitiator',
    //   'templatestatus',
    // ]

    // ? Если нужно будет запросить справочники
    // await Promise.all(
    //   optionsToAsk.map(async (option) => {
    //     options.value[option] = (await useDropdownsOptionsStore().read(option)) || []
    //   }),
    // )

    if (props.user) {
      resetData(props.user);
    } else {
      resetData();
    }

    useFocus(firstFormField, { initialValue: true });

    if (mode.value === "create") getPassword();
  },
);

watch([Surname, Name, Patronymic], ([Surname, Name, Patronymic]) => {
  if (mode.value === "create") {
    const stringToTransliterate = `${Surname ?? ""}${Name ? Name.charAt(0) : ""}${Patronymic ? Patronymic.charAt(0) : ""}`;

    const transliterated = transliterate(stringToTransliterate);
    if (transliterated) {
      setFieldValue("login", transliterated);
      setFieldTouched("login", true);
    }
  }
});

function getPassword() {
  setFieldValue("password", generate());
  setFieldTouched("password", true);
}

// Сброс формы
function resetData(form?: TUser) {
  if (form) {
    resetForm({ values: form });
  } else {
    resetForm({
      values: {
        id: undefined,
        fullName: undefined,
        lastName: undefined,
        firstName: undefined,
        patronymic: undefined,
        login: undefined,
        email: undefined,
        phone: undefined,
        sysadmin: false,
      },
    });
  }

  if (mode.value === "create") setFieldValue("password", generate());
}

const closeModal = () => {
  resetData();
  visible.value = false;
};
</script>

<style lang="css" scoped></style>
