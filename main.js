import Vue from 'vue'
import App from './App'
import { Base64 } from 'js-base64';

Vue.config.productionTip = false
//Vue.prototype.apiServer = 'http://47.102.201.109:8080/api'
//Vue.prototype.apiServer = 'http://47.100.5.142:8080/api'
Vue.prototype.apiServer = 'http://localhost:8080/api'
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
