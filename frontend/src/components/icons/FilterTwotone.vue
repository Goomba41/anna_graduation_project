<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      fillOpacity="0"
      stroke="currentColor"
      stroke-dasharray="56"
      stroke-dashoffset="56"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M5 4h14l-5 6.5v9.5l-4 -4v-5.5Z"
    >
      <animate
        fill="freeze"
        attributeName="fill-opacity"
        begin="0.6s"
        dur="0.15s"
        values="0;0.3"
      ></animate>
      <animate
        fill="freeze"
        attributeName="stroke-dashoffset"
        dur="0.6s"
        values="56;0"
      ></animate>
    </path>
  </svg>
</template>

<script lang="ts">
export default {
  name: "FilterTwotone",
};
</script>
