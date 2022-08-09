import Layout from '@/components/pages/Layout'
import ProjectsPage from '@/components/pages/ProjectsPage'
import axiosInstance from '@/lib/axios'
import { NextPageWithLayout } from '@/types/NextPageWithLayout'
import { Project } from '@/types/Project'
import gsspAuth from '@/lib/gsspAuth'
import router from 'next/router'

type HomePageProps = {
  projects: Array<Project>
}

const Home: NextPageWithLayout<HomePageProps> = (props) => {
  const actionButtonProps = {
    onClick: (id: number) => () => {
      router.push({
        pathname: `/${id}`,
      })
    },
    text: 'Edit'
  }
  return <ProjectsPage projects={props.projects} actionButtonProps={actionButtonProps} isOwner />
}

Home.getLayout = (page, props) => {
  return <Layout user={props.user}>
    {page}
  </Layout>
}

export const getServerSideProps = gsspAuth<HomePageProps>(async function ({
  req,
  res,
}) {
  let projects: Array<Project> = []
  try {
    const { data } = await axiosInstance.get('/api/project', {
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

export default Home
