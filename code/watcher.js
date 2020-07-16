class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    // data中的属性名称
    this.key = key;
    // 回调函数负责更新视图
    this.cb = cb;
    // 当前watcher对象记录到dep类的静态属性target中
    Dep.target = this;
    // 触发get方法，在其中调用addSub
    this.oldValue = vm[key];
    // 设置为空，防止重复添加
    Dep.target = null;
  }

  // 当数据发生变化时更新视图
  update() {
    let newValue = this.vm[this.key];
    if (this.oldValue === newValue) return;
    this.cb(newValue);
  }
}
