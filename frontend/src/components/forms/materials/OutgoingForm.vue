<template>
  <Dialog
    v-model:visible="visible"
    :header="formHeader"
    :style="{
      width: '50vw',
      height: ['create', 'update', 'copy'].includes(mode)
        ? folder
          ? '30vh'
          : '80vh'
        : '80vh',
    }"
    :modal="true"
  >
    <FormPreloader :number-of-fields="folder ? 1 : 6" />

    <ScrollPanel v-show="!useLoadingStore().loadingState" class="tw-w-full">
      <form
        id="templateForm"
        autocomplete="off"
        @submit="onSubmit"
        @reset="resetData(props.template)"
      >
        <div
          v-if="['create', 'update', 'copy'].includes(mode)"
          class="equal-split tw-flex tw-flex-col tw-w-full tw-p-1"
        >
          <div class="field tw-flex tw-flex-col tw-w-full tw-mb-4">
            <div class="tw-flex tw-flex-row tw-items-center">
              <label
                for="Templatename"
                :title="folder ? 'Имя каталога' : 'Заголовок'"
                class="tw-max-w-[50%] tw-mr-4 tw-font-bold tw-text-base tw-overflow-x-hidden tw-text-ellipsis tw-whitespace-nowrap"
              >
                <span
                  v-if="TemplatenameMeta.required"
                  class="asterisk tw-text-danger"
                  >*</span
                >
                {{ folder ? "Имя каталога" : "Заголовок шаблона" }}
              </label>
              <InputText
                ref="firstFormField"
                v-model.trim="Templatename"
                :title="Templatename"
                input-id="Templatename"
                class="tw-flex tw-flex-auto tw-flex-col"
                placeholder="3-1000 символов"
                :class="[
                  (TemplatenameMeta.dirty || TemplatenameMeta.touched) &&
                  !TemplatenameMeta.valid &&
                  TemplatenameMeta.validated
                    ? 'invalid'
                    : '',
                ]"
                @focus="setFieldTouched('Templatename', true)"
              />
            </div>

            <div
              v-if="
                (TemplatenameMeta.dirty || TemplatenameMeta.touched) &&
                !TemplatenameMeta.valid &&
                TemplatenameMeta.validated
              "
              class="tw-mt-2"
            >
              <span
                class="tw-justify-end tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
              >
                <font-awesome-icon
                  :icon="['fas', 'fa-exclamation-triangle']"
                  fixed-width
                  aria-hidden="true"
                  class="tw-mr-2"
                />
                {{ errors.Templatename }}
              </span>
            </div>
          </div>

          <template v-if="!folder">
            <div class="tw-flex tw-flex-col tw-w-full tw-mb-4">
              <!-- <div class="tw-flex tw-flex-row tw-items-center"> -->
              <label
                for=""
                title="Документ-основание"
                class="tw-max-w-[50%] tw-my-4 tw-font-bold tw-text-base tw-text-ellipsis tw-whitespace-nowrap"
              >
                <!-- <span v-if="" class="asterisk tw-text-danger"
                    >*</span
                  > -->
                Документ-основание
              </label>
              <!-- tw-w-2/3 -->
              <div class="p-inputgroup tw-w-full">
                <InputText
                  v-model.trim="DocumentName"
                  :title="DocumentName"
                  input-id="DocumentName"
                  placeholder="Наименование"
                  :class="[
                    (DocumentNameMeta.dirty || DocumentNameMeta.touched) &&
                    !DocumentNameMeta.valid &&
                    DocumentNameMeta.validated
                      ? 'invalid'
                      : '',
                  ]"
                  class="!tw-w-6/12"
                  @input="setFieldTouched('DocumentName', true)"
                />
                <InputText
                  v-model.trim="DocumentNumber"
                  :title="DocumentNumber"
                  input-id="DocumentNumber"
                  placeholder="Номер"
                  class="!tw-w-3/12"
                  :class="[
                    (DocumentNumberMeta.dirty || DocumentNumberMeta.touched) &&
                    !DocumentNumberMeta.valid &&
                    DocumentNumberMeta.validated
                      ? 'invalid'
                      : '',
                  ]"
                  @input="setFieldTouched('DocumentNumber', true)"
                />
                <Calendar
                  v-model.trim="DocumentDate"
                  :title="DocumentDate"
                  input-id="DocumentDate"
                  placeholder="Дата (дд.мм.гггг)"
                  class="!tw-w-3/12"
                  date-format="dd.mm.yy"
                  :class="[
                    (DocumentDateMeta.dirty || DocumentDateMeta.touched) &&
                    !DocumentDateMeta.valid &&
                    DocumentDateMeta.validated
                      ? 'invalid'
                      : '',
                  ]"
                  @input="setFieldTouched('DocumentDate', true)"
                  @date-select="setFieldTouched('DocumentDate', true)"
                />
              </div>
              <!-- </div> -->
              <div
                v-if="
                  ((DocumentNameMeta.dirty || DocumentNameMeta.touched) &&
                    !DocumentNameMeta.valid &&
                    DocumentNameMeta.validated) ||
                  ((DocumentNumberMeta.dirty || DocumentNumberMeta.touched) &&
                    !DocumentNumberMeta.valid &&
                    DocumentNumberMeta.validated) ||
                  ((DocumentDateMeta.dirty || DocumentDateMeta.touched) &&
                    !DocumentDateMeta.valid &&
                    DocumentDateMeta.validated)
                "
                class="tw-mt-2"
              >
                <span
                  v-for="error of Object.keys(errors)
                    .map((s) =>
                      [
                        'DocumentName',
                        'DocumentNumber',
                        'DocumentDate',
                      ].includes(s)
                        ? s
                        : undefined,
                    )
                    .filter((s) => !!s)"
                  :key="error"
                  class="tw-justify-end tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
                >
                  <font-awesome-icon
                    :icon="['fas', 'fa-exclamation-triangle']"
                    fixed-width
                    aria-hidden="true"
                    class="tw-mr-2"
                  />
                  {{ errors[error] }}
                </span>
              </div>
            </div>

            <div class="field tw-flex tw-flex-col tw-w-full tw-mb-4">
              <div class="tw-flex tw-flex-row tw-items-center">
                <label
                  for=""
                  title="Тип"
                  class="tw-max-w-[50%] tw-mr-4 tw-font-bold tw-text-base tw-text-ellipsis tw-whitespace-nowrap"
                >
                  <span
                    v-if="TemplateTypeMeta.required"
                    class="asterisk tw-text-danger"
                    >*</span
                  >
                  Тип
                </label>
                <Dropdown
                  id="TemplateType"
                  v-model="TemplateType"
                  class="tw-flex tw-flex-auto tw-w-4"
                  :class="[
                    (TemplateTypeMeta.dirty || TemplateTypeMeta.touched) &&
                    !TemplateTypeMeta.valid &&
                    TemplateTypeMeta.validated
                      ? 'invalid'
                      : '',
                  ]"
                  :filter="options.templatestatus?.length > 20"
                  :options="options.templatestatus"
                  :virtual-scroller-options="
                    options.templatestatus?.length > 50
                      ? { itemSize: 35 }
                      : undefined
                  "
                  option-value="Id"
                  option-label="Name"
                  placeholder="Выберите тип"
                  @change="setFieldTouched('TemplateType', true)"
                >
                </Dropdown>
              </div>
              <div
                v-if="
                  (TemplateTypeMeta.dirty || TemplateTypeMeta.touched) &&
                  !TemplateTypeMeta.valid &&
                  TemplateTypeMeta.validated
                "
                class="tw-mt-2"
              >
                <span
                  class="tw-justify-end tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
                >
                  <font-awesome-icon
                    :icon="['fas', 'fa-exclamation-triangle']"
                    fixed-width
                    aria-hidden="true"
                    class="tw-mr-2"
                  />
                  {{ errors.TemplateTypeId }}
                </span>
              </div>
            </div>

            <div class="field tw-flex tw-flex-col tw-w-full tw-mb-4">
              <div class="tw-flex tw-flex-row tw-items-center">
                <label
                  for="Responsible"
                  title="Исполнитель"
                  class="tw-max-w-[50%] tw-mr-4 tw-font-bold tw-text-base tw-text-ellipsis tw-whitespace-nowrap"
                >
                  <span
                    v-if="ResponsibleMeta.required"
                    class="asterisk tw-text-danger"
                    >*</span
                  >
                  Исполнитель
                </label>

                <div class="p-inputgroup tw-w-1/2">
                  <Dropdown
                    id="Responsible"
                    v-model="Responsible"
                    class="tw-flex tw-flex-auto tw-w-4"
                    :class="[
                      (ResponsibleMeta.dirty || ResponsibleMeta.touched) &&
                      !ResponsibleMeta.valid &&
                      ResponsibleMeta.validated
                        ? 'invalid'
                        : '',
                    ]"
                    :filter="options.users?.length > 20"
                    :options="options.users"
                    :show-clear="!ResponsibleMeta.required"
                    :virtual-scroller-options="
                      options.users?.length > 50 ? { itemSize: 35 } : undefined
                    "
                    option-value="Id"
                    placeholder="Выберите исполнителя"
                    filter-by="Dol,Fam,Nam,Name,Telephone"
                    @change="setFieldTouched('TemplateResponsibleId', true)"
                  >
                    <template #value="slotProps">
                      <div
                        v-if="slotProps.value"
                        class="flex align-items-center"
                      >
                        <div class="tw-overflow-x-hidden tw-text-ellipsis">
                          {{
                            fioParse(
                              (
                                options.users.find(
                                  (u: TUserBase) => u.Id === slotProps.value,
                                ) as TUserBase
                              ).Fio,
                              {
                                f: { enabled: true, short: false },
                                i: { enabled: true, short: true },
                                o: { enabled: true, short: true },
                              },
                            )
                          }}
                          <!--, {{
                            (
                              options.users.find(
                                (u: TUserBase) => u.Id === slotProps.value,
                              ) as TUserBase
                            ).Dol
                          }}
                          «{{
                            (
                              options.users.find(
                                (u: TUserBase) => u.Id === slotProps.value,
                              ) as TUserBase
                            ).Unit
                          }}» -->
                        </div>
                      </div>
                      <span v-else>{{ slotProps.placeholder }}</span>
                    </template>
                    <template #option="slotProps">
                      <div class="flex align-items-center">
                        <div>
                          {{
                            fioParse(slotProps.option.Fio, {
                              f: { enabled: true, short: false },
                              i: { enabled: true, short: true },
                              o: { enabled: true, short: true },
                            })
                          }}
                          <!-- , {{ slotProps.option.Dol ?? '' }}
                          {{ slotProps.option.Unit ? `«${slotProps.option.Unit}»` : '' }} -->
                        </div>
                      </div>
                    </template>
                  </Dropdown>

                  <Button
                    icon-pos="left"
                    class="primary tw-mr-2 p-button-icon-only"
                    title="Добавить нового исполнителя в систему"
                    @click="emit('openAdminUserForm')"
                  >
                    <PlusUserTwotone
                      height="1.25rem"
                      width="1.25rem"
                      stroke-width="2"
                    />
                  </Button>
                </div>
              </div>
              <div
                v-if="
                  (ResponsibleMeta.dirty || ResponsibleMeta.touched) &&
                  !ResponsibleMeta.valid &&
                  ResponsibleMeta.validated
                "
                class="tw-mt-2"
              >
                <span
                  class="tw-justify-end tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
                >
                  <font-awesome-icon
                    :icon="['fas', 'fa-exclamation-triangle']"
                    fixed-width
                    aria-hidden="true"
                    class="tw-mr-2"
                  />
                  {{ errors.ResponsibleId }}
                </span>
              </div>
            </div>

            <div class="field tw-flex tw-flex-col tw-w-full tw-mb-4">
              <div class="tw-flex tw-flex-row tw-items-center">
                <label
                  for="Initiator"
                  title="Инициатор"
                  class="tw-max-w-[50%] tw-mr-4 tw-font-bold tw-text-base tw-text-ellipsis tw-whitespace-nowrap"
                >
                  <span
                    v-if="InitiatorMeta.required"
                    class="asterisk tw-text-danger"
                    >*</span
                  >
                  Инициатор
                </label>
                <Dropdown
                  id="Initiator"
                  v-model="Initiator"
                  class="tw-flex tw-flex-auto tw-w-4"
                  :class="[
                    (InitiatorMeta.dirty || InitiatorMeta.touched) &&
                    !InitiatorMeta.valid &&
                    InitiatorMeta.validated
                      ? 'invalid'
                      : '',
                  ]"
                  :filter="options.templateinitiator?.length > 20"
                  :options="options.templateinitiator"
                  :show-clear="!InitiatorMeta.required"
                  :virtual-scroller-options="
                    options.templateinitiator?.length > 50
                      ? { itemSize: 35 }
                      : undefined
                  "
                  option-value="Id"
                  option-label="Name"
                  placeholder="Выберите инициатора"
                  filter-by="Name,Description"
                  @change="setFieldTouched('TemplateInitiatorId', true)"
                >
                  <!-- setTouchToField($event, 'TemplateInitiatorId') -->
                  <!-- <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex align-items-center">
                      <div class="tw-overflow-x-hidden tw-text-ellipsis">
                        {{
                          fioParse(
                            (
                              options.users.find(
                                (u: TUserBase) => u.Id === slotProps.value,
                              ) as TUserBase
                            ).Fio,
                            {
                              f: { enabled: true, short: false },
                              i: { enabled: true, short: true },
                              o: { enabled: true, short: true },
                            },
                          )
                        }},
                        {{
                          (
                            options.users.find(
                              (u: TUserBase) => u.Id === slotProps.value,
                            ) as TUserBase
                          ).Dol
                        }}
                        «{{
                          (
                            options.users.find(
                              (u: TUserBase) => u.Id === slotProps.value,
                            ) as TUserBase
                          ).Unit
                        }}»
                      </div>
                    </div>
                    <span v-else>{{ slotProps.placeholder }}</span>
                  </template>
                  <template #option="slotProps">
                    <div class="flex align-items-center">
                      <div>
                        {{
                          fioParse(slotProps.option.Fio, {
                            f: { enabled: true, short: false },
                            i: { enabled: true, short: true },
                            o: { enabled: true, short: true },
                          })
                        }}, {{ slotProps.option.Dol }} «{{ slotProps.option.Unit }}»
                      </div>
                    </div>
                  </template> -->
                </Dropdown>
              </div>
              <div
                v-if="
                  (InitiatorMeta.dirty || InitiatorMeta.touched) &&
                  !InitiatorMeta.valid &&
                  InitiatorMeta.validated
                "
                class="tw-mt-2"
              >
                <span
                  class="tw-justify-end tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
                >
                  <font-awesome-icon
                    :icon="['fas', 'fa-exclamation-triangle']"
                    fixed-width
                    aria-hidden="true"
                    class="tw-mr-2"
                  />
                  {{ errors.TemplateInitiatorId }}
                </span>
              </div>
            </div>

            <div class="field tw-flex tw-flex-col tw-w-full tw-mb-4">
              <div class="tw-flex tw-flex-row tw-items-center">
                <label
                  for="Category"
                  title="Категория"
                  class="tw-max-w-[50%] tw-mr-4 tw-font-bold tw-text-base tw-text-ellipsis tw-whitespace-nowrap"
                >
                  <span
                    v-if="CategoryMeta.required"
                    class="asterisk tw-text-danger"
                    >*</span
                  >
                  Категория
                </label>
                <Dropdown
                  id="Category"
                  v-model="Category"
                  class="tw-flex tw-flex-auto tw-w-4"
                  :class="[
                    (CategoryMeta.dirty || CategoryMeta.touched) &&
                    !CategoryMeta.valid &&
                    CategoryMeta.validated
                      ? 'invalid'
                      : '',
                  ]"
                  :filter="options.templatecategory?.length > 20"
                  :options="options.templatecategory"
                  :show-clear="!CategoryMeta.required"
                  :virtual-scroller-options="
                    options.templatecategory?.length > 50
                      ? { itemSize: 35 }
                      : undefined
                  "
                  option-value="Id"
                  option-label="Name"
                  placeholder="Выберите категорию"
                  filter-by="Name,Description"
                  @change="setFieldTouched('TemplateCategoryId', true)"
                >
                  <!-- setTouchToField($event, 'TemplateInitiatorId') -->
                  <!-- <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex align-items-center">
                      <div class="tw-overflow-x-hidden tw-text-ellipsis">
                        {{
                          fioParse(
                            (
                              options.users.find(
                                (u: TUserBase) => u.Id === slotProps.value,
                              ) as TUserBase
                            ).Fio,
                            {
                              f: { enabled: true, short: false },
                              i: { enabled: true, short: true },
                              o: { enabled: true, short: true },
                            },
                          )
                        }},
                        {{
                          (
                            options.users.find(
                              (u: TUserBase) => u.Id === slotProps.value,
                            ) as TUserBase
                          ).Dol
                        }}
                        «{{
                          (
                            options.users.find(
                              (u: TUserBase) => u.Id === slotProps.value,
                            ) as TUserBase
                          ).Unit
                        }}»
                      </div>
                    </div>
                    <span v-else>{{ slotProps.placeholder }}</span>
                  </template>
                  <template #option="slotProps">
                    <div class="flex align-items-center">
                      <div>
                        {{
                          fioParse(slotProps.option.Fio, {
                            f: { enabled: true, short: false },
                            i: { enabled: true, short: true },
                            o: { enabled: true, short: true },
                          })
                        }}, {{ slotProps.option.Dol }} «{{ slotProps.option.Unit }}»
                      </div>
                    </div>
                  </template> -->
                </Dropdown>
              </div>
              <div
                v-if="
                  (CategoryMeta.dirty || CategoryMeta.touched) &&
                  !CategoryMeta.valid &&
                  CategoryMeta.validated
                "
                class="tw-mt-2"
              >
                <span
                  class="tw-justify-end tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
                >
                  <font-awesome-icon
                    :icon="['fas', 'fa-exclamation-triangle']"
                    fixed-width
                    aria-hidden="true"
                    class="tw-mr-2"
                  />
                  {{ errors.TemplateCategoryId }}
                </span>
              </div>
            </div>

            <div class="field tw-flex tw-flex-col tw-w-full tw-mb-4">
              <div class="tw-flex tw-flex-row tw-items-center">
                <label
                  for="ReportingDate"
                  title="Срок сдачи отчёта"
                  class="tw-max-w-[50%] tw-mr-4 tw-font-bold tw-text-base tw-text-ellipsis tw-whitespace-nowrap"
                >
                  <span
                    v-if="ReportingDateMeta.required"
                    class="asterisk tw-text-danger"
                    >*</span
                  >
                  Срок сдачи отчёта
                </label>

                <Calendar
                  v-model.trim="ReportingDate"
                  :title="ReportingDate"
                  input-id="ReportingDate"
                  placeholder="Дата (дд.мм.гггг)"
                  date-format="dd.mm.yy"
                  :class="[
                    (ReportingDateMeta.dirty || ReportingDateMeta.touched) &&
                    !ReportingDateMeta.valid &&
                    ReportingDateMeta.validated
                      ? 'invalid'
                      : '',
                  ]"
                  :disabled-days="[0, 6]"
                  @input="setFieldTouched('ReportingDate', true)"
                  @date-select="setFieldTouched('ReportingDate', true)"
                />
              </div>
              <div
                v-if="
                  (ReportingDateMeta.dirty || ReportingDateMeta.touched) &&
                  !ReportingDateMeta.valid &&
                  ReportingDateMeta.validated
                "
                class="tw-mt-2"
              >
                <span
                  class="tw-justify-end tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
                >
                  <font-awesome-icon
                    :icon="['fas', 'fa-exclamation-triangle']"
                    fixed-width
                    aria-hidden="true"
                    class="tw-mr-2"
                  />
                  {{ errors.ReportingDate }}
                </span>
              </div>
            </div>

            <div class="field tw-flex tw-flex-col tw-w-full tw-mb-4">
              <div class="tw-flex tw-flex-row tw-items-center">
                <label
                  for="PublicationDate"
                  title="Дата публикации шаблона"
                  class="tw-max-w-[50%] tw-mr-4 tw-font-bold tw-text-base tw-text-ellipsis tw-whitespace-nowrap"
                >
                  <span
                    v-if="PublicationDateMeta.required"
                    class="asterisk tw-text-danger"
                    >*</span
                  >
                  Дата публикации шаблона
                </label>

                <Calendar
                  v-model.trim="PublicationDate"
                  :title="PublicationDate"
                  input-id="PublicationDate"
                  placeholder="Дата (дд.мм.гггг)"
                  date-format="dd.mm.yy"
                  :class="[
                    (PublicationDateMeta.dirty ||
                      PublicationDateMeta.touched) &&
                    !PublicationDateMeta.valid &&
                    PublicationDateMeta.validated
                      ? 'invalid'
                      : '',
                  ]"
                  :disabled-days="[0, 6]"
                  @input="setFieldTouched('PublicationDate', true)"
                  @date-select="setFieldTouched('PublicationDate', true)"
                />
              </div>
              <div
                v-if="
                  (PublicationDateMeta.dirty || PublicationDateMeta.touched) &&
                  !PublicationDateMeta.valid &&
                  PublicationDateMeta.validated
                "
                class="tw-mt-2"
              >
                <span
                  class="tw-justify-end tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
                >
                  <font-awesome-icon
                    :icon="['fas', 'fa-exclamation-triangle']"
                    fixed-width
                    aria-hidden="true"
                    class="tw-mr-2"
                  />
                  {{ errors.PublicationDate }}
                </span>
              </div>
            </div>

            <div class="tw-flex tw-flex-col tw-w-full tw-mb-4">
              <label
                title="Расписание"
                class="tw-max-w-[50%] tw-mr-4 tw-mb-4 tw-font-bold tw-text-base tw-text-ellipsis tw-whitespace-nowrap tw-self-start"
              >
                <!-- <span v-if="ScheduleMeta.required" class="asterisk tw-text-danger">*</span> -->
                Расписание
              </label>
              <div
                v-for="(item, index) of Schedule"
                :key="index"
                class="tw-flex tw-flex-row tw-items-start tw-justify-between tw-mb-2 last:tw-mb-0"
              >
                <div class="tw-flex tw-flex-row tw-items-start tw-mr-4">
                  <div class="tw-flex tw-flex-col">
                    <Dropdown
                      v-model="(item.value as TScheduleItem).PeriodTypeId"
                      class="tw-flex tw-w-72"
                      :filter="options.periodTypes?.length > 20"
                      :options="options.periodTypes"
                      :virtual-scroller-options="
                        options.periodTypes?.length > 50
                          ? { itemSize: 35 }
                          : undefined
                      "
                      :class="[
                        errors[`ReportingSchedule[${index}].PeriodTypeId`]
                          ? 'invalid'
                          : '',
                      ]"
                      option-value="Id"
                      option-label="Name"
                      placeholder="Выберите период"
                      filter-by="Name"
                      @change="
                        clearPeriodDates(
                          index,
                          (item.value as TScheduleItem).PeriodTypeId,
                        )
                      "
                    ></Dropdown>
                    <div
                      v-if="errors[`ReportingSchedule[${index}].PeriodTypeId`]"
                      class="tw-mt-2"
                    >
                      <span
                        class="tw-justify-end tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
                      >
                        <font-awesome-icon
                          :icon="['fas', 'fa-exclamation-triangle']"
                          fixed-width
                          aria-hidden="true"
                          class="tw-mr-2"
                        />
                        {{ errors[`ReportingSchedule[${index}].PeriodTypeId`] }}
                      </span>
                    </div>
                  </div>
                  <div class="tw-flex tw-flex-col tw-ml-4">
                    <Calendar
                      v-if="[3, 7].includes(item.value.PeriodTypeId)"
                      v-model="item.value.Dates as Date[]"
                      date-format="dd.mm.yy"
                      selection-mode="multiple"
                      :max-date-count="item.value.PeriodTypeId === 7 ? null : 1"
                      placeholder="По датам"
                      class="tw-w-96"
                      :class="[
                        errors[`ReportingSchedule[${index}].Dates`]
                          ? 'invalid'
                          : '',
                      ]"
                      :manual-input="false"
                      :title="
                        item.value['Dates']
                          .map((t: Date | string) =>
                            luxon.fromJSDate(t as Date).toFormat('dd.MM.yyyy'),
                          )
                          .join(', ')
                      "
                      :disabled-days="[0, 6]"
                      @date-select="setFieldTouched('ReportingSchedule', true)"
                    />
                    <div
                      v-if="errors[`ReportingSchedule[${index}].Dates`]"
                      class="tw-mt-2"
                    >
                      <span
                        class="tw-justify-end tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
                      >
                        <font-awesome-icon
                          :icon="['fas', 'fa-exclamation-triangle']"
                          fixed-width
                          aria-hidden="true"
                          class="tw-mr-2"
                        />
                        {{ errors[`ReportingSchedule[${index}].Dates`] }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="controls tw-flex tw-flex-row">
                  <Button
                    v-if="Schedule.length !== 1"
                    icon-pos="left"
                    class="danger tw-mr-2 p-button-icon-only"
                    title="Удалить расписание"
                    @click="removeScheduleItem(index)"
                  >
                    <ScheduleRemoveIcon height="1.5rem" width="1.5rem" />
                  </Button>
                  <Button
                    v-if="Schedule.length === index + 1"
                    icon-pos="left"
                    class="primary tw-mr-2 p-button-icon-only"
                    title="Добавить расписание"
                    @click="addScheduleItem"
                  >
                    <ScheduleAddIcon height="1.5rem" width="1.5rem" />
                  </Button>
                </div>
              </div>
            </div>

            <div class="tw-flex tw-flex-col tw-w-full tw-mb-4">
              <label
                title="Адресаты"
                class="tw-max-w-[50%] tw-mr-4 tw-mb-4 tw-font-bold tw-text-base tw-text-ellipsis tw-whitespace-nowrap tw-self-start"
              >
                <!-- <span v-if="ScheduleMeta.required" class="asterisk tw-text-danger">*</span> -->
                Адресаты
              </label>

              <MultiSelect
                v-model="selectedRecipients"
                :options="options.assignments"
                option-label="Label"
                option-group-label="Label"
                option-group-children="Items"
                display="chip"
                placeholder="Выберите адресаты"
                panel-class="sticky-group-headers"
                :show-toggle-all="false"
                @change="updateRecipientsList"
              >
                <template #optiongroup="slotProps">
                  <div class="tw-flex tw-items-center">
                    <div>{{ slotProps.option.Label }}</div>
                  </div>
                </template>
              </MultiSelect>

              <div class="tw-grid tw-grid-cols-2 tw-gap-4">
                <div
                  v-for="groupId in Array.from(
                    new Set(selectedRecipients?.map((a) => a.CatalogueValue)),
                  )"
                  :key="groupId"
                  class="group"
                >
                  <div
                    class="group-name tw-mt-4 tw-mb-4 last:tw-mb-0 tw-text-gray-500 tw-font-semibold tw-text-base"
                  >
                    {{ getGroupName(groupId) }}:
                  </div>

                  <div
                    v-for="(item, index) in selectedRecipients
                      .filter((i) => i.CatalogueValue === groupId)
                      .sort((a, b) =>
                        (a.Label as string).localeCompare(b.Label),
                      )"
                    :key="index"
                    class="group-item tw-flex tw-flex-row tw-mb-2 last:tw-mb-0 tw-items-center"
                  >
                    <!-- {{ getRecipientForm(item.CatalogueValue, item.Value) }} -->
                    <Calendar
                      v-if="getRecipientForm(item.CatalogueValue, item.Value)"
                      v-model.trim="
                        getRecipientForm(item.CatalogueValue, item.Value)
                          .Period as Date[]
                      "
                      :input-id="`Period-${index}`"
                      placeholder="Выберите период"
                      date-format="dd.mm.yy"
                      selection-mode="range"
                      class="tw-mr-4 tw-w-64 tw-min-w-64"
                      :manual-input="false"
                      @date-select="setFieldTouched('Assignments', true)"
                    />
                    <div
                      class="item-name tw-text-gray-500 tw-font-semibold tw-text-base tw-line-clamp-2 tw-text-ellipsis tw-max-w-min tw-whitespace-pre-wrap"
                      :title="item.Label"
                    >
                      {{ item.Label }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="field tw-flex tw-flex-col tw-w-full tw-mb-4">
              <label
                for="Instructions"
                title="Инструкция по заполнению"
                class="tw-max-w-[50%] tw-mr-4 tw-mb-4 tw-font-bold tw-text-base tw-text-ellipsis tw-whitespace-nowrap tw-self-start"
              >
                <span
                  v-if="InstructionsMeta.required"
                  class="asterisk tw-text-danger"
                  >*</span
                >
                Инструкция по заполнению
              </label>
              <Textarea
                id="Instructions"
                v-model.trim="Instructions"
                rows="10"
                cols="30"
                placeholder="Текст инструкции"
                :class="[
                  (InstructionsMeta.dirty || InstructionsMeta.touched) &&
                  !InstructionsMeta.valid &&
                  InstructionsMeta.validated
                    ? 'invalid'
                    : '',
                ]"
                @input="setFieldTouched('Instructions', true)"
              />
              <div
                v-if="
                  (InstructionsMeta.dirty || InstructionsMeta.touched) &&
                  !InstructionsMeta.valid &&
                  InstructionsMeta.validated
                "
                class="tw-mt-2"
              >
                <span
                  class="tw-justify-end tw-font-medium tw-text-danger tw-text-xs tw-flex tw-flex-row tw-items-center tw-mb-2 last:tw-mb-0"
                >
                  <font-awesome-icon
                    :icon="['fas', 'fa-exclamation-triangle']"
                    fixed-width
                    aria-hidden="true"
                    class="tw-mr-2"
                  />
                  {{ errors.Instructions }}
                </span>
              </div>
            </div>

            <div class="tw-flex tw-flex-row tw-w-full">
              <div class="tw-flex tw-flex-col tw-w-1/2">
                <template
                  v-if="props.template && props.template.Attachments.length"
                >
                  <div class="tw-text-gray-500 tw-font-semibold tw-mb-2">
                    Прикреплённые инструкции
                  </div>

                  <div
                    v-for="(attachment, index) of Attachments.filter(
                      (a) => a.AttachmentType === 1,
                    )"
                    :key="index"
                    :title="attachment.Name"
                    class="attachment-file tw-text-gray-400 tw-font-semibold tw-whitespace-nowrap tw-overflow-x-hidden tw-text-ellipsis tw-flex tw-flex-row tw-items-center"
                  >
                    <div
                      class="tw-max-w-64 tw-w-64 tw-overflow-x-hidden tw-text-ellipsis hover:tw-cursor-pointer"
                      @click="
                        downloadAttachment(
                          attachment.Id,
                          attachment.WrTemplateId,
                        )
                      "
                    >
                      {{ index + 1 }}. {{ attachment.Name }}
                    </div>
                    <DeleteDocumentTwotone
                      v-if="attachment.Id"
                      height="1.25rem"
                      width="1.25rem"
                      class="tw-text-red-600 tw-ml-2 hover:tw-cursor-pointer"
                      @click="removeAttachment(attachment.Id)"
                    />
                    <FileUploadTwotoneLoop
                      v-else
                      height="1.25rem"
                      width="1.25rem"
                      class="tw-text-sky-500 tw-ml-2"
                    />
                  </div>
                </template>

                <div
                  v-if="instructionsFiles?.length"
                  class="instructions-files tw-flex tw-flex-col tw-mb-4"
                  :class="[
                    props.template && props.template.Attachments.length
                      ? 'tw-mt-4'
                      : '',
                  ]"
                >
                  <div class="tw-text-gray-500 tw-font-semibold tw-mb-2">
                    К загрузке
                  </div>
                  <div
                    v-for="(instruction, index) of instructionsFiles"
                    :key="index"
                    :title="instruction.name"
                    class="instruction-file tw-text-gray-400 tw-font-semibold tw-whitespace-nowrap tw-overflow-x-hidden tw-text-ellipsis"
                  >
                    {{ index + 1 }}. {{ instruction.name }}
                  </div>
                </div>
                <div
                  class="tw-flex tw-flex-row"
                  :class="[
                    props.template && !!!instructionsFiles?.length
                      ? 'tw-mt-4'
                      : '',
                  ]"
                >
                  <Button
                    icon-pos="left"
                    class="primary tw-mr-4 tw-w-1/2"
                    @click="instructionsClicked()"
                  >
                    <font-awesome-icon
                      :icon="[
                        'fas',
                        `${mode === 'create' ? 'fa-check' : 'fa-floppy-disk'}`,
                      ]"
                      :class="['p-button-icon p-button-icon-left']"
                    ></font-awesome-icon>
                    Файл инструкции
                  </Button>
                  <Button
                    v-if="instructionsFiles && instructionsFiles.length"
                    icon-pos="left"
                    class="neutral tw-w-1/2"
                    @click="instructionsReset()"
                  >
                    <font-awesome-icon
                      :icon="[
                        'fas',
                        `${mode === 'create' ? 'fa-check' : 'fa-floppy-disk'}`,
                      ]"
                      :class="['p-button-icon p-button-icon-left']"
                    ></font-awesome-icon>
                    Отменить выбор
                  </Button>
                </div>
              </div>
              <div class="tw-flex tw-flex-col tw-w-1/2 tw-ml-4">
                <template
                  v-if="props.template && props.template.Attachments.length"
                >
                  <div class="tw-text-gray-500 tw-font-semibold tw-mb-2">
                    Прикреплённые вложения
                  </div>

                  <div
                    v-for="(attachment, index) of Attachments.filter(
                      (a) => a.AttachmentType === 0,
                    )"
                    :key="index"
                    :title="attachment.Name"
                    class="attachment-file tw-text-gray-400 tw-font-semibold tw-whitespace-nowrap tw-overflow-x-hidden tw-text-ellipsis tw-flex tw-flex-row tw-items-center"
                  >
                    <div
                      class="tw-max-w-64 tw-w-64 tw-overflow-x-hidden tw-text-ellipsis hover:tw-cursor-pointer"
                      @click="
                        downloadAttachment(
                          attachment.Id,
                          attachment.WrTemplateId,
                        )
                      "
                    >
                      {{ index + 1 }}. {{ attachment.Name }}
                    </div>
                    <DeleteDocumentTwotone
                      v-if="attachment.Id"
                      height="1.25rem"
                      width="1.25rem"
                      class="tw-text-red-600 tw-ml-2 hover:tw-cursor-pointer"
                      @click="removeAttachment(attachment.Id)"
                    />
                    <FileUploadTwotoneLoop
                      v-else
                      height="1.25rem"
                      width="1.2s5rem"
                      class="tw-text-sky-500 tw-ml-2"
                    />
                  </div>
                </template>

                <div
                  v-if="attachmentsFiles?.length"
                  :class="[
                    props.template && props.template.Attachments.length
                      ? 'tw-mt-4'
                      : '',
                  ]"
                  class="attachments-files tw-flex tw-flex-col tw-mb-4"
                >
                  <div class="tw-text-gray-500 tw-font-semibold tw-mb-2">
                    К загрузке
                  </div>
                  <div
                    v-for="(attachment, index) of attachmentsFiles"
                    :key="index"
                    :title="attachment.name"
                    class="attachment-file tw-max-w-64 tw-w-64 tw-text-gray-400 tw-font-semibold tw-whitespace-nowrap tw-overflow-x-hidden tw-text-ellipsis"
                  >
                    {{ index + 1 }}. {{ attachment.name }}
                  </div>
                </div>
                <div
                  class="tw-flex tw-flex-row"
                  :class="[
                    props.template && !!!attachmentsFiles?.length
                      ? 'tw-mt-4'
                      : '',
                  ]"
                >
                  <Button
                    icon-pos="left"
                    class="primary tw-mr-4 tw-w-1/2"
                    @click="attachmentsClicked()"
                  >
                    <font-awesome-icon
                      :icon="[
                        'fas',
                        `${mode === 'create' ? 'fa-check' : 'fa-floppy-disk'}`,
                      ]"
                      :class="['p-button-icon p-button-icon-left']"
                    ></font-awesome-icon>
                    Файлы вложений
                  </Button>
                  <Button
                    v-if="attachmentsFiles && attachmentsFiles.length"
                    icon-pos="left"
                    class="neutral tw-w-1/2"
                    @click="attachmentsReset()"
                  >
                    <font-awesome-icon
                      :icon="[
                        'fas',
                        `${mode === 'create' ? 'fa-check' : 'fa-floppy-disk'}`,
                      ]"
                      :class="['p-button-icon p-button-icon-left']"
                    ></font-awesome-icon>
                    Отменить выбор
                  </Button>
                </div>
              </div>
            </div>
          </template>

          <!-- {{ values }} <br /><br />
          {{ meta }} <br /><br />
          {{ errors }} <br /><br /> -->
          <!--
          ------------------
          {{ TemplatenameMeta }} <br />
          <br />
          {{ DocumentNameMeta }} <br />
          <br />
          {{ DocumentNumberMeta }} <br />
          <br />
          {{ DocumentDateMeta }} <br />
          <br />
          {{ TemplateTypeMeta }} <br />
          <br />
          {{ ResponsibleMeta }} <br />
          <br />
          {{ InitiatorMeta }} <br />
          <br />
          {{ CategoryMeta }} <br />
          <br />
          {{ PublicationDateMeta }} <br />
          <br />
          {{ ReportingDateMeta }} <br />
          <br />
          {{ InstructionsMeta }} <br />
          <br />
          {{ AttachmentsMeta }} <br />
          <br /> -->
        </div>
      </form>
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
          form="templateForm"
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
          form="templateForm"
          :disabled="!(meta.dirty && meta.touched && meta.valid)"
        >
          <font-awesome-icon
            :icon="[
              'fas',
              `${mode === 'create' ? 'fa-check' : 'fa-floppy-disk'}`,
            ]"
            :class="['p-button-icon p-button-icon-left']"
          ></font-awesome-icon>
          <div class="p-button-label">
            {{ mode === "create" ? "Создать" : "Сохранить" }}
          </div>
        </Button>
      </div>
    </template>
  </Dialog>

  <UserPopup @created="addUserToList" />
