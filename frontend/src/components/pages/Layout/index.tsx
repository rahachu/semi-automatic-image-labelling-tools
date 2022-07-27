import Head from "next/head"
import { LayoutProps } from "./types"
import Image from 'next/image'
import { AppTitle, AppTitleContainer, Header, PageContainer, SidebarAnchor, SidebarContainer } from "./styles"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye } from "@fortawesome/free-regular-svg-icons"
import { useRouter } from "next/router"
import Link from "next/link"

const Layout = ({ children, user }: LayoutProps) => {
    const router = useRouter()
    const currentRoute = router.pathname;
    const logoutHandler = async () => {
        await fetch('/api/logout')
        router.push('/login')
    }

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
            </Head>
            <div style={{ display: 'flex' }}>
                <SidebarContainer>
                    <AppTitleContainer>
                        <FontAwesomeIcon icon={faEye} size='3x' />
                        <AppTitle>Computer Vision Annotator</AppTitle>
                    </AppTitleContainer>
                    <Link href="/" passHref>
                        <SidebarAnchor active={currentRoute === '/'} >
                            Proyek Saya
                        </SidebarAnchor>
                    </Link>
                    <Link href="/project" passHref>
                        <SidebarAnchor active={currentRoute === '/project'}>
                            Proyek Anotasi
                        </SidebarAnchor>
                    </Link>
                    <SidebarAnchor href="/">
                        Buku Tugas Akhir
                    </SidebarAnchor>
                    <SidebarAnchor href="/">
                        Tentang Saya
                    </SidebarAnchor>
                    <SidebarAnchor href="#" onClick={logoutHandler}>
                        Keluar
                    </SidebarAnchor>
                </SidebarContainer>
                <PageContainer>
                    <Header>
                        Selamat datang, {user.username} <br />
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                    </Header>
                    <main style={{ height: '85vh', overflow: 'auto'}}>
                        { children }
                    </main>
                    <footer style={{ padding: 8 }}>
                        <a
                            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                        Powered by{' '}
                        <span>
                            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                        </span>
                        </a>
                    </footer>
                </PageContainer>
            </div>
        </>
    )
}

export default Layout