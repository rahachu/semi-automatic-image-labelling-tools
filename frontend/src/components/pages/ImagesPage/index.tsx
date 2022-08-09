import { ChangeEventHandler, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Image } from "@/types/Image"
import { ImageDropzone, ImagesPageContainer, SpinningIcon, XButton } from "./styles";
import { ImagesPageProps } from "./types"
import { Button, ImageCard, ImageFile, ImagesContainer } from "../ProjectDetailPage/styles";
import axiosInstance from "@/lib/axios";
import router from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faX } from "@fortawesome/free-solid-svg-icons";

const ImagesPage = ({ projectID }: ImagesPageProps) => {
    const [images, setImages] = useState<Image[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [annotated, setAnnotated] = useState('false')
    const [files, setFiles] = useState<(File & {preview: string})[]>([])

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

    const onUploadClick = async () => {
        setUploading(true)
        for (const file of files) {
            const formData = new FormData()
            formData.append('project', projectID.toString())
            formData.append('file', file, file.name)
            const { status } = await axiosInstance.post(`/backend/api/image`, 
                formData, { headers: { "Content-Type": "multipart/form-data" } })
            if (status == 200) {
                URL.revokeObjectURL(file.preview)
                setFiles(prevState => prevState.filter(o => o.preview != file.preview))
            }
        }
        setUploading(false)
        setLoading(true)
        await axiosInstance.get(`/backend/api/project/${projectID}/images?annotated=${annotated}`).then(res => {
            if (res.status == 200) {
                setImages(res.data.results)
            }
        })
        setLoading(false)
    }

    useEffect(() => {
        setLoading(true)
        axiosInstance.get(`/backend/api/project/${projectID}/images?annotated=${annotated}`).then(res => {
            if (res.status == 200) {
                setImages(res.data.results)
            }
            setLoading(false)
        })
    }, [annotated])

    useEffect(() => {
        return () => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [])

    const {
        getRootProps,
        getInputProps
      } = useDropzone({
        accept: {
          'image/jpeg': [],
        },
        onDrop: acceptedFiles => {
            setFiles(prevState => {
                const newFiles = [...prevState]
                acceptedFiles.map((file) => {
                    if (!newFiles.some(e => e.name === file.name)) {
                        newFiles.push(Object.assign(file, {preview: URL.createObjectURL(file)}))
                    }
                })
                return newFiles
            })
        }
      });
    return <ImagesPageContainer>
        <h3>Unggah Citra di sini</h3>
        <ImageDropzone {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
            <em>(Only *.jpeg images will be accepted)</em>
        </ImageDropzone>
        {files.length > 0 && <div>
            <ImagesContainer>
                {files.map((file, i) => (
                    <ImageCard key={i} style={{ position: 'relative' }}>
                        <XButton onClick={() => {
                            URL.revokeObjectURL(file.preview)
                            setFiles(prevState => prevState.filter(o => o.preview != file.preview))
                        }} disabled={uploading}>
                            <FontAwesomeIcon icon={faX} size="xs"/>
                        </XButton>
                        <img
                            src={file.preview}
                            // Revoke data uri after image is loaded
                            height={150}
                        />
                    </ImageCard>
                ))}
                <Button onClick={onUploadClick} disabled={uploading}>
                    {uploading && <SpinningIcon icon={faSpinner} />}
                    Unggah
                </Button>
            </ImagesContainer>
        </div>}
        <h3>Daftar Gambar terunggah</h3>
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
    </ImagesPageContainer>
}

export default ImagesPage