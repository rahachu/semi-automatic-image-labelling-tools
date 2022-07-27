import styled from "styled-components";

export const AppTitleContainer = styled.div`
    display: flex;
    gap: 16px;
    align-items: center;
    margin: 16px;
    margin-bottom: 2em;
`

export const AppTitle = styled.h1`
    font-size: 1em;
    font-weight: 900;
`

export const SidebarAnchor = styled.a<{active?: boolean}>`
    width: 100%;
    display: block;
    padding: 16px;
    margin: 8px 0;
    background-color: ${props => props.active ? '#FDF7FA' : 'transparent'};
    color: ${props => props.active ? '#60435F' : 'white'};

    :hover {
        background-color: #FDF7FA;
        color: #60435F;
    }
`

export const Header = styled.header`
    box-shadow: 0 10px 34px -15px rgb(0 0 0 / 24%);
    text-align: right;
    padding: 16px;
    margin-bottom: 8px;
`

export const SidebarContainer = styled.div`
    height: 100vh;
    width: 12rem;
    background: linear-gradient(135deg,#f75959 0%,#f35587 100%);
    box-shadow: 0 10px 34px -15px rgb(0 0 0 / 24%);
    color: white;
`

export const PageContainer = styled.div`
    flex-grow: 1;
`
