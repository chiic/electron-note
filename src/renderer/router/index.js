import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/Login/index.vue')
    },
    {
      path: '/home',
      component: require('@/components/Home/index.vue'),
      children: [
        {
          path: '/home/notelist',
          component: require('@/components/Home/NoteList'),
          children: [
            {
              path: '/home/notelist/detailallfolder',
              component: require('@/components/Home/NotelistDetail')
            },
            {
              path: '/home/notelist/detailnew',
              component: require('@/components/Home/NotelistDetail')
            }
          ]
        }
      ]
    }
  ]
})
