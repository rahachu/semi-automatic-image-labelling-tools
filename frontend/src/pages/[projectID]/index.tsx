import Layout from "@/components/pages/Layout";
import ProjectForm from "@/components/ProjectForm";
import axiosInstance from "@/lib/axios";
import gsspAuth from "@/lib/gsspAuth";
import { NextPageWithLayout } from "@/types/NextPageWithLayout";
import { ProjectDetail } from "@/types/Project";
import { User } from "@/types/User";
import router from "next/router";
import { useState } from "react";

type ProjectDetailProps = {
    project: ProjectDetail,
    users: User[]
}

const ProjectDetailPage: NextPageWithLayout<ProjectDetailProps> = ({
    project,
    users
}) => {
    const [ projectData, updateProjectData ] = useState<ProjectDetail>(project)
    const saveProjectHandler = () => {
        const putData: any = projectData
        putData.annotators = projectData.annotators.map(o => o.id)
        axiosInstance.put(`/backend/api/project/${project.id}/`, putData).then(() => {
            router.push('/')
        })
        .catch(() => {
            alert('Terjadi kesalahan sistem')
        })
    }

    const dropdownMenus = [
        {
            label: 'Daftar Citra',
            onClick: () => {
                router.push(`/${project.id}/images`)
            }
        },
        {
            label: 'Hapus Proyek',
            onClick: () => {
                axiosInstance.delete(`/backend/api/project/${project.id}`).then(() => {
                    router.push('/')
                })
                .catch(() => {
                    alert('Terjadi kesalahan sistem')
                })
            }
        }
    ]

    return <>
        <ProjectForm
            title={`Sunting ${project.title}`}
            projectData={projectData}
            updateProjectData={updateProjectData}
            users={users}
            onSaveHandler={saveProjectHandler}
            dropdownMenus={dropdownMenus}
        />
    </>
}

ProjectDetailPage.getLayout = (page, props) => {
    return <Layout user={props.user}>
      {page}
    </Layout>
}

export const getServerSideProps = gsspAuth<ProjectDetailProps>(async ({
    query,
    req
}) => {
    const { projectID } = query
    let projectDetail: ProjectDetail
    let users: User[]
    try {
        const { data } = await axiosInstance.get(`/users/`, {
        headers: {
            Cookie: req.headers.cookie || ''
        }
        })
        users = data
    } catch (error) {
        console.log(error)
        return {
            notFound: true
        }
    }
    try {
        const { data } = await axiosInstance.get(`/api/project/${projectID}`, {
        headers: {
            Cookie: req.headers.cookie || ''
        }
        })
        projectDetail = data
    } catch (error) {
        console.log(error)
        return {
            notFound: true
        }
    }
    return {
        props: {
            project: projectDetail,
            users: users
        }
    }
})

export default ProjectDetailPage;