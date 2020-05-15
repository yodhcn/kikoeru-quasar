import MainLayout from 'layouts/MainLayout'
import DashboardLayout from 'layouts/DashboardLayout'

import Works from 'pages/Works'
import Work from 'pages/Work'
import Labels from 'pages/Labels'
import Login from 'pages/Login'
import PlayList from 'pages/PlayList'
import MyList from 'pages/MyList'
import MyListWork from 'pages/MyListWork'

import Folders from 'pages/Dashboard/Folders'
import Scanner from 'pages/Dashboard/Scanner'
import Advanced from 'pages/Dashboard/Advanced'
import UserManage from 'pages/Dashboard/UserManage'


const routes = [
  {
    path: '/admin',
    component: DashboardLayout,
    children: [
      {
        path: '',
        component: Folders
      },
      {
        path: 'scanner',
        component: Scanner
      },
      {
        path: 'advanced',
        component: Advanced
      },
      {
        path: 'usermanage',
        component: UserManage
      }
    ]
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        redirect: {
          path: 'works'
        }
      },
      {
        path: 'works',
        component: Works
      },
      {
        path: 'work/:id',
        component: Work
      },
      // {
      //   path: 'search/:keyword?',
      //   component: Works
      // },
      {
        path: 'works/circle/:id',
        props: { restrict: "circle" },
        component: Works
      },
      {
        path: 'works/tag/:id',
        props: { restrict: "tag" },
        component: Works
      },
      {
        path: 'works/va/:id',
        props: { restrict: "va" },
        component: Works
      },
      {
        path: '/mylist',
        name: 'mylist',
        component: MyList
      },
      {
        path: '/mylist/:listId',
        name: 'mylistwork',
        props: true,
        component: MyListWork,
        children: [
          {
            path: 'add/works',
            name: 'mylist-works',
            component: Works,
            props: {
              mode: 'add-mylist'
            }
          },
          {
            path: 'add/works/circle/:id',
            name: 'mylist-works-circle',
            component: Works,
            props: {
              mode: 'add-mylist',
              restrict: 'circle'
            }
          },
          {
            path: 'add/works/tag/:id',
            name: 'mylist-works-tag',
            component: Works,
            props: {
              mode: 'add-mylist',
              restrict: 'tag'
            }
          },
          {
            path: 'add/works/va/:id',
            name: 'mylist-works-va',
            component: Works,
            props: {
              mode: 'add-mylist',
              restrict: 'va'
            }
          }
        ]
      },
      {
        path: 'circles',
        props: { restrict: "circle" },
        component: Labels
      },
      {
        path: 'tags',
        props: { restrict: "tag" },
        component: Labels
      },
      {
        path: 'vas',
        props: { restrict: "va" },
        component: Labels
      },
      {
        path: 'playlist',
        component: PlayList,
        children: [
          {
            path: 'add',
            component: Works,
            props: {
              mode: 'add-playlist'
          }
          }
        ]
      }
    ],
    meta: {
      auth: true
    }
  },
  {
    path: '/login',
    component: Login
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
