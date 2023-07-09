<script setup>
import HelloWorld from './components/HelloWorld.vue';
import { useCounterStore } from './stores/counter';

const store = useCounterStore();
</script>

<template>
  计数：{{ store.count }}
  <hr />
  双倍：{{ store.count * 2 }}
  <hr />
  <button @click="store.increment">点击增加</button>
  <hr />
  <HelloWorld />
</template>

<style scoped>

</style>
