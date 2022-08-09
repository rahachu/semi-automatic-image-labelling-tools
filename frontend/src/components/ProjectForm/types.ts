import { ProjectDetail } from "@/types/Project"
import { User } from "@/types/User"
import { Dispatch, SetStateAction } from "react"

export type ProjectFormProps = {
    title?: string,
    projectData: ProjectDetail,
    updateProjectData: Dispatch<SetStateAction<ProjectDetail>>,
    users: User[],
    onSaveHandler: () => void,
    isCreate?: boolean,
    dropdownMenus?: {
        label: string,
        onClick: () => void
    }[]
}
