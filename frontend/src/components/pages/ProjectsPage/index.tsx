import { BodyCell, BodyRow, HeadCell, StyledTable, TableContainer } from "./styles"
import { ProjectsPageProps } from "./types"

const ProjectsPage = ({title = 'Proyek Anotasi Saya', projects, actionButtonProps}: ProjectsPageProps) => {
    if (projects.length == 0) {
        return <div style={{ padding: 16 }}>
            <h2>{title}</h2>
            <p>Anda belum memiliki proyek anotasi sendiri</p>
        </div>
    }
    return (
        <div style={{ padding: 16 }}>
            <h2>{title}</h2>
            <TableContainer>
            <StyledTable>
                <thead>
                    <tr>
                        <HeadCell>Nama Proyek</HeadCell>
                        <HeadCell>Deskripsi</HeadCell>
                        <HeadCell>Jenis Label</HeadCell>
                        <HeadCell>Jumlah Kelas</HeadCell>
                        <HeadCell>Daftar Kelas</HeadCell>
                        {actionButtonProps && <HeadCell>Aksi</HeadCell>}
                    </tr>
                </thead>
                <tbody>
                    {projects.map(project => (
                        <BodyRow key={project.id}>
                            <BodyCell>
                                <p style={{margin: 16}}>{project.title}</p>
                            </BodyCell>
                            <BodyCell><p style={{ textAlign: 'left', margin: 8 }}>
                                {project.description}
                            </p></BodyCell>
                            <BodyCell>
                                <p style={{margin: 16}}>{project.annotation_type}</p>
                            </BodyCell>
                            <BodyCell>
                                <p style={{margin: 16}}>{project.class_num}</p>
                            </BodyCell>
                            <BodyCell>
                                <ul style={{ textAlign: 'left' }}>
                                    {project.class_list.slice(0, 5).map((className, i) => <li key={i}>{className}</li>)}
                                    {project.class_list.length > 5 && <div>dll...</div>}
                                </ul>
                            </BodyCell>
                            {actionButtonProps && 
                                <BodyCell>
                                    <button onClick={actionButtonProps.onClick(project.id)}>{actionButtonProps.text}</button>
                                </BodyCell>
                            }
                        </BodyRow>
                    ))}
                </tbody>
            </StyledTable>
            </TableContainer>
        </div>
    )
}

export default ProjectsPage
