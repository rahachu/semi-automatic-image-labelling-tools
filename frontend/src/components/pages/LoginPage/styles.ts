import styled from "styled-components";

export const PageWrapper = styled.div`
    padding: 7em 0;
    text-align: center;
`

export const PageTitle = styled.h1`
    font-size: x-large;
`

export const ContentWrapper = styled.div`
    display: flex;
    box-shadow: 0 10px 34px -15px rgb(0 0 0 / 24%);
    border-radius: 8px;
    margin: 3em;
    overflow: hidden;
    justify-content: stretch;
`

export const DescWrapper = styled.div`
    background: linear-gradient(135deg,#f75959 0%,#f35587 100%);
    color: white;
    padding: 3em;
    width: 50%;
`

export const LoginWrapper = styled.div`
    background: white;
    width: 50%;
    padding: 3em;
`

export const FormWrapper = styled.div`
    margin: 20px 0;
`

export const FormLabel = styled.label`
    display: block;
    text-align: left;
    margin: 8px 0;
    font-size: 1rem;
`

export const FormError = styled.div`
    text-align: left;
    color: red;
    width: 100%;
    font-size: 0.8rem;
    margin: 0;
`

export const FormInput = styled.input`
    display: block;
    width: 100%;
    margin: 8px 0;
    border: 1px solid darkgray;
    font-size: 1rem;
    outline: none;
    box-shadow: none;
    border-radius: 8px;
    padding: 16px;

    :focus{
        border: 1px solid black;
        box-shadow: none;
    }
`

export const LoginButton = styled.button`
    border-radius: 8px;
    background: linear-gradient(135deg,#f75959 0%,#f35587 100%);
    border: none;
    color: white;
    font-size: medium;
    font-weight: 500;
    cursor: pointer;
    padding: 10px 16px;
    width: 100%;
    opacity: 1;
    margin: 20px 0;
    :hover {
        opacity: 0.8;
    }
`
