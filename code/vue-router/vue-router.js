let _Vue = null;
export default class VueRouter {
  static install(Vue) {
    // 1. 判断插件是否已经被安装
    if (VueRouter.install.installed) {
      return;
    }
    VueRouter.install.installed = true;

    // 2. 把Vue构造函数记录到全局变量
    _Vue = Vue;

    // 3. 把创建Vue实例时传入的router对象注入到Vue实例
    // 混入
    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router;
          this.$options.router.init();
        }
      },
    });
  }
  constructor(options) {
    this.options = options;
    this.routeMap = {};
    this.data = _Vue.observable({
      current: '/',
    });
  }

  init() {
    this.createRouteMap();
    this.initComponents(_Vue);
    this.initEvent();
  }

  createRouteMap() {
    // 遍历所有的路由规则，将路由规则解析为键值对，存储到routeMap
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component;
    });
  }

  initComponents(Vue) {
    Vue.component('router-link', {
      props: {
        to: String,
      },
      template: '<a :href="to"><slot></slot></a>', // 此时需要开启runtimeCompiler
      render(h) {
        // 未开启，此时是运行时版本的Vue，使用render
        return h(
          'a',
          {
            attrs: {
              href: this.to,
            },
            on: {
              click: this.clickHandler,
            },
          },
          [this.$slots.default]
        );
      },
      methods: {
        clickHandler(e) {
          history.pushState({}, '', this.to);
          e.preventDefault();
        },
      },
    });
    const self = this;
    Vue.component('router-view', {
      render(h) {
        const component = self.routeMap[self.data.current];
        return h(component);
      },
    });
  }

  initEvent() {
    window.addEventListener('popstate', () => {
      this.data.current = window.location.pathname;
    });
  }
}
