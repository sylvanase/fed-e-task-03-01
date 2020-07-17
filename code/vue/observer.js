class Observer {
  constructor(data) {
    this.walk(data);
  }
  walk(data) {
    // 判断data是否为对象,
    if (!data || typeof data !== 'object') {
      return;
    }
    // 遍历data所有属性
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key]);
    });
  }

  defineReactive(obj, key, val) {
    const _self = this;
    // 负责收集依赖并发送通知
    let dep = new Dep();
    // 如果val是对象，将val内部的属性转换成响应式数据
    _self.walk(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 访问属性值时，收集依赖
        Dep.target && dep.addSub(Dep.target);
        // 传递val的意义在于，直接使用obj[key]会发生死递归，爆栈
        // return obj[key] 此时会触发data中的get方法
        return val;
      },
      set(newValue) {
        if (newValue === val) return;
        val = newValue;
        _self.walk(newValue);
        // 发送通知
        dep.notify();
      },
    });
  }
}
