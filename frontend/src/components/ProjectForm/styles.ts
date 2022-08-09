import styled from "styled-components";

export const ProjectFormContainer = styled.div`
    margin: 16px;
    margin-top: 0;
`

export const ProjectFormHeader = styled.div`
    position: sticky;
    top: 0;
    padding: 20px 0;
    margin-top: 16px;
    background-color: #f8f9fd;
    display: flex;
    justify-content: space-between;
`

export const SaveButton = styled.button<{ isCreate?: boolean }>`
    background-color: #2196F3;
    color: white;
    padding: 8px 16px;
    border: 1px solid darkgrey;
    border-radius: ${props => props.isCreate ? '4px' : '4px 0 0 4px'};
    cursor: pointer;
    opacity: 1;

    :hover {
        opacity: 0.8;
    }
`

export const DropdownMenu = styled.div`
    display: none;
    position: absolute;
    background-color: #f1f1f1;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    right: 0;

    button, a {
        border: none;
        display: block;
        width: 100%;
        opacity: 1;
        cursor: pointer;
        padding: 8px 4px;
        text-align: left;
        font-size: 0.8em;
        
        :hover {
            opacity: 0.8;
            background-color: darkgray;
        }
    }
`

export const DropdownWrapper = styled.div`
    position: relative;
    display: inline-block;

    :hover ${DropdownMenu} {
        display: block;
    }
`

export const CaretButton = styled.button`
    background-color: #2196F3;
    color: white;
    padding: 8px;
    border: 1px solid darkgrey;
    border-left: none;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    opacity: 1;
    position: relative;

    :hover {
        opacity: 0.8;
    }
`

export const FormTitle = styled.h2`
    font-size: x-large;
    margin: 0;
`

export const ProjectFormWrapper = styled.div`
    margin-bottom: 20px;
`

export const ProjectFormLabel = styled.label`
    display: block;
    text-align: left;
    margin: 8px 0;
    font-size: 1rem;
`

export const ProjectFormInput = styled.input`
    display: block;
    width: 100%;
    margin: 8px 0;
    border: 1px solid darkgray;
    font-size: 0.8rem;
    outline: none;
    box-shadow: none;
    border-radius: 8px;
    padding: 8px;

    :focus{
        border: 1px solid black;
        box-shadow: none;
    }
`

export const ProjectFormSelect = styled.select`
    display: block;
    width: 100%;
    margin: 8px 0;
    border: 1px solid darkgray;
    font-size: 0.8rem;
    outline: none;
    box-shadow: none;
    border-radius: 8px;
    padding: 8px;

    :focus{
        border: 1px solid black;
        box-shadow: none;
    }
`

export const ProjectFormTextArea = styled.textarea`
    display: block;
    width: 100%;
    margin: 8px 0;
    border: 1px solid darkgray;
    font-size: 0.8rem;
    outline: none;
    box-shadow: none;
    border-radius: 8px;
    padding: 8px;

    :focus{
        border: 1px solid black;
        box-shadow: none;
    }
`

export const ClassContainer = styled.div``
export const ClassChip = styled.div`
    display: inline-block;
    padding: 4px 12px;
    border-radius: 32px;
    font-size: 13px;
    border: 1px solid darkgray;
    margin: 4px;
`

export const RemoveClass = styled.button`
    background: none;
    border: none;
    padding: 0;
    margin-left: 6px;
    cursor: pointer;
`

export const UserSelect = styled.button`
    display: inline-block;
    margin: 4px;
    border: 1px solid darkgray;
    border-radius: 4px;
    background-color: white;
    font-size: 0.8rem;
    outline: none;
    box-shadow: none;
    padding: 4px 8px;
    text-align: left;
    cursor: pointer;
`

export const Switch = styled.label`
    position: relative;
    display: inline-block;
    width: 40px;
    height: 24px;

    input { 
        opacity: 0;
        width: 0;
        height: 0;
    }

    span {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
        border-radius: 20px;

        ::before{
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            -webkit-transition: .4s;
            transition: .4s;
            border-radius: 34px;
        }
    }

    input:checked + span {
        background-color: #2196F3;
    }

    input:focus + span {
        box-shadow: 0 0 1px #2196F3;
    }

    input:checked + span:before {
        transform: translateX(16px);
    }
`
