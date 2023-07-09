<script setup>
import { ref } from 'vue'
import { useCounterStore } from '../stores/counter';

const store = useCounterStore();
</script>

<template>
  子组件内计数：{{ store.count }}
</template>

<style scoped>

</style>
