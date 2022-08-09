import Layout from "@/components/pages/Layout";
import ProjectForm from "@/components/ProjectForm";
import axiosInstance from "@/lib/axios";
import gsspAuth from "@/lib/gsspAuth";
import { NextPageWithLayout } from "@/types/NextPageWithLayout";
import { ProjectDetail } from "@/types/Project";
import { User } from "@/types/User";
import { AxiosError } from "axios";
import router from "next/router";
import { useState } from "react";

type CreateProjectProps = {
    users: User[]
}

const CreateProject: NextPageWithLayout<CreateProjectProps> = ({ users }) => {
    const [ projectData, updateProjectData ] = useState<ProjectDetail>({
        id: 0,
        title: '',
        description: '',
        class_list: ['BG'],
        class_num: 1,
        annotators: [],
        auto_annotate: false,
        annotation_type: 'PL'
    })
    const saveProjectHandler = () => {
        const putData: any = projectData
        putData.annotators = projectData.annotators.map(o => o.id)
        axiosInstance.post(`/backend/api/project`, putData).then(() => {
            router.push('/')
        })
        .catch((err: AxiosError) => {
            console.log(err)
            alert(`Terjadi kesalahan sistem ${JSON.stringify(err.response?.data)}`)
        })
    }
    return <>
        <ProjectForm
            projectData={projectData}
            updateProjectData={updateProjectData}
            users={users}
            onSaveHandler={saveProjectHandler}
            isCreate
        />
    </>
}

CreateProject.getLayout = (page, props) => {
    return <Layout user={props.user}>
        {page}
    </Layout>
}

export const getServerSideProps = gsspAuth<CreateProjectProps>(async ({
    query,
    req
}) => {
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
    return {
        props: {
            users: users
        }
    }
})

export default CreateProject;