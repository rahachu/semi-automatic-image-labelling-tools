export type regions = {
    id: string | number,
    cls?: string,
    color?: string,
    tags?: Array<string>,
    type: 'point' | 'box' | 'polygon'
}

export type Point = regions & {
    type: 'point',
    x: number, // [0-1] % of image width
    y: number, // [0-1] % of image height
}

export type Box = regions & {
    type: 'box',
    x: number, // [0-1] % of image width
    y: number, // [0-1] % of image height
    w: number, // [0-1] % of image width
    h: number, // [0-1] % of image height
}

export type Polygon = regions & {
    type: 'polygon',
    open?: boolean, // should last and first points be connected, default: true
    points: Array<[number, number]> // [0-1] % of image width/height
}

export type AnnotatorProps = {
    taskDescription?: string, // markdown
    regionTagList?: Array<string>,
    regionClsList?: Array<string>,
    imageTagList?: Array<string>,
    imageClsList?: Array<string>,
    // all tools are enabled by default
    enabledTools?: Array< "select" | "create-point" | "create-box" | "create-polygon" | "create-line">,
    selectedImage?: string, // initial selected image
    images: Array<{
        src: string,
        thumbnailSrc?: string, // use this if you are using high-res images
        name: string,
        regions?: Array<Point | Box | Polygon>
    }>,
    onExit?: (output: any) => void,
    hideHeader?: boolean,
    hideHeaderText?: boolean,
    hideNext?: boolean,
    hidePrev?: boolean,
    hideClone?: boolean,
    hideSettings?: boolean,
    hideFullScreen?: boolean,
    hideSave?: boolean,
}