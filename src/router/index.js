import Vue from 'vue'
import Router from 'vue-router'
import calendar from '@/components/test_canlen/calendar.vue'
import indexCaledar from '@/components/test_canlen/index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'indexCaledar',
      component: indexCaledar
    }
  ]
})
