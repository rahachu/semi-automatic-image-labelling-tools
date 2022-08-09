import Annotator from "@/components/Annotator";
import axiosInstance from "@/lib/axios";
import { ImageDetail } from "@/types/Image";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { EditorWrapper } from "./styles";
import { getClassColor } from "./utils";

type EditorPageProps = {
  imageDetail: ImageDetail
}

const EditorPage = ({ imageDetail }: EditorPageProps) => {
	const router = useRouter()
    
    const sample_cls = ['BG', 'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush']

    const tools: Record<string, ("create-polygon" | "create-point" | "select" | "create-box" | "create-line")> = {
      Polygon: 'create-polygon',
      Point: 'create-point',
      'Bounding Box': 'create-box'
    }

    const classList = imageDetail.project.class_list.slice(1)

    const mappedRegions = useMemo(() => {
		switch (imageDetail.project.annotation_type as string) {
			case 'Polygon':
				if (!imageDetail.polygons) {
					return []
				}
				return imageDetail.polygons.map(poly => ({
					...poly,
					cls: poly.cls || classList[0],
					color: getClassColor(poly.cls, classList)
				}))
			case 'Bounding Box':
				if (!imageDetail.boxes) {
					return []
				}
				return imageDetail.boxes.map(poly => ({
					...poly,
					color: getClassColor(poly.cls, classList)
				}))
		
			default:
			return [];
		}
    }, [imageDetail])

    const fileNames = imageDetail.file.split('/')
    const fileName = fileNames[fileNames.length - 1]

    const handeOnExit = (output: any) => {
      const regionsData = output.images[0].regions
      const patchData: {
        polygons?: any,
        boxes?: any
      } = {}
	  for (const region of regionsData) {
		if (imageDetail.project.class_list.indexOf(region.cls) < 0) {
			alert('Terdapat kelas objek yang tidak terdaftar')
			return
		}
	  }
      if (imageDetail.project.annotation_type as string == 'Polygon') {
        patchData.polygons = regionsData
      }
      if (imageDetail.project.annotation_type as string == 'Bounding Box') {
        patchData.boxes = regionsData
      }
      axiosInstance.patch(`/backend/api/image/${imageDetail.id}/`, patchData)
      .then(() => router.push('/project/detail', {
		query: {
			identifier: imageDetail.project.id
		}
	  }))
	  .catch(() => {
		const leave = confirm('Sesuatu kesalahan terjadi... Ingin meninggalkan laman?')
		if (leave) {
			router.push('/project/detail', {
				query: {
					identifier: imageDetail.project.id
				}
			})
		}
	  })
    }

	console.log(mappedRegions)

    return (
        <EditorWrapper>
            <Annotator
                regionClsList={classList}
                hideNext
                hidePrev
                hideFullScreen
                enabledTools={['select', tools[imageDetail.project.annotation_type]]}
                images={[
                  {
                    src: imageDetail.file,
                    name: `${imageDetail.project.title} - ${fileName}`,
                    regions: mappedRegions
                  }
                    // {
                    //     src: "http://localhost:8000/images/Photo_on_08-07-22_at_18.55_2.jpg",
                    //     name: "Test 1 Update",
                    //     regions: [
                    //         {
                    //             type: "box",
                    //             id: "box0",
                    //             cls: "person",
                    //             x: 0.37430555555555556,
                    //             y: 0.15104166666666666,
                    //             h: 0.8385416666666666,
                    //             w: 0.6034722222222222,
                    //             color: getClassColor('person', sample_cls)
                    //         },
                    //         {
                    //             type: "box",
                    //             id: "box1",
                    //             cls: "person",
                    //             x: 0.001388888888888889,
                    //             y: 0.36666666666666664,
                    //             h: 0.61875,
                    //             w: 0.33958333333333335,
                    //             color: getClassColor('person', sample_cls)
                    //         },
                    //         {
                    //             type: "box",
                    //             id: "box2",
                    //             cls: "bottle",
                    //             x: 0.4041666666666667,
                    //             y: 0.7041666666666667,
                    //             h: 0.153125,
                    //             w: 0.043055555555555555,
                    //             color: getClassColor('bottle', sample_cls)
                    //         }
                    //     ]
                    // }
                ]}
                onExit={handeOnExit}
            />
        </EditorWrapper>
    )
};

export default EditorPage;
