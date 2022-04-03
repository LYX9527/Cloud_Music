<script setup lang="ts">
import {ref} from 'vue'

defineProps<{
  msg: string,
  num: number,
}>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>
  <h1>{{ num }}</h1>
  <button @click="count++"> 我是按钮{{ count }}</button>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
