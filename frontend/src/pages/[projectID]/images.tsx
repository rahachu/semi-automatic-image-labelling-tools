import Layout from "@/components/pages/Layout";
import gsspAuth from "@/lib/gsspAuth";
import { NextPageWithLayout } from "@/types/NextPageWithLayout";
import ImagesPageComponent from "@/components/pages/ImagesPage";

type ImagesProps = {
    projectID: number
}

const ImagesPage: NextPageWithLayout<ImagesProps> = ({
    projectID
}) => {

    return <ImagesPageComponent projectID={projectID} />
}

ImagesPage.getLayout = (page, props) => {
    return <Layout user={props.user}>
      {page}
    </Layout>
}

export const getServerSideProps = gsspAuth<ImagesProps>(({
    query
}) => {
    const { projectID } = query
    return {
        props: {
            projectID: parseInt(projectID as string)
        }
    }
})

export default ImagesPage;