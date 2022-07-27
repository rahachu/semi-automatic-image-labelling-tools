import Layout from '@/components/pages/Layout'
import ProjectsPage from '@/components/pages/ProjectsPage'
import axiosInstance from '@/lib/axios'
import { NextPageWithLayout } from '@/types/NextPageWithLayout'
import { Project } from '@/types/Project'
import gsspAuth from '@/lib/gsspAuth'
import router from 'next/router'

type ProjectPageProps = {
  projects: Array<Project>
}

const ProjectPage: NextPageWithLayout<ProjectPageProps> = (props) => {
  const actionButtonProps = {
    onClick: (id: number) => () => {
      router.push({
        pathname: `/project/detail`,
        query: {
          identifier: id
        }
      })
    },
    text: 'Detail'
  }
  return <ProjectsPage projects={props.projects} actionButtonProps={actionButtonProps} />
}

ProjectPage.getLayout = (page, props) => {
  return <Layout user={props.user}>
    {page}
  </Layout>
}

export const getServerSideProps = gsspAuth<ProjectPageProps>(async function ({
  req,
}) {
  let projects: Array<Project> = []
  try {
    const { data } = await axiosInstance.get('/api/project/annotate', {
      headers: {
        Cookie: req.headers.cookie || ''
      }
    })
    projects = data
  } catch (error) {
    console.log(error)
  }

  return {
    props: { projects },
  }
})

export default ProjectPage
