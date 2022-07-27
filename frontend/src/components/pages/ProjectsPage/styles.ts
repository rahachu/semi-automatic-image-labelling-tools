import styled from 'styled-components';

export const TableContainer = styled.div`
  overflow: auto;
  height: 70vh;
::-webkit-scrollbar {
    background-color: white;
    width:16px;
    height:16px;
}

::-webkit-scrollbar-track {
    background-color: white;
}
::-webkit-scrollbar-track:hover {
    background-color: #FDF7FA;
}

::-webkit-scrollbar-thumb {
    background-color: #FDF7FA;
    border-radius: 16px;
    border: 6px solid  white;
}
::-webkit-scrollbar-thumb:hover {
    background-color: #60435F;
    border: 4px solid  white;
}

::-webkit-scrollbar-button {display:none}
`;

export const StyledTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
`;

export const HeadCell = styled.th`
    height: 60px;
    z-index: 1;
    border-bottom: #FDF7FA solid 1px;
    background-color: white;
    position: sticky;
    top: 0;
    :nth-last-child(n+2) {
        border-right: #FDF7FA solid 1px;
    }
`;

export const BodyRow = styled.tr`
  :nth-child(odd) {
    td {
      background-color: white;
    }
  }
  :nth-child(even) {
    td {
      background-color: #FDF7FA;
    }
  }
`;

export const BodyCell = styled.td`
    text-align: center;
    height: 60px;
    border-bottom: #FDF7FA solid 1px;
    vertical-align: top;
    :nth-last-child(n+2) {
        border-right: #FDF7FA solid 1px;
    }
    :first-child {
        z-index: 1;
        border-right: #FDF7FA solid 1px;
    }
`;
