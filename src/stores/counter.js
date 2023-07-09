import { defineStore } from "../pinia";

export const useCounterStore = defineStore('counter', {
    state: () => ({count: 0}),
    getters: {
        doubleCount: (store) => store.count * 2,
    },
    actions: {
        increment() {
            this.count ++;
        }
    }
})