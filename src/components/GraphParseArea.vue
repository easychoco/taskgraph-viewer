<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import { watch, ref } from "vue";
import { TaskGraph } from "~/models/TaskGraph";
import { plainToClass } from "class-transformer";

const props = defineProps({
  modelValue: { type: TaskGraph, required: true },
});
const emit = defineEmits(["update:modelValue"]);

const value = useVModel(props, "modelValue");
const inputValue = ref("abc");

watch(inputValue, (next, _prev) => {
  console.log({ value });
  value.value = tryParse(next);
  emit("update:modelValue", value);
});

function tryParse(inputValue: string): TaskGraph[] {
  let result = [];
  try {
    const parsed = JSON.parse(inputValue);

    const taskgraph = plainToClass(TaskGraph, parsed, {
      excludeExtraneousValues: true,
    });
    if (!taskgraph.tasks) throw new SyntaxError();

    const graph = buildDiGraph(taskgraph);
    const sorted = topologicalSort(graph);
    sorted.forEach((v) => {
      result.push(taskgraph.tasks[v]);
    });
  } catch (e) {
    if (e instanceof SyntaxError) {
      console.log("not taskgraph:", e.message, value);
    } else {
      console.log("unknown error");
      throw e;
    }
  }
  return result;
}

function buildDiGraph(taskgraph: TaskGraph): number[][] {
  const index_map = new Map<string, number>();
  taskgraph.tasks.forEach((task, index) => {
    index_map.set(task.name, index);
  });

  const graph: number[][] = new Array(taskgraph.tasks.length);
  for (let i = 0; i < taskgraph.tasks.length; i += 1) graph[i] = new Array();
  taskgraph.tasks.forEach((task, to_index) => {
    if (task.depends) {
      task.depends.forEach((depend) => {
        const from_index = index_map.get(depend);
        if (from_index === undefined) {
          // !from_index で判定すると 0 が来たときに壊れる
          throw new SyntaxError(`${task.name} にある ${depend} がみつからない`);
        }
        graph[from_index].push(to_index);
      });
    }
  });

  return graph;
}

function topologicalSort(graph: number[][]): number[] {
  const size = graph.length;

  // 入次数
  const degree = Array(size).fill(0);
  graph.forEach((vec) => {
    vec.forEach((to) => {
      degree[to] += 1;
    });
  });

  const sorted: number[] = [];
  const queue: number[] = [];
  degree.forEach((deg, index) => {
    if (deg === 0) {
      queue.push(index);
    }
  });

  while (queue.length > 0) {
    const now = queue.shift();
    sorted.push(now);

    graph[now].forEach((to) => {
      degree[to] -= 1;
      if (degree[to] === 0) {
        queue.push(to);
      }
    });
  }

  if (sorted.length < size) {
    throw new SyntaxError("ループがあります");
  }

  return sorted;
}
</script>

<template>
  <div>
    <textarea v-model="inputValue" border border-black rounded-lg resize />
    {{ inputValue }}
  </div>
</template>
