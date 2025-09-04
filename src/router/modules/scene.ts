import type { AppRouteModule } from '@/router/types'
import { LAYOUT } from '@/router/constant'

const scene: AppRouteModule = {
  path: '/scene',
  name: 'Scene',
  component: LAYOUT,
  meta: {
    title: '场景管理',
    icon: 'scene'
  },
  children: [
    {
      path: 'index',
      name: 'SceneIndex',
      component: () => import('@/views/scene/index.vue'),
      meta: {
        title: '场景列表'
      }
    },
    {
      path: 'detail/:id',
      name: 'SceneDetail',
      component: () => import('@/views/scene/detail.vue'),
      meta: {
        title: '场景详情',
        showLink: false
      }
    }
  ]
}

export default scene