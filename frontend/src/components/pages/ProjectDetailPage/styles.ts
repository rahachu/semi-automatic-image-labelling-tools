import styled from "styled-components";
import Image from "next/image";

export const DetailContainer = styled.div`
    display: flex;
    margin: 8px 0;
`

export const DetailName = styled.div`
    width: 12em;
`

export const DetailValue = styled.div``

export const ImagesContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
`

export const ImageCard = styled.div`
    margin: 4px;
    padding: 4px;
    box-shadow: 0 10px 34px -15px rgb(0 0 0 / 24%);
    border-radius: 8px;
`

export const ImageFile = styled(Image)`
    object-fit: cover;
`

export const Button = styled.button`
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
    margin: 8px 0;
    :hover {
        opacity: 0.8;
    }
`
