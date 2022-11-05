<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import { watch } from "vue";
import { TaskGraph, Task } from "~/models/TaskGraph"
import { plainToClass } from 'class-transformer';

const props = defineProps({
  modelValue: { type: String, required: true }
});

const value = useVModel(props, "modelValue");

function tryParse(value: string) {
  try {
    const parsed = JSON.parse(value);

    const taskgraph = plainToClass(TaskGraph, parsed, { excludeExtraneousValues: true });
    if (!taskgraph.tasks) throw new SyntaxError();

    const graph = buildDiGraph(taskgraph);
  } catch(e) {
    if (e instanceof SyntaxError) {
      console.log('not taskgraph:', e.message, value)
    } else {
      console.log('another error')
      throw e
    }
  }
}

function buildDiGraph(taskgraph: TaskGraph): number[][] {
  const index_map = new Map<stirng, number>();
  taskgraph.tasks.forEach((task, index) => {
    index_map.set(task.name, index);
  });

  const graph: number[][] = new Array(taskgraph.tasks.length).fill([]);
  taskgraph.tasks.forEach((task, to_index) => {
    if (task.depends) task.depends.forEach(depend => {
      const from_index = index_map.get(depend);
      if (from_index === undefined) { // !from_index で判定すると 0 が来たときに壊れる
        throw new SyntaxError(`${task.name} にある ${depend} がみつからない`);
      }

      graph[from_index].push(to_index);
    });
  });
  
  console.log(graph);
  return graph;
}

watch(
  value, 
  (value, _prev) => {
    tryParse(value)
  }
);

</script>

<template>
  <div>aaa</div>
  <textarea
    v-model="value"
    border
    border-black
    rounded-lg
  />
</template>
