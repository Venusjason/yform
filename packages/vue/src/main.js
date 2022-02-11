import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(iView)

new Vue({
  render: h => h(App),
}).$mount('#app')
