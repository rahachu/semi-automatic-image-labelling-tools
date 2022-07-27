import axiosInstance from "@/lib/axios";
import gsspAuth from "@/lib/gsspAuth";
import { ImageDetail } from "@/types/Image";
import { NextPage } from "next";
import dynamic from "next/dynamic";

const EditorPageComponent = dynamic(
    () => import("@/components/pages/EditorPage"),
    {
        ssr: false
    }
)

type ProjectEditorPageProps = {
    imageDetail: ImageDetail
}

const EditorPage: NextPage<ProjectEditorPageProps> = ({ imageDetail }: ProjectEditorPageProps) => (
    <EditorPageComponent imageDetail={imageDetail}/>
);

export const getServerSideProps = gsspAuth<ProjectEditorPageProps>(async function ({
    req, query
  }) {
      const { identifier } = query
      let imageDetail: ImageDetail
      try {
          const { data } = await axiosInstance.get(`/api/image/${identifier}`, {
          headers: {
              Cookie: req.headers.cookie || ''
          }
          })
          imageDetail = data
      } catch (error) {
          console.log(error)
          return {
              notFound: true
          }
      }
  
      return {
          props: { imageDetail },
      }
  })

export default EditorPage;
