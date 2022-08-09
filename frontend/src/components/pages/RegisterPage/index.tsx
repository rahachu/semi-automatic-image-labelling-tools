import axiosInstance from "@/lib/axios";
import axios from "axios";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { FormEventHandler, useState } from "react";
import { ContentWrapper, DescWrapper, FormError, FormInput, FormLabel, FormWrapper, LoginButton, LoginWrapper, PageTitle, PageWrapper, StyledAnchor } from "./styles";

const RegisterPage = () => {
    const router = useRouter()
    const [errorMessages, setErrorMessages] = useState({
        detail: '',
        username: '',
        email: '',
        password: '',
        passwordverif: ''
    })

    const handleSubmit: FormEventHandler = async (event) => {
        event.preventDefault()
        const target = event.currentTarget as EventTarget & Element & {
            username: HTMLInputElement,
            email: HTMLInputElement,
            password: HTMLInputElement,
            passwordverif: HTMLInputElement
        }
        if (target.password.value != target.passwordverif.value) {
            setErrorMessages(prevState => ({...prevState, passwordverif: "password verification different!"}))
            return
        }
        const body = {
            username: target.username.value,
            email: target.email.value,
            password: target.password.value
        }

        await fetch('/api/register', {
            body: JSON.stringify(body),
            method: 'POST'
        })
        .then(async res => {
            const result = await res.json()
            if (res.status !== 200) {
                if (result.detail) {
                    setErrorMessages(prevState => ({...prevState, detail: result.detail}))
                } else {
                    setErrorMessages(prevState => ({...prevState, detail: ''}))
                }
                if (result.username) {
                    setErrorMessages(prevState => ({...prevState, username: result.username.join(', ')}))
                } else {
                    setErrorMessages(prevState => ({...prevState, username: ''}))
                }

                if (result.email) {
                    setErrorMessages(prevState => ({...prevState, email: result.email.join(', ')}))
                } else {
                    setErrorMessages(prevState => ({...prevState, email: ''}))
                }

                if (result.password) {
                    setErrorMessages(prevState => ({...prevState, password: result.password.join(', ')}))
                } else {
                    setErrorMessages(prevState => ({...prevState, password: ''}))
                }
            } else {
                axios.defaults.headers.common['Authorization'] = result.Authorization
                axiosInstance.defaults.headers.common['Authorization'] = result.Authorization
                router.push('/')
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <PageWrapper>
            <PageTitle>
                Computer Vision Annotator
            </PageTitle>
            <ContentWrapper>
                <LoginWrapper>
                    <PageTitle>Daftar Sekarang</PageTitle>
                    <form onSubmit={handleSubmit}>
                        {errorMessages.detail && <FormError>{errorMessages.detail}</FormError>}
                        <FormWrapper>
                            <FormLabel>Username</FormLabel>
                            {errorMessages.username && <FormError>{errorMessages.username}</FormError>}
                            <FormInput type="text" placeholder="Username" name="username"/>
                        </FormWrapper>
                        <FormWrapper>
                            <FormLabel>Email</FormLabel>
                            {errorMessages.email && <FormError>{errorMessages.email}</FormError>}
                            <FormInput type="email" placeholder="email" name="email"/>
                        </FormWrapper>
                        <FormWrapper>
                            <FormLabel>Password</FormLabel>
                            {errorMessages.password && <FormError>{errorMessages.password}</FormError>}
                            <FormInput type="password" placeholder="Password" name="password"/>
                        </FormWrapper>
                        <FormWrapper>
                            <FormLabel>Password Verification</FormLabel>
                            {errorMessages.passwordverif && <FormError>{errorMessages.passwordverif}</FormError>}
                            <FormInput type="password" placeholder="Password Verification" name="passwordverif"/>
                        </FormWrapper>
                        <span>Sudah punya akun?</span>
                        <Link href={'/login'} passHref>
                            <StyledAnchor>Masuk</StyledAnchor>
                        </Link>
                        <LoginButton type="submit">
                            Daftar
                        </LoginButton>
                    </form>
                </LoginWrapper>
                <DescWrapper>
                    <p style={{ textAlign: 'left' }}>
                        Selamat Datang pada sistem anotasi untuk data citra dan video
                        semi-otomatis untuk mendukung ekosistem berbasis kecerdasan
                        buatan di Indonesia.
                    </p>
                </DescWrapper>
            </ContentWrapper>
        </PageWrapper>
    )
}

export default RegisterPage;
