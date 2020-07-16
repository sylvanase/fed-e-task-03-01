class Compiler {
  constructor(vm) {
    this.el = vm.$el;
    this.vm = vm;
    this.compile(this.el);
  }
  // 遍历所有节点，判断如何解析，编译模板，处理文本节点和元素节点
  compile(el) {
    let childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {
      if (this.isTextNode(node)) {
        // 处理文本节点
        this.compileText(node);
      } else if (this.isElementNode(node)) {
        // 处理元素节点
        this.compileElement(node);
      }
      // 判断node节点是否有子节点，存在子节点需要递归
      if (node.childNodes && node.childNodes.length) {
        this.compile(node);
      }
    });
  }

  // 编译元素节点，处理指令
  compileElement(node) {
    // 遍历所有属性节点，判断是否为指令
    Array.from(node.attributes).forEach(attr => {
      let attrName = attr.name;
      if (this.isDirective(attrName)) {
        // 将v-处理掉
        attrName = attrName.substr(2);
        let key = attr.value;
        this.update(node, key, attrName);
      }
    });
  }

  update(node, key, attrName) {
    let updateFn = this[`${attrName}Updater`];
    updateFn && updateFn.call(this, node, this.vm[key], key);
  }

  // 处理v-text指令
  textUpdater(node, value, key) {
    node.textContent = value;
    new Watcher(this.vm, key, newValue => {
      node.textContent = newValue;
    });
  }

  modelUpdater(node, value, key) {
    node.value = value;
    new Watcher(this.vm, key, newValue => {
      node.value = newValue;
    });
    // 双向绑定，为表单元素注册input事件
    node.addEventListener('input', () => {
      this.vm[key] = node.value;
    });
  }

  // 处理html指令
  htmlUpdater(node, value, key) {
    node.innerHTML = value;
    new Watcher(this.vm, key, newValue => {
      node.innerHTML = newValue;
    });
  }

  onUpdater(node, value, key) {
    console.log(node, value, key);
  }

  // 编译文本节点，处理差值表达式
  compileText(node) {
    // 定义正则获取对象
    let reg = /\{\{(.+)?\}\}/;
    let value = node.textContent;
    if (reg.test(value)) {
      let key = RegExp.$1.trim();
      node.textContent = value.replace(reg, this.vm[key]);
      // 创建watcher对象，数据改变
      new Watcher(this.vm, key, newValue => {
        node.textContent = newValue;
      });
    }
  }

  // 判断元素属性名是否为指令
  isDirective(attrName) {
    return attrName.startsWith('v-');
  }

  // 判断节点是文本节点
  isTextNode(node) {
    return node.nodeType === 3;
  }

  // 判断节点是否为元素节点
  isElementNode(node) {
    return node.nodeType === 1;
  }
}
