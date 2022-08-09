import { Project } from "@/types/Project"

export type ProjectsPageProps = {
    title?: string,
    projects: Array<Project>,
    actionButtonProps?: {
        text: string,
        onClick: (id: number) => (() => void)
    },
    isOwner?: boolean
}