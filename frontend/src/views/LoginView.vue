<template>
  <div
    class="tw-flex tw-flex-row tw-min-h-screen tw-justify-end tw-bg-primary tw-w-full"
  >
    <div
      class="tw-flex tw-flex-col tw-min-h-screen tw-bg-white tw-justify-center tw-w-1/2 tw-rounded-l-3xl tw-px-32 tw-py-16"
    >
      <!-- <h1 class="tw-font-bold tw-text-5xl tw-pb-4">Добро пожаловать в ИС «ЭКО»</h1> -->
      <h1 class="tw-font-bold tw-text-5xl tw-pb-4">
        Вход в систему
        <span :title="typeof app_name === 'string' ? app_name : app_name[1]"
          >«{{ typeof app_name === "string" ? app_name : app_name[2] }}»</span
        >
      </h1>
      <h4 class="tw-font-semibold tw-text-base tw-text-gray-400 tw-pb-10">
        Авторизуйтесь в вашей учетной записи
      </h4>

      <form
        id="form"
        class="tw-flex tw-flex-col tw-gap-3"
        autocomplete="off"
        @submit="onSubmit"
      >
        <div class="field tw-flex tw-flex-col tw-gap-1">
          <InputText
            ref="loginInput"
            v-model.trim="Login"
            type="text"
            placeholder="Логин"
            autofocus
            class="tw-w-1/2"
            :class="[errors.Login ? 'invalid tw-border-danger' : '']"
          />
          <span
            v-if="errors.Login"
            class="tw-justify-start tw-mt-2 tw-font-semibold tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
          >
            <ExclamationTriangle class="tw-mr-2 tw-h-4" />
            {{ errors.Login }}
          </span>
        </div>

        <div class="field tw-flex tw-flex-col tw-gap-1">
          <div class="p-inputgroup tw-w-1/2">
            <InputText
              v-model="Password"
              placeholder="Пароль"
              :type="passwordInputType"
              :class="[errors.Password ? 'invalid tw-border-danger' : '']"
            />
            <Button
              loading-icon="fas fa-spinner fa-pulse"
              icon-pos="left"
              @click="togglePasswordVisibility"
            >
              <EyeOpened v-if="passwordInputType === 'password'" />
              <EyeSlashed v-else />
            </Button>
          </div>
          <span
            v-if="errors.Password"
            class="tw-justify-start tw-mt-2 tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
          >
            <ExclamationTriangle class="tw-mr-2" />
            {{ errors.Password }}
          </span>
        </div>

        <Button
          type="submit"
          form="form"
          class="tw-mt-2"
          :disabled="
            !meta.dirty ||
            meta.pending ||
            !meta.valid ||
            loadingStore.loadingState
          "
        >
          <SignIn
            v-if="!loadingStore.loadingState"
            class="p-button-icon-left"
          />
          <SpinnerDotted v-else class="fa-spin p-button-icon-left" />
          <div class="p-button-label">Войти</div>
        </Button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, type Ref, onMounted } from "vue";

import Button from "primevue/button";
import InputText from "primevue/inputtext";

import z from "zod";
import { fromError } from "zod-validation-error";
import { toTypedSchema } from "@vee-validate/zod";
import { useField, useForm } from "vee-validate";

import { useFocus } from "@vueuse/core";

import { useAuthStore } from "@/stores/auth.store";
import { useLoadingStore } from "@/stores/loading.store";

import toast from "@/utils/toast";
import nameSystem from "@/utils/meme-naming";

import SignIn from "@/components/icons/SignIn.vue";
import EyeOpened from "@/components/icons/EyeOpened.vue";
import EyeSlashed from "@/components/icons/EyeSlashed.vue";
import SpinnerDotted from "@/components/icons/SpinnerDotted.vue";
import ExclamationTriangle from "@/components/icons/ExclamationTriangle.vue";

const app_name: string =
  process.env.NODE_ENV !== "development"
    ? nameSystem()[2]
    : "АИС «Документооборот»";

// Хранилище процесса загрузки
const loadingStore = useLoadingStore();

// Хранилище аутентификации
const authStore = useAuthStore();

// Тип поля ввода пароля (открытый текст или пароль)
const passwordInputType: Ref<"text" | "password"> = ref("password");

// Объявление ref, содержащий в себе элемент в шаблоне (input пароля)
const loginInput = ref();

const PasswordField =
  process.env.NODE_ENV === "development"
    ? z
        .string()
        .min(1, { message: "Обязательное поле" })
        .max(50, { message: "Не более 50 символов" })
        .regex(/^[a-zA-Z0-9!@#$%^&*()_+~|}{[\]:;?></=]*$/, {
          message: "В пароле есть неподдерживаемые символы",
        })
    : z
        .string()
        .min(8, { message: "Не менее 8 символов" })
        .max(50, { message: "Не более 50 символов" })
        .regex(/^[a-zA-Z0-9!@#$%^&*()_+~|}{[\]:;?></=]*$/, {
          message: "В пароле есть неподдерживаемые символы",
        });

const ZLoginForm = z.object({
  Login: z
    .string()
    .min(3, { message: "Не менее 3 символов" })
    .max(50, { message: "Не более 50 символов" })
    .regex(/^[A-Za-z0-9_]*$/, { message: "Только латиница, цифры и символ _" }),
  Password: PasswordField,
});

// Схема валидации
const validationSchema = toTypedSchema(ZLoginForm);

const { handleSubmit, errors, meta } = useForm({
  validationSchema,
});

const { value: Login } = useField<string>("Login");
const { value: Password } = useField<string>("Password");

const onSubmit = handleSubmit((values) => {
  const parsed = ZLoginForm.safeParse(values);
  if (parsed.success === true) {
    const form = parsed.data;
    authStore.login(form.Login.trim(), form.Password.trim());
  } else {
    toast("Ошибка!", "Ошибка приведения к типу 'LoginForm'", "error");

    const validationError = fromError(parsed.error);
    console.error(validationError.toString());
  }
});

// Это функция, которая переключает видимость пароля
function togglePasswordVisibility() {
  passwordInputType.value =
    passwordInputType.value === "password" ? "text" : "password";
}

onMounted(() => {
  // Автоматический фокус на поле ввода логина
  useFocus(loginInput, { initialValue: true });
});
</script>

<style lang="css" scoped></style>
