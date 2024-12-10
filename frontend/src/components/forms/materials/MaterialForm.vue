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
        @reset.prevent="resetData(props.material)"
      >
        <div
          v-if="['create', 'update'].includes(mode)"
          class="tw-flex tw-flex-col tw-w-full tw-p-1"
        >
          <div class="field tw-flex tw-flex-col tw-w-full tw-mb-4">
            <div class="tw-flex tw-flex-row tw-items-center">
              <label
                for="Number"
                title="Номер"
                class="tw-max-w-[50%] tw-mr-4 tw-font-bold tw-text-base tw-overflow-x-hidden tw-text-ellipsis tw-whitespace-nowrap"
              >
                <span v-if="NumberMeta.required" class="asterisk tw-text-danger"
                  >*</span
                >
                Номер
              </label>

              <InputText
                id="Number"
                ref="firstFormField"
                v-model.trim="MaterialNumber"
                :title="MaterialNumber"
                input-id="Number"
                class="tw-flex tw-flex-auto tw-flex-col"
                :class="[
                  (NumberMeta.dirty || NumberMeta.touched) &&
                  !NumberMeta.valid &&
                  NumberMeta.validated
                    ? 'invalid'
                    : '',
                ]"
                placeholder="1-100 символов"
                @input="setFieldTouched('MaterialNumber', true)"
              />
            </div>

            <div
              v-if="
                (NumberMeta.dirty || NumberMeta.touched) &&
                !NumberMeta.valid &&
                NumberMeta.validated
              "
              class="tw-mt-2"
            >
              <span
                class="tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
              >
                <ExclamationTriangle class="tw-mr-2" />
                {{ errors.number }}
              </span>
            </div>
          </div>

          <div class="field tw-flex tw-flex-col tw-w-full tw-mb-4">
            <div class="tw-flex tw-flex-row tw-items-center">
              <label
                for="ActionDate"
                title="Дата"
                class="tw-max-w-[50%] tw-mr-4 tw-font-bold tw-text-base tw-overflow-x-hidden tw-text-ellipsis tw-whitespace-nowrap"
              >
                <span
                  v-if="ActionDateMeta.required"
                  class="asterisk tw-text-danger"
                  >*</span
                >
                Дата
              </label>

              <Calendar
                id="ActionDate"
                v-model="ActionDate"
                :title="ActionDate"
                input-id="ActionDate"
                date-format="dd.mm.yy"
                :max-date="new Date()"
                class="tw-flex tw-flex-auto tw-flex-col"
                input-class="tw-w-full"
                :class="[
                  (ActionDateMeta.dirty || ActionDateMeta.touched) &&
                  !ActionDateMeta.valid &&
                  ActionDateMeta.validated
                    ? 'invalid'
                    : '',
                ]"
                placeholder="дд.мм.гггг"
                show-icon
                icon-display="input"
                @date-selected="setFieldTouched('ActionDate', true)"
              >
                <template #inputicon="{ clickCallback }">
                  <CalendarTwotone
                    height="1.5em"
                    width="1.5em"
                    @click="clickCallback"
                  /> </template
              ></Calendar>
            </div>

            <div
              v-if="
                (ActionDateMeta.dirty || ActionDateMeta.touched) &&
                !ActionDateMeta.valid &&
                ActionDateMeta.validated
              "
              class="tw-mt-2"
            >
              <span
                class="tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
              >
                <ExclamationTriangle class="tw-mr-2" />
                {{ errors.actionDate }}
              </span>
            </div>
          </div>

          <template v-if="props.materialType === 'incoming'">
            <div class="field tw-flex tw-flex-col tw-w-full tw-mb-4">
              <div class="tw-flex tw-flex-row tw-items-center">
                <label
                  for="Control"
                  title="На контроле"
                  class="tw-max-w-[50%] tw-mr-4 tw-font-bold tw-text-base tw-overflow-x-hidden tw-text-ellipsis tw-whitespace-nowrap"
                >
                  <span
                    v-if="ControlMeta.required"
                    class="asterisk tw-text-danger"
                    >*</span
                  >
                  На контроле
                </label>

                <Calendar
                  id="Control"
                  v-model="Control"
                  :title="Control"
                  input-id="Control"
                  date-format="dd.mm.yy"
                  :max-date="new Date()"
                  class="tw-flex tw-flex-auto tw-flex-col"
                  input-class="tw-w-full"
                  :class="[
                    (ControlMeta.dirty || ControlMeta.touched) &&
                    !ControlMeta.valid &&
                    ControlMeta.validated
                      ? 'invalid'
                      : '',
                  ]"
                  placeholder="дд.мм.гггг"
                  show-icon
                  icon-display="input"
                  @date-selected="setFieldTouched('Control', true)"
                >
                  <template #inputicon="{ clickCallback }">
                    <CalendarTwotone
                      height="1.5em"
                      width="1.5em"
                      @click="clickCallback"
                    /> </template
                ></Calendar>
              </div>

              <div
                v-if="
                  (ControlMeta.dirty || ControlMeta.touched) &&
                  !ControlMeta.valid &&
                  ControlMeta.validated
                "
                class="tw-mt-2"
              >
                <span
                  class="tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
                >
                  <ExclamationTriangle class="tw-mr-2" />
                  {{ errors.control }}
                </span>
              </div>
            </div>

            <div class="field tw-flex tw-flex-col tw-w-full tw-mb-4">
              <div class="tw-flex tw-flex-row tw-items-center">
                <label
                  for="Fact"
                  title="Исполнено"
                  class="tw-max-w-[50%] tw-mr-4 tw-font-bold tw-text-base tw-overflow-x-hidden tw-text-ellipsis tw-whitespace-nowrap"
                >
                  <span v-if="FactMeta.required" class="asterisk tw-text-danger"
                    >*</span
                  >
                  Исполнено
                </label>

                <Calendar
                  id="Fact"
                  v-model="Fact"
                  :title="Fact"
                  input-id="Fact"
                  date-format="dd.mm.yy"
                  :max-date="new Date()"
                  class="tw-flex tw-flex-auto tw-flex-col"
                  input-class="tw-w-full"
                  :class="[
                    (FactMeta.dirty || FactMeta.touched) &&
                    !FactMeta.valid &&
                    FactMeta.validated
                      ? 'invalid'
                      : '',
                  ]"
                  placeholder="дд.мм.гггг"
                  show-icon
                  icon-display="input"
                  @date-selected="setFieldTouched('Fact', true)"
                >
                  <template #inputicon="{ clickCallback }">
                    <CalendarTwotone
                      height="1.5em"
                      width="1.5em"
                      @click="clickCallback"
                    /> </template
                ></Calendar>
              </div>

              <div
                v-if="
                  (FactMeta.dirty || FactMeta.touched) &&
                  !FactMeta.valid &&
                  FactMeta.validated
                "
                class="tw-mt-2"
              >
                <span
                  class="tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
                >
                  <ExclamationTriangle class="tw-mr-2" />
                  {{ errors.fact }}
                </span>
              </div>
            </div>
          </template>

          <div class="field tw-flex tw-flex-col tw-w-full tw-mb-4">
            <div class="tw-flex tw-flex-row tw-items-center">
              <label
                for="Info"
                title="Информация"
                class="tw-max-w-[50%] tw-mr-4 tw-font-bold tw-text-base tw-overflow-x-hidden tw-text-ellipsis tw-whitespace-nowrap"
              >
                <span v-if="InfoMeta.required" class="asterisk tw-text-danger"
                  >*</span
                >
                Информация
              </label>

              <Textarea
                id="Contact"
                v-model.trim="Info"
                rows="5"
                cols="30"
                :title="Info"
                input-id="Info"
                class="tw-flex tw-flex-auto tw-flex-col"
                :class="[
                  (InfoMeta.dirty || InfoMeta.touched) &&
                  !InfoMeta.valid &&
                  InfoMeta.validated
                    ? 'invalid'
                    : '',
                ]"
                placeholder="1-1000 символов"
                @input="setFieldTouched('Info', true)"
              />
            </div>

            <div
              v-if="
                (InfoMeta.dirty || InfoMeta.touched) &&
                !InfoMeta.valid &&
                InfoMeta.validated
              "
              class="tw-mt-2"
            >
              <span
                class="tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
              >
                <ExclamationTriangle class="tw-mr-2" />
                {{ errors.additionalInfo }}
              </span>
            </div>
          </div>

          <!-- <div class="field tw-flex tw-flex-col tw-w-full tw-mb-4">
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
                @change="setFieldTouched('subject', true)"
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
          </div> -->

          {{ NumberMeta }} <br /><br />
          {{ ActionDateMeta }} <br /><br />
          {{ ControlMeta }} <br /><br />
          {{ FactMeta }} <br /><br />
          {{ InfoMeta }} <br /><br />
          {{ meta }} <br /><br />
          {{ errors }}
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
          type="submit"
          form="formUser"
        >
          <!-- :disabled="!(meta.dirty && meta.valid)" -->
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
import Calendar from "primevue/calendar";
// import Dropdown from "primevue/dropdown";
import Textarea from "primevue/textarea";
import InputText from "primevue/inputtext";
import ScrollPanel from "primevue/scrollpanel";

