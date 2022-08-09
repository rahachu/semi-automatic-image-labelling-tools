import { faCaretDown, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo, useState } from 'react';
import {
    CaretButton, ClassChip, ClassContainer, FormTitle,
    ProjectFormContainer, ProjectFormHeader, ProjectFormInput,
    ProjectFormLabel, ProjectFormSelect, ProjectFormTextArea,
    ProjectFormWrapper, RemoveClass, SaveButton, Switch, UserSelect,
    DropdownMenu,
    DropdownWrapper
} from "./styles"
import { ProjectFormProps } from "./types"

const ProjectForm = ({
    title = 'Buat Project Baru',
    projectData,
    updateProjectData,
    users,
    onSaveHandler,
    isCreate,
    dropdownMenus
} : ProjectFormProps) => {
    const annotationOptions = [
        { value: 'PL', label: 'Polygon' },
        { value: 'BB', label: 'Bounding Box' },
        { value: 'PT', label: 'Point' }
    ]

    const coco_cls = ['BG', 'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush']


    const onUpdateProjectData = (value: object) => {
        updateProjectData(prevState => ({
            ...prevState,
            ...value
        }))
    }

    const [ userFilter, setUserFilter ] = useState('')
    const filteredUser = useMemo(() => users.filter((user) => (
        user.username.toUpperCase().indexOf(userFilter.toUpperCase()) > -1
        && projectData.annotators.findIndex(u => u.username == user.username) == -1
    )), [userFilter, projectData])

    return <ProjectFormContainer>
        <ProjectFormHeader>
            <FormTitle>{title}</FormTitle>
            <div>
                <SaveButton onClick={onSaveHandler} isCreate={isCreate}>
                    {isCreate ? 'Buat Proyek' : 'Simpan'}
                </SaveButton>
                {!isCreate && dropdownMenus && <DropdownWrapper>
                    <CaretButton>
                        <FontAwesomeIcon icon={faCaretDown} />
                    </CaretButton>
                    <DropdownMenu>
                        <a href={`/backend/api/project/${projectData.id}/export?toformat=coco`} download>Export to COCO</a>
                        <a href={`/backend/api/project/${projectData.id}/export?toformat=yolo`} download>Export to YOLO</a>
                        {dropdownMenus.map(menu => (
                            <button onClick={menu.onClick}>{menu.label}</button>
                        ))}
                    </DropdownMenu>
                </DropdownWrapper>}
            </div>
        </ProjectFormHeader>
        <ProjectFormWrapper>
            <ProjectFormLabel>Judul Proyek</ProjectFormLabel>
            <ProjectFormInput
                type="text"
                value={projectData.title}
                onChange={(e) => {
                    onUpdateProjectData({
                        title: e.target.value
                    })
                }}
                placeholder="Project Title"
                required
            />
        </ProjectFormWrapper>
        <ProjectFormWrapper>
            <ProjectFormLabel>Deskripsi Proyek</ProjectFormLabel>
            <ProjectFormTextArea
                placeholder="Project Description"
                value={projectData.description}
                onChange={(e) => {
                    onUpdateProjectData({
                        description: e.target.value
                    })
                }}
                required
            />
        </ProjectFormWrapper>
        <ProjectFormWrapper>
            <ProjectFormLabel>Jenis Anotasi</ProjectFormLabel>
            <ProjectFormSelect onChange={(e) => {
                onUpdateProjectData({
                    annotation_type: e.target.value
                })
            }} defaultValue={projectData.annotation_type} disabled={!isCreate}>
                {annotationOptions.map((annotationOption, i) => (
                    <option
                        value={annotationOption.value}
                        key={i}
                    >
                        {annotationOption.label}
                    </option>
                ))}
            </ProjectFormSelect>
        </ProjectFormWrapper>
        <ProjectFormWrapper>
            <ProjectFormLabel>Daftar Pelabel</ProjectFormLabel>
            <ClassContainer>
                {projectData.annotators.map((ann) => (
                    <ClassChip>
                        {ann.username}
                        <RemoveClass
                            onClick={() => onUpdateProjectData({
                                classList: projectData.annotators.splice(
                                    projectData.annotators.indexOf(ann), 1
                                )
                            })}
                        >
                            <FontAwesomeIcon icon={faX} size='xs' />
                        </RemoveClass>
                    </ClassChip>
                ))}
            </ClassContainer>
            <ProjectFormInput
                type="text"
                placeholder="Annotator Username"
                onChange={(e) => {
                    setUserFilter(e.currentTarget.value)
                }}
            />
            <div>
                {filteredUser.slice(0, 10).map((user) => {
                    return <UserSelect
                        onClick={() => onUpdateProjectData({
                            annotators: projectData.annotators.concat([user])
                        })}
                    >{user.username} - {user.email}</UserSelect>
                })}
            </div>
        </ProjectFormWrapper>
        <ProjectFormWrapper>
            <Switch>
                <input
                    type="checkbox"
                    defaultChecked={projectData.auto_annotate}
                    onChange={(e) => {
                        if (projectData.class_list.length <= 1 && e.target.checked) {
                            projectData.class_list = coco_cls
                        }
                        onUpdateProjectData({
                            auto_annotate: e.currentTarget.checked
                        })
                    }}
                />
                <span/>
            </Switch>
            <span style={{margin: 8}}>Anotasi Otomatis</span>
            {projectData.auto_annotate && <div style={{margin: 8}}>
                <span style={{margin: 8}}>File Model Weight in .h5 : </span>
                <input type='file' accept='.h5' />
                <div style={{margin: 8}}>Jika tidak disediakan maka menggunakan model pretrain dengan COCO dataset</div>
            </div>}
        </ProjectFormWrapper>
        <ProjectFormWrapper>
            <ProjectFormLabel>Daftar Kelas</ProjectFormLabel>
            <ClassContainer>
                {projectData.class_list.slice(1).map((cls) => (
                    <ClassChip>
                        {cls}
                        <RemoveClass
                            onClick={() => onUpdateProjectData({
                                class_list: projectData.class_list.splice(
                                    projectData.class_list.indexOf(cls), 1
                                )
                            })}
                        >
                            <FontAwesomeIcon icon={faX} size='xs' />
                        </RemoveClass>
                    </ClassChip>
                ))}
                {projectData.class_list.length > 1 &&
                    <ClassChip as="button" style={{ cursor: 'pointer' }} onClick={() => onUpdateProjectData({
                        class_list: ['BG']
                    })}>Hapus semua</ClassChip>
                }
            </ClassContainer>
            <ProjectFormInput
                type="text"
                placeholder="Class Name"
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        projectData.class_list.push(e.currentTarget.value)
                        onUpdateProjectData({
                            class_num: projectData.class_list.length
                        })
                        e.currentTarget.value = ''
                    }
                }}
            />
        </ProjectFormWrapper>
    </ProjectFormContainer>
}

export default ProjectForm