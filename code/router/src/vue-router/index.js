let _Vue = null;
export default class VueRouter {
  static install(Vue) {
    if (VueRouter.install.installed) {
      return;
    }
    VueRouter.install.installed = true;

    _Vue = Vue;

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
          console.log(this.to);
          const href = window.location.href
          const i = href.indexOf('#')
          const base = i >= 0 ? href.slice(0, i) : href
          // 根据地址 判断是否为hash模式
          if(i>=0){
            window.location.replace(`${base}#${this.to}`)
          } else {
            history.pushState({}, '', this.to);
          }
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
    const eventType = this.isHash() ? 'hashchange' : 'popstate'
    window.addEventListener(eventType, () => {
      const pathname = this.isHash() ? window.location.hash.substring(1) : window.location.pathname
      this.data.current = pathname;
    });
  }

  isHash(){
    const href = window.location.href
    const i = href.indexOf('#')
    return i >= 0
  }
}