import { useFocus } from "@vueuse/core";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";

import toast from "@/utils/toast";
import typeError from "@/utils/type-parse-error";
import useEmitter from "@/utils/emitter";

import { useAuthStore } from "@/stores/auth.store";
import { useUsersStore } from "@/stores/users.store";
import { useMaterialsStore } from "@/stores/materials.store";
// import { useOptionsStore } from "@/stores/options.store";

import type { TMaterial } from "@/typings/material.types";
import { ZMaterial } from "@/typings/material.types";

import FloppyDisk from "@/components/icons/FloppyDisk.vue";
import TimesCircle from "@/components/icons/TimesCircle.vue";
import EraserTwotone from "@/components/icons/EraserTwotone.vue";
import CalendarTwotone from "@/components/icons/CalendarTwotone.vue";
import ExclamationTriangle from "@/components/icons/ExclamationTriangle.vue";

const props = defineProps({
  material: {
    type: Object as PropType<TMaterial>,
    default: () => undefined,
    validator(value) {
      if (value !== undefined) {
        const parsed = ZMaterial.safeParse(value);
        if (parsed.success === false) {
          console.warn(parsed);
          typeError(parsed.error, "warn");
          // throw new TypeError(
          //   "Invalid prop: custom validator check failed for prop 'material'"
          // );
        }
      }
      return true;
    },
  },
  materialType: {
    type: String,
    required: true,
    validator(value: string) {
      return ["incoming", "outgoing"].includes(value);
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
  props.disabled ? "read" : props.material ? "update" : "create",
);

const authStore = useAuthStore();
const usersStore = useUsersStore();
// const optionsStore = useOptionsStore();
const materialsStore = useMaterialsStore();

const firstFormField = ref();

const { bus } = useEmitter();

// ? Если нужно будет запросить справочники
// const options: Ref<{ [key: string]: unknown[] }> = ref({})

// @ts-expect-error почему-то сломан zod
const validationSchema = computed(() => toTypedSchema(ZMaterial));

const {
  handleSubmit,
  errors,
  resetForm,
  meta,
  setFieldTouched,
  // setFieldValue,
} = useForm({
  validationSchema,
});

const onSubmit = handleSubmit(onSuccess, onInvalid);

// 👇 Поля формы
const { value: MaterialNumber, meta: NumberMeta } = useField<string>("number");
const { value: ActionDate, meta: ActionDateMeta } =
  useField<string>("actionDate");
const { value: Fact, meta: FactMeta } = useField<string>("fact");
const { value: Control, meta: ControlMeta } = useField<string>("control");
const { value: Info, meta: InfoMeta } = useField<string>("additionalInfo");
// const { value: Subject, meta: SubjectMeta } = useField<number>("subject");
// const { value: SubjectString } = useField<number>("subjectString");
// const { value: District, meta: DistrictMeta } = useField<number>("district");
// const { value: DistrictString } = useField<number>("districtString");
// const { value: Locality, meta: LocalityMeta } = useField<number>("locality");
// const { value: LocalityString } = useField<number>("localityString");

const emitEvent = defineEmits<{
  created: [response: { createdId: number; form: TMaterial }];
  updated: [response: { updatedId: number; form: TMaterial }];
}>();

async function onSuccess(institution: TMaterial) {
  const parsed = ZMaterial.safeParse(institution);
  if (parsed.success) {
    //   let query:
    //     | Promise<
    //         | { createdId: number; form: TMaterial }
    //         | { updatedId: number; form: TMaterial }
    //       >
    //     | undefined;
    //   if (mode.value === "create") {
    //     query = materialsStore.create(parsed.data);
    //   } else if (mode.value === "update") {
    //     query = materialsStore.update(parsed.data);
    //   }

    //   await query?.then(async (response) => {
    //     let message = `${props.materialType === "incoming" ? "Входящий" : "Исходящий"} создан`;

    //     if ("updatedId" in response) {
    //       message = "Пользователь обновлён";
    //       emitEvent("updated", response);
    //       usersStore.activity(
    //         "write",
    //         `Изменение материала ${response.updatedId}`,
    //       );
    //     } else if ("createdId" in response) {
    //       emitEvent("created", response);
    //       usersStore.activity(
    //         "write",
    //         `Добавление материала ${response.createdId}`,
    //       );
    //     }

    //     toast("Успех", message, "success");
    //     closeModal();
    //   });
    console.log(parsed.data);
    toast("Успех", `Материал «${parsed.data.number}» создано`, "success");
    closeModal();
  } else {
    toast("Ошибка!", "Ошибка приведения к типу 'Material'", "error");
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
  () => bus.value.get("openMaterialForm"),
  async () => {
    visible.value = true;

    const isNotEmpty = props.material;

    mode.value = props.disabled ? "read" : isNotEmpty ? "update" : "create";

    formHeader.value = props.disabled
      ? `Просмотр материала «${props.material?.number}»`
      : isNotEmpty
        ? `Редактирование материала «${props.material.number}»`
        : "Новый материал";

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

    if (props.material) {
      resetData(props.material);
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
function resetData(form?: TMaterial) {
  if (form) {
    resetForm({ values: form });
  } else {
    resetForm({
      values: {
        id: undefined,
        number: null,
        actionDate: null,
        creatorId: authStore.user?.UserId,
        departureTypeId: null,
        documentTypeId: null,
        institutionId: null,
        materialType: props.materialType === "incoming" ? 0 : 1,
        projectId: null,
        additionalInfo: null,
        fact: null,
        control: null,
      },
    });
  }
}

const closeModal = () => {
  resetData();
  visible.value = false;
};

// const subjectsOptions: Ref<TFIASObjects> = ref([]);
// const districtsOptions: Ref<TFIASObjects> = ref([]);
// const localitiesOptions: Ref<TFIASObjects> = ref([]);

// const subjectsIsLoading: Ref<boolean> = ref(false);
// const districtsIsLoading: Ref<boolean> = ref(false);
// const localitiesIsLoading: Ref<boolean> = ref(false);

async function showDialog() {}
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
