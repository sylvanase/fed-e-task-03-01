# 简答题

## 1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如何把新增成员设置成响应式数据，它的内部原理是什么。

解答：不是响应式的。data 中的数据在创建 Vue 实例时，通过 observer 数据劫持，来监听数据的变化。后续动态添加的成员没有重新被添加 get 和 set 方法，所以不是响应式的。Vue 提供了 set 方法，向嵌套对象添加响应式属性。

```
Vue.set(vm.dog, name, 'Trump')
```

set 方法中先判断对象是否存在，并对需要添加的 key 进行校验若该 key 已经存在，则修改值。一系列校验都通过后若 key 不存在，调用内部的 `function defineReactive`，该函数内部再次调用了`Object.defineProperty`将属性转化为 get/set，同时添加依赖通知。

## 2、请简述 Diff 算法的执行过程

vue 中 diff 时调用 patch，patch 接收 oldVnode 和 vnode 两个参数，对比两个 vnode 是否相同，通过节点的 key 值和 sel，不是相同的节点，重新渲染。是相同节点，判断 vnode 中是否有文本，有文本且与 oldvnode 不同，更新文本。新的 vnode 中包含 children，需要判断子节点是否有变化，在子节点中使用 diff 算法进行比较。vue 中优化了 diff 算法，使其只在同层级中进行。

二、编程题
1、模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。

