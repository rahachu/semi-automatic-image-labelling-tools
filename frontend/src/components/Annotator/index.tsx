//@ts-ignore
import ReactImageAnnotate from "react-image-annotate";
import React, { StrictMode } from "react";
import { AnnotatorProps } from "./types";

const Annotator = (props: AnnotatorProps) => {
    return (
        <StrictMode>
            <ReactImageAnnotate {...props} />
        </StrictMode>
    );
};

export default Annotator;
