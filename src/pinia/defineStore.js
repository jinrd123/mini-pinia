import { getCurrentInstance, reactive, toRefs, inject, effectScope, computed } from 'vue';
import { SymbolPinia } from './rootStore';

export function defineStore(idOrOptions, setup) {
    let id;
    let options;

    if(typeof idOrOptions === "string") {
        id = idOrOptions;
        options = setup;
    } else {
        id = idOrOptions.id;
        options = idOrOptions;
    }

    function useStore() {
        const currentinstance = getCurrentInstance(); // 保证useStore在组件内使用

        const pinia = currentinstance && inject(SymbolPinia);

        if(!pinia._s.has(id)) {
            createOptionStore(id, options, pinia);
        }
        const store = pinia._s.get(id);

        return store;
    }

    return useStore;
}

function createOptionStore(id, options, pinia) {
    let { state, getters, actions } = options;
    let scope;
    const store = reactive({});
    function setup() {
        pinia.state.value[id] = state ? state() : {}; // pinia.state为ref对象，放入对象会被自动proxy

        const localState = toRefs(pinia.state.value[id]);
        return Object.assign(
            localState,
            actions,
            Object.keys(getters || {}).reduce((computedGetters, name) => {
                computedGetters[name] = computed(() => {
                    return getters[name].call(store, store);
                });
                return computedGetters;
            }, {})
        );
    }

    const setupStore = pinia._e.run(() => {
        scope = effectScope(); // 这里就不要传true参数了，因为子store可以被父scope给销毁才对
        return scope.run(() => setup()); 
    });

    // 改变action方法的this指向
    function wrapAction(name, action) {
        return function() {
            let res = action.apply(store, arguments);
            return res;
        }
    }
    for(let key in setupStore) {
        const prop = setupStore[key];
        if(typeof prop === "function") {
            setupStore[key] = wrapAction(key, prop);
        }
    }

    // 所以每创建一个仓库，就相当于创建一个reactive对象，然后将state中的数据合并到响应式对象中
    Object.assign(store, setupStore);
    pinia._s.set(id, store);
}