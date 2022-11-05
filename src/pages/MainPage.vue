<script setup lang="ts">
import { ref } from "vue";
import GraphViewer from "~/components/GraphViewer.vue";
import GraphInputArea from "~/components/GraphInputArea.vue";

const inputValue = ref("abc");
defineExpose({ inputValue });

</script>

<template>
  <div>
    <GraphViewer 
      m-4
    />
    <GraphInputArea
      m-4
      v-model="inputValue"
    />
    {{ inputValue }}
  </div>
</template>
