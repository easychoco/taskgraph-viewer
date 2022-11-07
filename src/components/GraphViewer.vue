<script setup lang="ts">
import { TaskGraph } from "~/models/TaskGraph";

const props = defineProps({
 taskgraph: { type: TaskGraph, required: true },
});
</script>

<template>
  <div border rounded-lg>viewer</div>
</template>

<style scoped></style>
