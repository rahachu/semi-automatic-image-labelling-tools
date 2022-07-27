import { GSSPAuthProps } from "@/lib/gsspAuth"
import { NextPage } from "next"
import { ReactElement, ReactNode } from "react"

export type NextPageWithLayout<P = {}> = NextPage<P, P> & {
    getLayout?: (page: ReactElement, props: P & GSSPAuthProps)  => ReactNode
}