</template>

<script lang="ts" setup>
import { ref, watch, type Ref, type PropType, toRaw } from "vue";

import { useField, useFieldArray, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";

import { useFocus } from "@vueuse/core";
import { useFileDialog } from "@vueuse/core";

import { DateTime as luxon } from "luxon";

import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import Textarea from "primevue/textarea";
import InputText from "primevue/inputtext";
import MultiSelect, { MultiSelectChangeEvent } from "primevue/multiselect";
import ScrollPanel from "primevue/scrollpanel";

import FormPreloader from "@/components/FormPreloader.vue";
import UserPopup from "@/components/forms/admin/UserForm.vue";

import ScheduleAddIcon from "@/components/icons/ScheduleAdd.vue";
import ScheduleRemoveIcon from "@/components/icons/ScheduleRemove.vue";
import PlusUserTwotone from "@/components/icons/PlusUserTwotone.vue";
import DeleteDocumentTwotone from "@/components/icons/DeleteDocumentTwotone.vue";
import FileUploadTwotoneLoop from "@/components/icons/FileUploadTwotoneLoop.vue";

import toast from "@/utils/toast";
import fioParse from "@/utils/fio-formatter";
import useEmitter from "@/utils/emitter";

import { TUserBase, TUser } from "@/typings/user.types";

import { useUsersStore } from "@/stores/users.store";
import { useLoadingStore } from "@/stores/loading.store";
import { useCalendarStore } from "@/stores/calendar.store";
import { useDropdownsOptionsStore } from "@/stores/dropdowns-options.store";

import {
  TAttachments,
  TRecipient,
  TScheduleItem,
  TTemplate,
  ZAttachment,
  ZBaseTemplate,
  ZTemplate,
} from "@/typings/template.types";
import {
  Recipients as ZRecipients,
  TRecipient as TORecipient,
  TRecipients,
  TRecipientsGroup,
} from "@/typings/options.types";

const visible: Ref<boolean> = ref(false);

let formHeader: Ref<string> = ref("...");

let mode: Ref<"read" | "create" | "copy" | "update"> = ref("create");

const options: Ref<{ [key: string]: unknown[] }> = ref({
  periodTypes: [
    { Id: 1, Name: "Ежедневно", ByDates: false },
    { Id: 2, Name: "Еженедельно", ByDates: false },
    { Id: 3, Name: "Ежемесячно (по числам)", ByDates: true },
    { Id: 4, Name: "Ежегодно", ByDates: false },
    { Id: 5, Name: "Полугодовой", ByDates: false },
    { Id: 6, Name: "Квартальный", ByDates: false },
    { Id: 7, Name: "Разовый", ByDates: false },
  ],
});
// const templatesStore = useTemplatesStore()

const props = defineProps({
  template: {
    type: Object as PropType<TTemplate>,
    default: () => undefined,
    // validator(value: unknown) {
    //   const parsed = ZTemplate.safeParse(value)
    //   if (value !== undefined && !parsed.success) {
    //     console.error(fromZodError(parsed.error).toString())
    //     throw new TypeError("Invalid prop: custom validator check failed for prop 'template'")
    //   }
    //   return true
    // },
  },
  disabled: {
    type: Boolean,
    default: () => false,
  },
  folder: {
    type: Boolean,
    default: () => false,
  },
});

const validationSchema = toTypedSchema(
  props.folder ? ZBaseTemplate : ZTemplate,
);

const {
  /* values, */ handleSubmit,
  errors,
  resetForm,
  meta,
  setFieldTouched,
  setFieldValue,
} = useForm({
  validationSchema,
  // initialValues: {
  //   startDate: luxon.now().startOf('month').toISO(),
  //   endDate: luxon.now().endOf('month').toISO(),
  // },
});

const onSubmit = handleSubmit(onSuccess, onInvalid);

// 👇 Поля формы
const { value: Templatename, meta: TemplatenameMeta } =
  useField<string>("Templatename");
const { value: DocumentName, meta: DocumentNameMeta } = useField<string>(
  "DocumentName",
  undefined,
  { initialValue: null },
);
const { value: DocumentNumber, meta: DocumentNumberMeta } = useField<string>(
  "DocumentNumber",
  undefined,
  { initialValue: null },
);
const { value: DocumentDate, meta: DocumentDateMeta } = useField<string>(
  "DocumentDate",
  undefined,
  { initialValue: null },
);
const { value: TemplateType, meta: TemplateTypeMeta } =
  useField<number>("TemplateTypeId");
const { value: Responsible, meta: ResponsibleMeta } = useField<number>(
  "ResponsibleId",
  undefined,
  {
    initialValue: null,
  },
);
const { value: Initiator, meta: InitiatorMeta } = useField<number>(
  "TemplateInitiatorId",
  undefined,
  { initialValue: null },
);
const { value: Category, meta: CategoryMeta } = useField<number>(
  "TemplateCategoryId",
  undefined,
  {
    initialValue: null,
  },
);
const { value: PublicationDate, meta: PublicationDateMeta } = useField<string>(
  "PublicationDate",
  undefined,
  {
    initialValue: null,
  },
);
const { value: ReportingDate, meta: ReportingDateMeta } = useField<string>(
  "ReportingDate",
  undefined,
  {
    initialValue: null,
  },
);
const { value: Instructions, meta: InstructionsMeta } = useField<string>(
  "Instructions",
  undefined,
  {
    initialValue: null,
  },
);

const {
  value: Attachments,
  handleChange: AttachmentsChange,
  meta: AttachmentsMeta,
} = useField<TAttachments>("Attachments", undefined, {
  initialValue: [],
});

const {
  remove: ScheduleRemove,
  push: SchedulePush,
  fields: Schedule,
} = useFieldArray<TScheduleItem>("ReportingSchedule");

const {
  remove: RecipientsRemove,
  push: RecipientsPush,
  fields: Recipients,
} = useFieldArray<TRecipient>("Assignments");
// 👆 Поля формы

const firstFormField = ref();

const { bus, emit } = useEmitter();

watch(
  () => bus.value.get("openMonitoringTemplateForm"),
  async () => {
    // Деструктурим параметры (потому что параметры пишутся в массив)
    visible.value = true;

    const isNotEmpty = props.template; // && Object.keys(props.template).length > 8

    mode.value = props.disabled
      ? "read"
      : isNotEmpty
        ? props.template.Modifydate
          ? "update"
          : "copy"
        : "create";

    switch (mode.value) {
      case "read":
        formHeader.value = `Просмотр ${props.folder ? "каталога" : "шаблона"}`;
        break;
      case "copy":
        formHeader.value = `Копирование ${props.folder ? "каталога" : "шаблона"} «${props.template.Templatename}»`;
        break;
      case "create":
        formHeader.value = `Новый ${props.folder ? "каталог" : "шаблон"}`;
        break;
      case "update":
        formHeader.value = `Редактирование ${props.folder ? "каталога" : "шаблона"} «${props.template.Templatename}»`;
    }

    // Заполним списки опций выпадающих списков
    const optionsToAsk = [
      "users",
      "templatecategory",
      "orggroup",
      "templateinitiator",
      "templatestatus",
      "assignments",
    ];

    await Promise.all(
      optionsToAsk.map(async (option) => {
        options.value[option] =
          (await useDropdownsOptionsStore().read(option)) || [];
      }),
    );

    if (props.template) {
      resetData(props.template);
    } else {
      resetData();
    }

    useFocus(firstFormField, { initialValue: true });
  },
);

// 👇 Обработка отправки формы
function addScheduleItem() {
  SchedulePush({ PeriodTypeId: null, Dates: [] });
}

function removeScheduleItem(index: number) {
  ScheduleRemove(index);
}

const emitEvent = defineEmits<{
  (
    e: "action-result",
    value: { createdId?: string; updatedId?: string; form: TTemplate },
  );
  (e: "close");
}>();

const usersStore = useUsersStore();
const calendarStore = useCalendarStore();

async function onSuccess(values: TTemplate) {
  const parsed = ZTemplate.safeParse(values);

  if (parsed.success) {
    const { data } = parsed;
    let query;

    if (mode.value === "create" || mode.value === "copy") {
      query = calendarStore.create(data);
    } else if (mode.value === "update") {
      query = calendarStore.update(data.Id, data);
    }

    await query
      ?.then(
        async (response: {
          createdId?: string;
          updatedId?: string;
          form: TTemplate;
        }) => {
          emitEvent("action-result", response);

          const templateId =
            response.createdId || response.updatedId || response.form.Id;

          if (instructionsFiles.value && instructionsFiles.value.length >= 1) {
            const instructionsFormData = new FormData();

            instructionsFormData.append("TemplateId", templateId);
            instructionsFormData.append("AttachmentType", "1");

            Array.from(instructionsFiles.value).forEach((file) => {
              instructionsFormData.append("AttachedFiles[]", file);
            });

            await calendarStore.upload(
              instructionsFormData,
              "Загрузка файлов инструкций",
            );
          }

          if (attachmentsFiles.value && attachmentsFiles.value.length >= 1) {
            const attachmentsFormData = new FormData();

            attachmentsFormData.append("TemplateId", templateId);
            attachmentsFormData.append("AttachmentType", "0");

            Array.from(attachmentsFiles.value).forEach((file) => {
              attachmentsFormData.append("AttachedFiles[]", file);
            });

            await calendarStore.upload(
              attachmentsFormData,
              "Загрузка вложений",
            );
          }
          return response;
        },
      )
      .then(
        (response: {
          createdId?: string;
          updatedId?: string;
          form: TTemplate;
        }) => {
          let message = "Шаблон создан";

          if (!response.createdId && response.updatedId)
            message = "Шаблон обновлён";

          usersStore.activity(
            "write",
            1,
            `${message} ${response.createdId || response.updatedId} «${response.form.Templatename}»`,
          );

          toast("Успех", message, "success");
          closeModal();
        },
      );
  } else {
    toast("Ошибка!", "Ошибка приведения к типу 'TTemplate'", "error");
  }
}

function onInvalid({ values, errors, results }) {
  console.log(values); // current form values
  console.error(errors); // a map of field names and their first error message
  console.warn(results); // a detailed map of field names and their validation results
}

// Сброс формы
function resetData(form?: TTemplate) {
  instructionsReset();
  attachmentsReset();

  selectedRecipients.value = [];

  if (props.template)
    props.template.Assignments.forEach((assignment) => {
      options.value.assignments.forEach((group: TRecipientsGroup) => {
        const existedAssignment = group.Items.find(
          (a) =>
            a.CatalogueValue === assignment.ARType &&
            a.Value === assignment.KeyId,
        );
        if (existedAssignment) selectedRecipients.value.push(existedAssignment);
      });
    });

  if (form) {
    if (mode.value === "copy") form.Templatename = `${form.Templatename} копия`;
    resetForm({ values: form });
  } else {
    const formEmpty = ZTemplate.parse({
      Templatename: "Новый",
      TemplateTypeId: 0,
      ReportingDate: luxon.now().toISO(),
      ReportingSchedule: [{ PeriodTypeId: 7, Dates: [new Date()] }],
      Assignments: [],
    });
    formEmpty.Templatename = null;
    formEmpty.TemplateTypeId = null;
    formEmpty.ReportingDate = null;
    formEmpty.ReportingSchedule[0].Dates = [luxon.now().toJSDate()];

    formEmpty.DocumentName = null;
    formEmpty.DocumentNumber = null;
    formEmpty.DocumentDate = null;

    formEmpty.ResponsibleId = null;
    formEmpty.TemplateInitiatorId = null;
    formEmpty.TemplateCategoryId = null;
    formEmpty.PublicationDate = null;
    formEmpty.Instructions = null;
    formEmpty.Attachments = [];

    resetForm({ values: formEmpty });
  }
}

const closeModal = () => {
  resetData();
  visible.value = false;
  emitEvent("close");
};

// function setTouchToField(event: DropdownChangeEvent, fieldName: string) {
//   setFieldTouched(fieldName, true)
//   if (event.value === null) setFieldValue(fieldName, undefined)
// }

// 👇 Обработка прикрепляемых файлов
const {
  files: instructionsFiles,
  open: instructionsOpen,
  reset: instructionsReset,
  // onCancel: instructionsCancel,
  onChange: instructionsChange,
} = useFileDialog({
  multiple: true,
  // accept: 'image/*',
  // directory: true, // Выбор директорий вместо файлов
});

instructionsChange(() => filesChange());

function instructionsClicked() {
  setFieldTouched("Attachments", true);
  instructionsOpen();
}

const {
  files: attachmentsFiles,
  open: attachmentsOpen,
  reset: attachmentsReset,
  // onCancel: attachmentsCancel,
  onChange: attachmentsChange,
} = useFileDialog({
  multiple: true,
  // accept: 'image/*',
  // directory: true, // Выбор директорий вместо файлов
});

attachmentsChange(() => filesChange());

function attachmentsClicked() {
  setFieldTouched("Attachments", true);
  attachmentsOpen();
}

function filesChange() {
  const values = [attachmentsFiles.value, instructionsFiles.value];

  const filesObjects: TAttachments = [];

  values.forEach((files: FileList, index: number) => {
    if (files && files.length)
      Array.from(files).forEach((file: File) => {
        const item = ZAttachment.parse({
          AttachmentType: index,
          Name: file.name,
        });

        filesObjects.push(item);
      });
  });

  AttachmentsChange(AttachmentsMeta.initialValue.concat(filesObjects));
  setFieldTouched("Attachments", true);

  // if (filesObjects.length) {
  //   setFieldValue('Attachments', filesObjects)
  // } else {
  //   setFieldValue('Attachments', null)
  // }
}

// Вспомогательные функции
function addUserToList(response: { createdId: number; form: TUser }) {
  options.value.users.push(response.form);
}

function clearPeriodDates(row: number, periodId: number) {
  setFieldTouched("ReportingSchedule", true);

  if (![3, 7].includes(periodId)) Schedule.value[row].value["Dates"] = [];

  if (periodId === 3 && Schedule.value[row].value["Dates"].length > 1)
    Schedule.value[row].value["Dates"] = [
      Schedule.value[row].value["Dates"][0],
    ];
}

const selectedRecipients: Ref<TRecipients> = ref([]);

function updateRecipientsList(event: MultiSelectChangeEvent) {
  const recipients = ZRecipients.parse(event.value);

  const recipientsToRemove = Recipients.value.filter(
    (x) =>
      !recipients.find(
        (r) => x.value.KeyId === r.Value && x.value.ARType === r.CatalogueValue,
      ),
  );

  recipientsToRemove.forEach((rr) => {
    RecipientsRemove(Recipients.value.indexOf(rr));
  });

  recipients.forEach((r) => {
    const existedRecipient = Recipients.value.find(
      (fr) =>
        fr.value.KeyId === r.Value && fr.value.ARType === r.CatalogueValue,
    );
    if (!existedRecipient)
      RecipientsPush({
        ARType: r.CatalogueValue,
        KeyId: r.Value,
        Period: [new Date()],
      });
  });
}

function getGroupName(id: number) {
  return (options.value.assignments as TORecipient[]).find(
    (x) => x.Value === id,
  )?.Label;
}

function getRecipientForm(catalogue: number, item: number) {
  return Recipients.value?.find(
    (x) => x.value.ARType === catalogue && x.value.KeyId === item,
  )?.value;
}

function removeAttachment(id: number) {
  setFieldValue(
    "Attachments",
    toRaw(Attachments.value).filter((a) => a.Id !== id),
  );
}

function downloadAttachment(id: number, template: string) {
  calendarStore.download(id, template);
}

// function updateRecipientPeriod(event: Date, recipientId: number) {
//   console.log(event, recipientId)
//   console.log(test.value)
// }
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
