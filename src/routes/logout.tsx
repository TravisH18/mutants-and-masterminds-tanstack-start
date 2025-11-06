import { redirect, createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useAppSession } from '~/utils/session'

const logoutFn = createServerFn().handler(async () => {
  const session = await useAppSession()

  await session.clear()

  throw redirect({
    to: '/',
  })
})

export const Route = createFileRoute('/logout')({
  preload: false,
  loader: () => logoutFn(),
})