class Vue {
  constructor(options) {
    // 通过属性保存选项的数据
    this.$options = options || {};
    this.$data = options.data || {};
    this.$el =
      typeof options.el === 'string'
        ? document.querySelector(options.el)
        : options.el;
    this.$methods = options.methods || {};
    // data 成员转换
    this._proxyData(this.$data);
    // 调用observer
    new Observer(this.$data);
    // 调用compiler
    new Compiler(this);
  }

  _proxyData(data) {
    // 遍历data所有属性
    Object.keys(data).forEach(key => {
      // data属性注入实例
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key];
        },
        set(newValue) {
          if (newValue === data[key]) return;
          data[key] = newValue;
        },
      });
    });
  }
}
