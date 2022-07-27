import Layout from '@/components/pages/Layout'
import ProjectDetailPageComponent from '@/components/pages/ProjectDetailPage'
import axiosInstance from '@/lib/axios'
import { NextPageWithLayout } from '@/types/NextPageWithLayout'
import { ProjectDetail } from '@/types/Project'
import gsspAuth from '@/lib/gsspAuth'

type ProjectDetailPageProps = {
  projectDetail: ProjectDetail
}

const ProjectDetailPage: NextPageWithLayout<ProjectDetailPageProps> = (props) => {
  return <ProjectDetailPageComponent project={props.projectDetail} />
}

ProjectDetailPage.getLayout = (page, props) => {
  return <Layout user={props.user}>
    {page}
  </Layout>
}

export const getServerSideProps = gsspAuth<ProjectDetailPageProps>(async function ({
  req, query
}) {
    const { identifier } = query
    let projectDetail: ProjectDetail
    try {
        const { data } = await axiosInstance.get(`/api/project/${identifier}/`, {
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
        props: { projectDetail },
    }
})

export default ProjectDetailPage
