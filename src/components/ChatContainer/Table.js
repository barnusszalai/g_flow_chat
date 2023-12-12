// Table.js
import React from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const ExcelTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  background-color: #f2f2f2;
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center; /* Center align the text */
`;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center; /* Center align the text */
`;

const Table = ({ data }) => {
  const renderTableCells = (rowData, indentLevel = 0) => {
    const tableCells = [];
    for (const key in rowData) {
      const value = rowData[key];
      tableCells.push(
        <tr key={key}>
          <TableCell style={{ paddingLeft: `${indentLevel * 20}px`, textAlign: 'center' }}>{key}</TableCell>
          {typeof value === 'object' ? (
            <TableCell>
              <Table data={[value]} />
            </TableCell>
          ) : (
            <TableCell>{value}</TableCell>
          )}
        </tr>
      );
    }
    return tableCells;
  };

  return (
    <TableContainer>
      <ExcelTable>
        <tbody>
          {data.map((row, index) => (
            <React.Fragment key={index}>
              {renderTableCells(row)}
              {index < data.length - 1 && <tr><td colSpan="2">&nbsp;</td></tr>}
            </React.Fragment>
          ))}
        </tbody>
      </ExcelTable>
    </TableContainer>
  );
};

export default Table;
