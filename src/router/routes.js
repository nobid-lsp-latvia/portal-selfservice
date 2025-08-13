// SPDX-License-Identifier: EUPL-1.2

/**
 * @typedef {Object} CustomMetaProps
 * @property {(i18n: ReturnType<typeof import('vue-i18n').useI18n>) => string} [title]
 * @property {boolean} [canGoBack] - if true, the route will have a back button
 * @property {string} [backRouteName] - name of the route to go back to
 * @property {boolean} [anonymous] - if true, the route is accessible also for anonymous users
 * @property {boolean} [onlyAnonymous] - if true, the route is accessible only for anonymous users
 * @property {{ text: string, to: import('vue-router').RouteLocationRaw }[]} [breadcrumbs] - array of breadcrumbs
 * @property {(rights: ReturnType<typeof import('@/hooks/useRights').default>) => boolean} [access] - route access function that returns true if the user has access to the route
 */
/**
 * @typedef {import('vue-router').RouteRecordRaw & { meta?: CustomMetaProps, children?: CustomRoute[] }} CustomRoute
 */

/** @type {CustomRoute[]} */
const routes = [
  {
    path: '/:lang(en)?',
    name: 'home',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: {
      title: (i18n) => i18n.t('pages.home.title'),
    },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: {
          title: (i18n) => i18n.t('pages.dashboard.title'),
          access: (rights) => rights.isAuthorized(),
        },
        component: () => import('@/views/Dashboard.vue'),
      },
      {
        path: 'registration',
        name: 'registration',
        meta: {
          title: (i18n) => i18n.t('pages.dashboard.title'),
          access: (rights) => rights.isAuthorized(),
        },
        component: () => import('@/views/Registration.vue'),
      },
      {
        path: 'activate',
        name: 'activate',
        meta: {
          title: (i18n) => i18n.t('pages.activate.title'),
          access: (rights) => rights.isAuthorized(),
          breadcrumbs: [
            {
              text: 'pages.dashboard.title',
              to: { name: 'dashboard' },
            },
          ],
        },
        component: () => import('@/views/Activate.vue'),
      },
      {
        path: 'documents',
        name: 'documents',
        meta: {
          title: (i18n) => i18n.t('pages.documents.title'),
          access: (rights) => rights.isAuthorized(),
          breadcrumbs: [
            {
              text: 'pages.dashboard.title',
              to: { name: 'dashboard' },
            },
          ],
        },
        component: () => import('@/views/List.vue'),
      },
      {
        path: 'documents/:id',
        name: 'document',
        meta: {
          title: (i18n) => i18n.t('pages.documents.title'),
          access: (rights) => rights.isAuthorized(),
          breadcrumbs: [
            {
              text: 'pages.documents.title',
              to: { name: 'documents' },
            },
          ],
        },
        component: () => import('@/views/View.vue'),
      },
      {
        path: 'privacy',
        name: 'privacy',
        meta: {
          title: (i18n) => i18n.t('pages.privacy.title'),
          access: (rights) => rights.isAuthorized(),
        },
        component: () => import('@/views/Privacy.vue'),
      },
      {
        path: 'help',
        name: 'help',
        meta: {
          title: (i18n) => i18n.t('pages.help.title'),
          breadcrumbs: [
            {
              text: 'pages.dashboard.title',
              to: { name: 'dashboard' },
            },
          ],
        },
        component: () => import('@/views/Help.vue'),
      },
      {
        path: 'loading',
        name: 'loading',
        meta: {
          title: () => '',
        },
        component: () => import('@/views/Loading.vue'),
      },
      {
        path: '/auth-done',
        name: 'authDone',
        component: () => import('@/views/AuthDone.vue'),
        meta: {
          title: (i18n) => i18n.t('pages.auth.title'),
          anonymous: true,
        },
      },
      {
        path: 'sessionEnded',
        name: 'sessionEnded',
        component: () => import('@/views/SessionEnded.vue'),
        meta: {
          title: (i18n) => i18n.t('pages.sessionEnded.title'),
          anonymous: true,
        },
      },
      {
        path: 'error',
        name: 'error',
        component: () => import('@/views/Error404.vue'),
        meta: { anonymous: true },
      },
      {
        path: 'forbidden',
        name: 'forbidden',
        component: () => import('@/views/Error403.vue'),
        meta: { anonymous: true },
      },
      {
        path: 'not-authorized',
        name: 'notAuthorized',
        component: () => import('@/views/Error401.vue'),
        meta: { anonymous: true },
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        alias: 'notFound',
        meta: { title: (i18n) => i18n.t('pages.notFound.title'), anonymous: true },
        component: () => import('@/views/NotFound.vue'),
      },
    ],
  },
];

export default routes;
