/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import AuthedNav from '~/components/AuthedNav'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { ModeToggle } from '~/components/mode-toggle'
import { NotFound } from '~/components/NotFound'
import { ThemeProvider } from '~/components/theme-provider'
import appCss from '~/styles/app.css?url'
import { seo } from '~/utils/seo'
import { getSupabaseServerClient } from '~/utils/supabase'
import { createServerFn } from '@tanstack/react-start'

const fetchUser = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = getSupabaseServerClient()
  const { data, error: _error} = await supabase.auth.getUser()

  if(!data.user?.id) {
    return null
  }

  return {
    id: data.user.id,
    email: data.user.email
  }
})


export const Route = createRootRoute({
  beforeLoad: async () => {
    const user = await fetchUser()
    console.log("User", user)
    return {
      user,
    }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title:
          'TanStack Start | Type-Safe, Client-First, Full-Stack React Framework',
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
    // scripts: [
    //   {
    //     src: '/customScript.js',
    //     type: 'text/javascript',
    //   },
    // ],
  }),
  errorComponent: (props) => {
    return (
      <div>
        <DefaultCatchBoundary {...props} />
      </div>
    )
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { user } = Route.useRouteContext()

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="p-2 flex gap-2 text-lg">
          <ModeToggle />
          <Link
            to="/"
            activeProps={{
              className: 'font-bold',
            }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>{' '}
          {user ? (<AuthedNav />) : ''}
          <div className='ml-auto'>
            {user ? (
              <>
                <span className='mr-2'>{user.email}</span>
                <Link to='/logout'>Logout</Link>
              </>
            ): (
              <Link to='/login'>Login</Link>
            )}
          </div>
        </div>
        <hr />
        <ThemeProvider defaultTheme='dark' storageKey='theme'>
          {children}
        </ThemeProvider>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}
