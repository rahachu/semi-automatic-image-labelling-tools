import axiosInstance from "@/lib/axios"
import { Image } from "@/types/Image"
import { useRouter } from "next/router"
import { ChangeEventHandler, useEffect, useState } from "react"
import { Button, DetailContainer, DetailName, DetailValue, ImageCard, ImageFile, ImagesContainer } from "./styles"
import { ProjectDetailPageProps } from "./types"

const ProjectDetailPage = ({
    project
}: ProjectDetailPageProps) => {
    const router = useRouter()
    const [images, setImages] = useState<Image[]>([])
    const [loading, setLoading] = useState(true)
    const [annotated, setAnnotated] = useState('false')

    const onChangeSelect: ChangeEventHandler<HTMLSelectElement> = (e) => {
        setAnnotated(e.currentTarget.value)
    }

    const onClickAnnotate = (id: number) => () => {
        router.push({
          pathname: `/project/editor`,
          query: {
            identifier: id
          }
        })
      }

    useEffect(() => {
        setLoading(true)
        axiosInstance.get(`/backend/api/project/${project.id}/images?annotated=${annotated}`).then(res => {
            if (res.status == 200) {
                setImages(res.data.results)
            }
            setLoading(false)
        })
    }, [annotated])
    return <div style={{ padding: 16 }}>
        <h2>{project.title}</h2>
        <p>{project.description}</p>
        <DetailContainer>
            <DetailName>
                Pemilik Proyek:
            </DetailName>
            <DetailValue>
                {project.owner.username} <br />
                <a href={`mailto:${project.owner.email}`}>{project.owner.email}</a>
            </DetailValue>
        </DetailContainer>
        <DetailContainer>
            <DetailName>
                Jenis Label:
            </DetailName>
            <DetailValue>
                {project.annotation_type}
            </DetailValue>
        </DetailContainer>
        <DetailContainer>
            <DetailName>
                Jenis Data:
            </DetailName>
            <DetailValue>
                {project.is_video ? 'Video' : 'Citra'}
            </DetailValue>
        </DetailContainer>
        <DetailContainer>
            <DetailName>
                Daftar Kelas:
            </DetailName>
            <DetailValue>
                <ul style={{margin: 0, paddingLeft: '1em'}}>
                    {project.class_list.map((className, i) => (
                        <li key={i}>{className}</li>
                    ))}
                </ul>
            </DetailValue>
        </DetailContainer>
        <h2>Daftar Gambar</h2>
        <select onChange={onChangeSelect}>
            <option value='false'>Belum Teranotasi</option>
            <option value='true'>Sudah Teranotasi</option>
        </select>
        {loading
            ? (<div>Loading...</div>)
            : (<ImagesContainer>
                {images.map((image, i) => (
                    <ImageCard key={i}>
                        <ImageFile src={image.file} alt={image.file} width={360} height={180} />
                        {annotated == 'true'
                            ? (<>
                                <div>Annotasi pada: {new Date(image.annotate_at).toUTCString()}</div>
                                <div>Oleh: {image.annotate_by?.email}</div>
                            </>)
                            : (<div>Upload pada: {new Date(image.upload_date).toUTCString()}</div>)
                        }
                        <Button onClick={onClickAnnotate(image.id)}>
                            {annotated == 'true' ? 'Edit' : 'Annotasi'}
                        </Button>
                    </ImageCard>
                ))}
                {images.length == 0 && (<div>Tidak ada gambar</div>)}
            </ImagesContainer>)
        }
    </div>
}

export default ProjectDetailPage