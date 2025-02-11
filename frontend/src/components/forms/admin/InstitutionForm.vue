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
    @show="showDialog"
  >
    <ScrollPanel class="tw-w-full">
      <form
        id="formUser"
        autocomplete="false"
        @submit.prevent="onSubmit"
        @reset.prevent="resetData(props.institution)"
      >
        <div
          v-if="['create', 'update'].includes(mode)"
          class="tw-flex tw-flex-col tw-w-full tw-p-1"
        >
          <div class="field tw-flex tw-flex-col tw-w-full tw-mb-4">
            <div class="tw-flex tw-flex-row tw-items-center">
              <label
                for="Name"
                title="Наименование"
                class="tw-max-w-[50%] tw-mr-4 tw-font-bold tw-text-base tw-overflow-x-hidden tw-text-ellipsis tw-whitespace-nowrap"
              >
                <span v-if="NameMeta.required" class="asterisk tw-text-danger"
                  >*</span
                >
                Наименование
              </label>

              <InputText
                id="Name"
                ref="firstFormField"
                v-model.trim="Name"
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
                placeholder="1-300 символов"
                @input="setFieldTouched('name', true)"
              />
            </div>

            <div
              v-if="
                (NameMeta.dirty || NameMeta.touched) &&
                !NameMeta.valid &&
                NameMeta.validated
              "
              class="tw-mt-2"
            >
              <span
                class="tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
              >
                <ExclamationTriangle class="tw-mr-2" />
                {{ errors.name }}
              </span>
            </div>
          </div>

          <div class="field tw-flex tw-flex-col tw-w-full tw-mb-4">
            <div class="tw-flex tw-flex-row tw-items-center">
              <label
                for="Subject"
                title="Субъект"
                class="tw-max-w-[50%] tw-mr-4 tw-font-bold tw-text-base tw-text-ellipsis tw-whitespace-nowrap"
              >
                <span
                  v-if="SubjectMeta.required"
                  class="asterisk tw-text-danger"
                  >*</span
                >
                Субъект
              </label>
              <Dropdown
                id="Subject"
                v-model="Subject"
                class="tw-flex tw-flex-auto tw-w-4"
                :loading="subjectsIsLoading"
                :disabled="subjectsIsLoading"
                :class="[
                  (SubjectMeta.dirty || SubjectMeta.touched) &&
                  !SubjectMeta.valid &&
                  SubjectMeta.validated
                    ? 'invalid'
                    : '',
                ]"
                :filter="subjectsOptions.length > 20"
                :options="subjectsOptions"
                :virtual-scroller-options="
                  subjectsOptions.length > 50 ? { itemSize: 35 } : undefined
                "
                option-value="objectId"
                option-label="fullName"
                :placeholder="
                  subjectsIsLoading ? 'Идёт загрузка...' : 'Выберите субъект РФ'
                "
                @change="
                  setFieldTouched('subject', true);
                  setFieldValue(
                    'subjectString',
                    getFIASObjectName(Subject, 'subject'),
                    false,
                  );
                  getFIASObjects('districts', Subject);
                "
              >
              </Dropdown>
            </div>
            <div
              v-if="
                (SubjectMeta.dirty || SubjectMeta.touched) &&
                !SubjectMeta.valid &&
                SubjectMeta.validated
              "
              class="tw-mt-2"
            >
              <span
                class="tw-justify-end tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
              >
                <ExclamationTriangle class="tw-mr-2" />
                {{ errors.subject }}
              </span>
            </div>
          </div>

          <div class="field tw-flex tw-flex-col tw-w-full tw-mb-4">
            <div class="tw-flex tw-flex-row tw-items-center">
              <label
                for="District"
                title="Район"
                class="tw-max-w-[50%] tw-mr-4 tw-font-bold tw-text-base tw-text-ellipsis tw-whitespace-nowrap"
              >
                <span
                  v-if="DistrictMeta.required"
                  class="asterisk tw-text-danger"
                  >*</span
                >
                Район
              </label>
              <Dropdown
                id="District"
                v-model="District"
                :disabled="!Subject || districtsIsLoading"
                class="tw-flex tw-flex-auto tw-w-4"
                :class="[
                  (DistrictMeta.dirty || DistrictMeta.touched) &&
                  !DistrictMeta.valid &&
                  DistrictMeta.validated
                    ? 'invalid'
                    : '',
                ]"
                :filter="districtsOptions.length > 20"
                :options="districtsOptions"
                :virtual-scroller-options="
                  districtsOptions.length > 50 ? { itemSize: 35 } : undefined
                "
                option-value="objectId"
                option-label="fullName"
                :loading="districtsIsLoading"
                :placeholder="
                  districtsIsLoading
                    ? 'Идёт загрузка...'
                    : 'Выберите район субъекта'
                "
                @change="
                  setFieldTouched('district', true);
                  setFieldValue(
                    'districtString',
                    getFIASObjectName(District, 'district'),
                    false,
                  );
                  getFIASObjects('localities', Subject, District);
                "
              >
              </Dropdown>
            </div>
            <div
              v-if="
                (DistrictMeta.dirty || DistrictMeta.touched) &&
                !DistrictMeta.valid &&
                DistrictMeta.validated
              "
              class="tw-mt-2"
            >
              <span
                class="tw-justify-end tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
              >
                <ExclamationTriangle class="tw-mr-2" />
                {{ errors.district }}
              </span>
            </div>
          </div>

          <div class="field tw-flex tw-flex-col tw-w-full tw-mb-4">
            <div class="tw-flex tw-flex-row tw-items-center">
              <label
                for="Locality"
                title="Населённый пункт"
                class="tw-max-w-[50%] tw-mr-4 tw-font-bold tw-text-base tw-text-ellipsis tw-whitespace-nowrap"
              >
                <span
                  v-if="LocalityMeta.required"
                  class="asterisk tw-text-danger"
                  >*</span
                >
                Населённый пункт
              </label>
              <Dropdown
                id="Locality"
                v-model="Locality"
                :disabled="
                  !District ||
                  !Subject ||
                  districtsIsLoading ||
                  localitiesIsLoading
                "
                class="tw-flex tw-flex-auto tw-w-4"
                :class="[
                  (LocalityMeta.dirty || LocalityMeta.touched) &&
                  !LocalityMeta.valid &&
                  LocalityMeta.validated
                    ? 'invalid'
                    : '',
                ]"
                :filter="localitiesOptions.length > 20"
                :options="localitiesOptions"
                :virtual-scroller-options="
                  localitiesOptions.length > 50 ? { itemSize: 35 } : undefined
                "
                option-value="objectId"
                option-label="fullName"
                :loading="localitiesIsLoading || districtsIsLoading"
                :placeholder="
                  localitiesIsLoading && District
                    ? 'Идёт загрузка...'
                    : 'Выберите нас. пункт района'
                "
                @change="
                  setFieldTouched('locality', true);
                  setFieldValue(
                    'localityString',
                    getFIASObjectName(Locality, 'locality'),
                    false,
                  );
                "
              >
              </Dropdown>
            </div>
            <div
              v-if="
                (LocalityMeta.dirty || LocalityMeta.touched) &&
                !LocalityMeta.valid &&
                LocalityMeta.validated
              "
              class="tw-mt-2"
            >
              <span
                class="tw-justify-end tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
              >
                <ExclamationTriangle class="tw-mr-2" />
                {{ errors.locality }}
              </span>
            </div>
          </div>

          <div class="field tw-flex tw-flex-col tw-w-full tw-mb-4">
            <div class="tw-flex tw-flex-row tw-items-center">
              <label
                for="Address"
                title="Адрес"
                class="tw-max-w-[50%] tw-mr-4 tw-font-bold tw-text-base tw-overflow-x-hidden tw-text-ellipsis tw-whitespace-nowrap"
              >
                <span
                  v-if="AddressMeta.required"
                  class="asterisk tw-text-danger"
                  >*</span
                >
                Адрес
              </label>

              <InputText
                id="Address"
                v-model.trim="Address"
                :title="Address"
                input-id="Address"
                class="tw-flex tw-flex-auto tw-flex-col"
                :class="[
                  (AddressMeta.dirty || AddressMeta.touched) &&
                  !AddressMeta.valid &&
                  AddressMeta.validated
                    ? 'invalid'
                    : '',
                ]"
                placeholder="1-300 символов"
                @input="setFieldTouched('address', true)"
              />
            </div>

            <div
              v-if="
                (AddressMeta.dirty || AddressMeta.touched) &&
                !AddressMeta.valid &&
                AddressMeta.validated
              "
              class="tw-mt-2"
            >
              <span
                class="tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
              >
                <ExclamationTriangle class="tw-mr-2" />
                {{ errors.address }}
              </span>
            </div>
          </div>

          <div class="field tw-flex tw-flex-col tw-w-full tw-mb-4">
            <div class="tw-flex tw-flex-row tw-items-center">
              <label
                for="Contact"
                title="Контакт"
                class="tw-max-w-[50%] tw-mr-4 tw-font-bold tw-text-base tw-overflow-x-hidden tw-text-ellipsis tw-whitespace-nowrap"
              >
                <span
                  v-if="ContactMeta.required"
                  class="asterisk tw-text-danger"
                  >*</span
                >
                Контакт
              </label>

              <Textarea
                id="Contact"
                v-model.trim="Contact"
                rows="5"
                cols="30"
                :title="Contact"
                input-id="Contact"
                class="tw-flex tw-flex-auto tw-flex-col"
                :class="[
                  (ContactMeta.dirty || ContactMeta.touched) &&
                  !ContactMeta.valid &&
                  ContactMeta.validated
                    ? 'invalid'
                    : '',
                ]"
                placeholder="1-500 символов"
                @input="setFieldTouched('contact', true)"
              />
            </div>

            <div
              v-if="
                (ContactMeta.dirty || ContactMeta.touched) &&
                !ContactMeta.valid &&
                ContactMeta.validated
              "
              class="tw-mt-2"
            >
              <span
                class="tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
              >
                <ExclamationTriangle class="tw-mr-2" />
                {{ errors.contact }}
              </span>
            </div>
          </div>

          <!-- {{ SubjectMeta }} <br /><br />
          {{ ContactMeta }} <br /><br />
          {{ AddressMeta }} <br /><br />
          {{ NameMeta }} <br /><br />
          {{ meta }} <br /><br />
          {{ errors }}-->
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
          :disabled="!(meta.dirty && meta.valid)"
          icon-pos="left"
          class="success"
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
import Dropdown from "primevue/dropdown";
import Textarea from "primevue/textarea";
import InputText from "primevue/inputtext";
import ScrollPanel from "primevue/scrollpanel";

