import { ProjectDetail } from "./Project"
import { User } from "./User"
import { Polygon, Box } from "@/components/Annotator/types";

export type Image = {
    id: number,
    file: string,
    upload_date: string,
    annotate_at: string,
    annotate_by?: User
}

export type ImageDetail = {
    id: number,
    file: string,
    upload_date: string,
    annotate_at: string,
    annotate_by?: User
    project: ProjectDetail,
    polygons: Polygon[],
    boxes: Box[]
}
