<script setup lang="ts">
import { ref } from "vue";
import { TaskGraph } from "~/models/TaskGraph";
import GraphViewer from "~/components/GraphViewer.vue";
import GraphParseArea from "~/components/GraphParseArea.vue";

const taskgraph = ref(new TaskGraph({ tasks: [] }));
console.log(taskgraph.value);
</script>

<template>
  <div flex flex-col m-4>
    <GraphViewer />
    {{ taskgraph.tasks }}
    <GraphParseArea v-model="taskgraph" />
  </div>
</template>