import { useFocus } from "@vueuse/core";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";

import toast from "@/utils/toast";
import typeError from "@/utils/type-parse-error";
import useEmitter from "@/utils/emitter";

import { useUsersStore } from "@/stores/users.store";
import { useInstitutionsStore } from "@/stores/institutions.store";
import { useOptionsStore } from "@/stores/options.store";

import type { TInstitution } from "@/typings/institution.types";
import { ZInstitution } from "@/typings/institution.types";
import type { TFIASObjects } from "@/typings/fias-object.types";
import { ZFIASObjects } from "@/typings/fias-object.types";

import FloppyDisk from "@/components/icons/FloppyDisk.vue";
import TimesCircle from "@/components/icons/TimesCircle.vue";
import EraserTwotone from "@/components/icons/EraserTwotone.vue";
import ExclamationTriangle from "@/components/icons/ExclamationTriangle.vue";

const props = defineProps({
  institution: {
    type: Object as PropType<TInstitution>,
    default: () => undefined,
    validator(value) {
      if (value !== undefined) {
        const parsed = ZInstitution.safeParse(value);
        if (parsed.success === false) {
          console.warn(parsed);
          typeError(parsed.error, "warn");
          // throw new TypeError(
          //   "Invalid prop: custom validator check failed for prop 'institution'"
          // );
        }
      }
      return true;
    },
  },
  subjects: {
    type: Object as PropType<TFIASObjects>,
    default: () => undefined,
    validator(value) {
      if (value !== undefined) {
        const parsed = ZFIASObjects.safeParse(value);
        if (parsed.success === false) {
          console.warn(parsed);
          typeError(parsed.error, "warn");
          // throw new TypeError(
          //   "Invalid prop: custom validator check failed for prop 'fias_object'"
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
  props.disabled ? "read" : props.institution ? "update" : "create",
);

const usersStore = useUsersStore();
const optionsStore = useOptionsStore();
const institutionsStore = useInstitutionsStore();

const firstFormField = ref();

const { bus } = useEmitter();

// ? Если нужно будет запросить справочники
// const options: Ref<{ [key: string]: unknown[] }> = ref({})

const validationSchema = computed(() => toTypedSchema(ZInstitution));

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
const { value: Name, meta: NameMeta } = useField<string>("name");
const { value: Address, meta: AddressMeta } = useField<string>("address");
const { value: Contact, meta: ContactMeta } = useField<string>("contact");
const { value: Subject, meta: SubjectMeta } = useField<number>("subject");
// const { value: SubjectString } = useField<number>("subjectString");
const { value: District, meta: DistrictMeta } = useField<number>("district");
// const { value: DistrictString } = useField<number>("districtString");
const { value: Locality, meta: LocalityMeta } = useField<number>("locality");
// const { value: LocalityString } = useField<number>("localityString");

const emitEvent = defineEmits<{
  created: [response: { createdId: number; form: TInstitution }];
  updated: [response: { updatedId: number; form: TInstitution }];
}>();

async function onSuccess(institution: TInstitution) {
  const parsed = ZInstitution.safeParse(institution);
  if (parsed.success) {
    let query:
      | Promise<
          | { createdId: number; form: TInstitution }
          | { updatedId: number; form: TInstitution }
        >
      | undefined;
    if (mode.value === "create") {
      query = institutionsStore.create(parsed.data);
    } else if (mode.value === "update") {
      query = institutionsStore.update(parsed.data);
    }

    await query?.then(async (response) => {
      let message = "Учреждение создано";

      if ("updatedId" in response) {
        message = "Учреждение обновлено";
        emitEvent("updated", response);
        usersStore.activity(
          "write",
          `Изменение учреждения ${response.updatedId}`,
        );
      } else if ("createdId" in response) {
        emitEvent("created", response);
        usersStore.activity(
          "write",
          `Добавление учреждения ${response.createdId}`,
        );
      }

      toast("Успех", message, "success");
      closeModal();
    });
    // console.log(parsed.data);
    // toast("Успех", `Учреждение «${parsed.data.name}» создано`, "success");
    // closeModal();
  } else {
    toast("Ошибка!", "Ошибка приведения к типу 'Institution'", "error");
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
  () => bus.value.get("openAdminInstitutionForm"),
  async () => {
    visible.value = true;

    const isNotEmpty = props.institution;

    mode.value = props.disabled ? "read" : isNotEmpty ? "update" : "create";

    formHeader.value = props.disabled
      ? `Просмотр учреждения «${props.institution?.name}»`
      : isNotEmpty
        ? `Редактирование учреждения «${props.institution.name}»`
        : "Новое учреждение";

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

    if (props.institution) {
      resetData(props.institution);
    } else {
      resetData();
    }

    useFocus(firstFormField, { initialValue: true });
  },
);

// TODO: на изменение идентификаторов ФИАС менять текста в форме
// watch([Surname, Name, Patronymic], ([Surname, Name, Patronymic]) => {
//   if (mode.value === "create") {
//     const stringToTransliterate = `${Surname ?? ""}${Name ? Name.charAt(0) : ""}${Patronymic ? Patronymic.charAt(0) : ""}`;

//     const transliterated = transliterate(stringToTransliterate);
//     if (transliterated) {
//       setFieldValue("login", transliterated);
//       setFieldTouched("login", true);
//     }
//   }
// });

// Сброс формы
function resetData(form?: TInstitution) {
  if (form) {
    resetForm({ values: form });
  } else {
    resetForm({
      values: {
        id: undefined,
        name: undefined,
        address: undefined,
        contact: null,
        subject: undefined,
        district: undefined,
        locality: undefined,
        subjectString: undefined,
        districtString: undefined,
        localityString: undefined,
      },
    });
  }
}

const closeModal = () => {
  resetData();
  visible.value = false;
};

const subjectsOptions: Ref<TFIASObjects> = ref([]);
const districtsOptions: Ref<TFIASObjects> = ref([]);
const localitiesOptions: Ref<TFIASObjects> = ref([]);

const subjectsIsLoading: Ref<boolean> = ref(false);
const districtsIsLoading: Ref<boolean> = ref(false);
const localitiesIsLoading: Ref<boolean> = ref(false);

async function showDialog() {
  if (!props.subjects && !optionsStore.subjects) {
    subjectsIsLoading.value = true;
    subjectsOptions.value = (await optionsStore.fias("subjects")) || [];
    subjectsIsLoading.value = false;
    optionsStore.subjects = subjectsOptions.value;
  } else if (
    (props.subjects && !optionsStore.subjects) ||
    (props.subjects && optionsStore.subjects)
  ) {
    subjectsOptions.value = props.subjects;
  } else if (!props.subjects && optionsStore.subjects) {
    subjectsOptions.value = optionsStore.subjects;
  }

  if (props.institution?.subject) {
    districtsIsLoading.value = true;
    districtsOptions.value =
      (await optionsStore.fias("districts", props.institution.subject)) || [];
    districtsIsLoading.value = false;
  }
  if (props.institution?.district) {
    localitiesIsLoading.value = true;
    localitiesOptions.value =
      (await optionsStore.fias(
        "localities",
        props.institution.subject,
        props.institution.district,
      )) || [];
    localitiesIsLoading.value = false;
  }
}

function getFIASObjectName(
  id: number,
  type: "subject" | "district" | "locality",
): string {
  let object: TFIASObjects = [];

  if (type === "subject") object = subjectsOptions.value;
  if (type === "district") object = districtsOptions.value;
  if (type === "locality") object = localitiesOptions.value;

  return (
    object.find((s) => s.objectId === id)?.fullName ||
    "Не удалось определить имя"
  );
}

async function getFIASObjects(
  type: "districts" | "localities",
  subjectId?: number,
  districtId?: number,
) {
  localitiesOptions.value = [];
  setFieldValue("locality", undefined, false);
  setFieldValue("localityString", undefined, false);

  if (type === "districts" && subjectId) {
    districtsIsLoading.value = true;
    districtsOptions.value =
      (await optionsStore.fias("districts", subjectId)) || [];
    districtsIsLoading.value = false;
    setFieldValue("district", undefined, false);
    setFieldValue("districtString", undefined, false);
  }

  if (type === "localities" && subjectId && districtId) {
    localitiesIsLoading.value = true;
    localitiesOptions.value =
      (await optionsStore.fias("localities", subjectId, districtId)) || [];
    localitiesIsLoading.value = false;
  }
}
</script>

<style lang="css" scoped>
.p-inputtext.invalid,
:deep(.p-calendar.invalid) .p-inputtext,
.p-inputtext.invalid:enabled:focus,
:deep(.p-calendar.invalid) .p-inputtext:enabled:focus {
  outline: 0 none;
  box-shadow: 0 0 0 0.2rem theme("colors.danger-light");
  border-color: theme("colors.danger");
}
</style>
