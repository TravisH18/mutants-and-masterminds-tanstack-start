import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { hashPassword, prismaClient } from '~/utils/prisma'
import { Login } from '~/components/Login'
import { getCurrentUserFn, useAppSession } from '~/utils/session'

export const loginFn = createServerFn({ method: 'POST' })
    .inputValidator((d: { email: string; password: string }) => d)
    .handler(async ({ data }) => {
        // Find the user
        const user = await prismaClient.user.findUnique({
            where: {
                email: data.email,
            },
        })

        // Check if the user exists
        if (!user) {
            return {
                error: true,
                userNotFound: true,
                message: 'User not found',
            }
        }

        // Check if the password is correct
        const hashedPassword = await hashPassword(data.password)

        if (user.password !== hashedPassword) {
            return {
                error: true,
                message: 'Incorrect password',
            }
        }

        // Create a session
        const session = await useAppSession()

        // Store the user's email in the session
        await session.update({
            userEmail: user.email,
            userId: user.id.toString(),
        })

        throw redirect({ to: '/dashboard' })
    })

export const Route = createFileRoute('/_authed')({
    beforeLoad: async ({ location }) => {
        const user = await getCurrentUserFn()
        // if (!context.user) {
        //     throw new Error('Not authenticated')
        // }
        if (!user) {
            throw new Error('Not authenticated')
            // throw redirect({
            //     to: '/login',
            //     search: { redirect: location.href },
            // })
        }

        return { user }
    },
    errorComponent: ({ error }) => {
        if (error.message === 'Not authenticated') {
            return <Login />
        }

        throw error
    },
})