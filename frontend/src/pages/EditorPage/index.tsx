import Annotator from "@/components/Annotator";
import { EditorWrapper } from "./styles";

const EditorPage = () => {
    return (
        <EditorWrapper>
            <Annotator
                regionClsList={["Alpha", "Beta", "Charlie", "Delta", "epsilon"]}
                images={[
                    {
                        src: "https://placekitten.com/408/287",
                        name: "Image 1",
                        regions: [],
                    },
                ]}
                onExit={(output) => console.log(JSON.stringify(output))}
            />
        </EditorWrapper>
    )
};

export default EditorPage;