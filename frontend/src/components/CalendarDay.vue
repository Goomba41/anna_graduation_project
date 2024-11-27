<template>
  <div
    aria-label="Calendar"
    class="cv-wrapper locale-ru locale-ru y2024 m11 period-month periodCount-1 theme-default"
  >
    <div class="cv-header">
      <div class="cv-header-nav">
        <button
          class="previousYear"
          aria-label="Previous Week"
          @click="changeDate('backward', 'week', undefined, true)"
        >
          &lt;&lt;</button
        ><button
          class="previousPeriod"
          aria-label="Previous Period"
          @click="changeDate('backward', 'day')"
        >
          &lt;</button
        ><button class="currentPeriod" aria-label="Current Period" @click="setNow">Текущий</button
        ><button class="nextPeriod" aria-label="Next Period" @click="changeDate('forward', 'day')">
          &gt;</button
        ><button
          class="nextYear"
          aria-label="Next Week"
          @click="changeDate('forward', 'week', undefined, true)"
        >
          &gt;&gt;
        </button>
      </div>
      <div class="periodLabel">{{ showDateFormatted }}</div>
    </div>
    <div aria-multiselectable="false" class="cv-weeks">
      <div class="cv-week">
        <div class="cv-weekdays">
          <div
            draggable="false"
            class="cv-day dow1 d2024-10-28 d10-28 d28 instance4 outsideOfMonth past lastInstance"
            aria-label="28"
            aria-selected="false"
            aria-dropeffect="none"
          ></div>

          <template v-for="(event, index) in props.events" :key="index">
            <div
              draggable="false"
              :class="`offset0 span7 cv-item ${event.classes.join(' ')}`"
              :title="event.title"
              aria-haspopup="true"
              :style="`top: calc(${0.6 + 1.4 * index}em + ${index * 6}px)`"
              @contextmenu="emit('rightClick', $event, event)"
              @click="emit('leftClick', $event, event)"
            >
              {{ event.title }}
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { PropType } from 'vue'
import type { Ref } from 'vue'

import { DateTime as luxon } from 'luxon'

import { TEventItem, TEventsList } from '@/typings/calendar.types'

const props = defineProps({
  events: {
    type: Array as PropType<TEventsList>,
    default: () => [],
  },
  showDate: {
    type: Date,
    default: () => luxon.now().toJSDate(),
  },
})

const emit = defineEmits<{
  changed: [date: Date]
  rightClick: [value: Event, item: TEventItem]
  leftClick: [value: Event, item: TEventItem]
}>()
// const emit = defineEmits<{
//   (e: 'changed', date: Date): void
//   (e: 'rightClick', value: TEventItem | Event): TEventItem | Event
//   (e: 'leftClick', value: TEventItem): TEventItem
// }>()

const showDateFormatted = computed(() => {
  const str = luxon.fromISO(showDateInner.value).toLocaleString(luxon.DATE_HUGE)
  return str.charAt(0).toUpperCase() + str.slice(1)
})

const showDateInner: Ref<string> = ref(luxon.fromJSDate(props.showDate).toISODate())

function changeDate(
  direction: 'forward' | 'backward',
  period: 'year' | 'quarter' | 'month' | 'week' | 'day',
  howMany: number = 1,
  startOfPeriod: boolean = false,
) {
  const changeData = {
    years: period === 'year' ? howMany : undefined,
    quarters: period === 'quarter' ? howMany : undefined,
    months: period === 'month' ? howMany : undefined,
    weeks: period === 'week' ? howMany : undefined,
    days: period === 'day' ? howMany : undefined,
  }

  const parsedCurrentDate = luxon.fromISO(showDateInner.value)

  let movedDate =
    direction === 'forward'
      ? parsedCurrentDate.plus(changeData)
      : parsedCurrentDate.minus(changeData)

  if (startOfPeriod) movedDate = movedDate.startOf(period)

  showDateInner.value = movedDate.toISODate()

  emit('changed', movedDate.toJSDate())
}

function setNow() {
  showDateInner.value = luxon.now().toISODate()
  emit('changed', luxon.now().toJSDate())
}
</script>

<style lang="css" scoped></style>
