import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

export const ImagesPageContainer = styled.div`
    margin: 16px;
`

export const ImageDropzone = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-width: 2px;
    border-radius: 2px;
    border-color: #eeeeee;
    border-style: dashed;
    background-color: #fafafa;
    color: #bdbdbd;
    outline: none;
    transition: border .24s ease-in-out;
`

export const SpinningIcon = styled(FontAwesomeIcon)`
    animation: spin infinite cubic-bezier(0.42, 0, 0.59, 0.92) 1s;
    margin: 0 4px;

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`

export const XButton = styled.button`
    border: none;
    background: white;
    opacity: 1;
    cursor: pointer;
    display: block;
    right: 4px;
    position: absolute;
    height: 20px;
    width: 20px;
    border-radius: 10px;
    box-shadow: 0 10px 34px -15px rgb(0 0 0 / 24%);

    :disabled{
        opacity: 0.5;
    }

    :hover {
        opacity: 0.8;
    }
`
