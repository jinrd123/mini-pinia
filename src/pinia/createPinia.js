import { markRaw, effectScope, ref } from 'vue';
import { SymbolPinia } from './rootStore';

export function createPinia() {
    const scope = effectScope(true); // effectScope接收一个boolean值，如果传true代表游离模式，那么创建的scope不会被父scope收集，通俗来讲，如果是游离模式，那么scope之间是不存在父子关系的，每一个scope都是独立的。

    const state = scope.run(() => ref({}));

    const pinia = markRaw({ // 防止pinia对象变成响应式
        install(app) {
            pinia._a = app;
            app.provide(SymbolPinia, pinia);
        },
        state, // 所有store状态的集合对象
        _e: scope, // 用来管理整个web应用的effectScope
        _s: new Map() // 记录所有的store
    });

    return pinia;
}

// -------- scope.run --------
/*
run<T>(fn: () => T): T | undefined {
  if (this.active) {
    try {
      activeEffectScope = this
      return fn()
    } finally {
      activeEffectScope = this.parent
    }
  } else if (__DEV__) {
    warn(`cannot run an inactive effect scope.`)
  }
}
说白了就是切换effect为当前的scope，然后执行回调函数，即让回调函数中的响应式数据收集此scope
*/