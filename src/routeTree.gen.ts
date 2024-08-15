/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as RecipesImport } from './routes/recipes'
import { Route as LoginImport } from './routes/login'
import { Route as AuthImport } from './routes/_auth'
import { Route as AuthIndexImport } from './routes/_auth/index'
import { Route as RecipesUsernameSlugImport } from './routes/recipes_/$username.$slug'
import { Route as RecipesUsernameSlugEditImport } from './routes/recipes_/$username.$slug_/edit'

// Create/Update Routes

const RecipesRoute = RecipesImport.update({
  path: '/recipes',
  getParentRoute: () => rootRoute,
} as any)

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const AuthRoute = AuthImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any)

const AuthIndexRoute = AuthIndexImport.update({
  path: '/',
  getParentRoute: () => AuthRoute,
} as any)

const RecipesUsernameSlugRoute = RecipesUsernameSlugImport.update({
  path: '/recipes/$username/$slug',
  getParentRoute: () => rootRoute,
} as any)

const RecipesUsernameSlugEditRoute = RecipesUsernameSlugEditImport.update({
  path: '/recipes/$username/$slug/edit',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_auth': {
      id: '/_auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/recipes': {
      id: '/recipes'
      path: '/recipes'
      fullPath: '/recipes'
      preLoaderRoute: typeof RecipesImport
      parentRoute: typeof rootRoute
    }
    '/_auth/': {
      id: '/_auth/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthIndexImport
      parentRoute: typeof AuthImport
    }
    '/recipes/$username/$slug': {
      id: '/recipes/$username/$slug'
      path: '/recipes/$username/$slug'
      fullPath: '/recipes/$username/$slug'
      preLoaderRoute: typeof RecipesUsernameSlugImport
      parentRoute: typeof rootRoute
    }
    '/recipes/$username/$slug/edit': {
      id: '/recipes/$username/$slug/edit'
      path: '/recipes/$username/$slug/edit'
      fullPath: '/recipes/$username/$slug/edit'
      preLoaderRoute: typeof RecipesUsernameSlugEditImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  AuthRoute: AuthRoute.addChildren({ AuthIndexRoute }),
  LoginRoute,
  RecipesRoute,
  RecipesUsernameSlugRoute,
  RecipesUsernameSlugEditRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_auth",
        "/login",
        "/recipes",
        "/recipes/$username/$slug",
        "/recipes/$username/$slug/edit"
      ]
    },
    "/_auth": {
      "filePath": "_auth.tsx",
      "children": [
        "/_auth/"
      ]
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/recipes": {
      "filePath": "recipes.tsx"
    },
    "/_auth/": {
      "filePath": "_auth/index.tsx",
      "parent": "/_auth"
    },
    "/recipes/$username/$slug": {
      "filePath": "recipes_/$username.$slug.tsx"
    },
    "/recipes/$username/$slug/edit": {
      "filePath": "recipes_/$username.$slug_/edit.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
