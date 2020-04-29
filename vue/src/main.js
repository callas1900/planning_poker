import Vue from 'vue'
import VueMaterial from 'vue-material'
import VueClipboard from 'vue-clipboard2'
import 'vue-material/dist/vue-material.min.css'
import router from './router'
import store from './store'
import Firebase from 'firebase'
import App from './App.vue'

Vue.use(VueMaterial)
Vue.use(VueClipboard)

const { firebaseConfig } = require('./firebase/init.js');
const database = Firebase.initializeApp(firebaseConfig).database();
Vue.prototype.$database = database;

Vue.mixin({
  data() {
    return {
      showSnackbar: false,
      message: null
    };
  },
  methods: {
    snackbar: function (message, that) {
      if (!that) {
        that = this;
      }
      that.message = message;
      that.showSnackbar = true;
    },
  }
})

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
})
