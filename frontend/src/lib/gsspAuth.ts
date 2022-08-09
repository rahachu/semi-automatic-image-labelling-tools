import { User } from "@/types/User"
import { withIronSessionSsr } from "iron-session/next"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import axiosInstance from "./axios";
import { sessionOptions } from "./session"

type GSSPCallback<P extends {} = any> = (
    context: GetServerSidePropsContext
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>;

export type GSSPAuthProps = {
    user: User
}

const defaultCallback: any = () => ({ props: {} })

const getServerSideProps = <P extends {} = any>(
    callback: GSSPCallback<P> = defaultCallback
) => withIronSessionSsr<GSSPAuthProps & P>(async (ctx) => {
    const user = ctx.req.session.user
    if (user === undefined || !user.isLoggedIn) {
        return {
            props: {
                user: { isLoggedIn: false } as User
            },
            redirect: {
                statusCode: 302,
                destination: '/login'
            }
        }
    }

    const accessToken = ctx.req.session.access
    if (accessToken) {
        const bearer = `Bearer ${accessToken}`
        axiosInstance.defaults.headers.common['Authorization'] = bearer
    }
    axiosInstance.defaults.headers.common['cookie'] =  ctx.req.headers.cookie || ''

    try {
        const { data } = await axiosInstance.get('/api/auth')
        ctx.req.session.user = {
            isLoggedIn: true,
            ...data
        }
        await ctx.req.session.save()
    } catch (error) {
        ctx.req.session.destroy()
        return {
            redirect: {
                statusCode: 302,
                destination: '/login'
            }
        }
    }

    const gsspResult = callback && (await callback(ctx));
    const props = (gsspResult as any)?.props || {}

    return {
        ...gsspResult,
        props: {
            user,
            ...props
        },
    }
}, sessionOptions)

export default getServerSideProps 