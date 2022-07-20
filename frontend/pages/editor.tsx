import { NextPage } from "next";
import dynamic from "next/dynamic";

const EditorPageComponent = dynamic(
    () => import("@/pages/EditorPage"),
    {
        ssr: false
    }
)

const EditorPage: NextPage = () => (
    <EditorPageComponent/>
);

export default EditorPage;