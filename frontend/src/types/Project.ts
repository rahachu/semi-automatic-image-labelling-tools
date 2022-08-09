import { User } from "./User"

export type Project = {
    id: number,
    title: string
    description: string,
    class_list: string[],
    class_num: number,
    annotation_type: 'Polygon' | 'Point' | 'Bounding Box'
}

export type ProjectDetail = {
    id: number,
    title: string
    description: string,
    class_list: string[],
    class_num: number,
    annotation_type: 'PL' | 'PT' | 'BB',
    owner?: User,
    annotators: User[],
    is_video?: boolean,
    auto_annotate: boolean,
    file_weight?: string
}
