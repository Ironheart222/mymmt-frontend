import { Button } from "@mui/material";
import React from "react";
import { CSVLink } from "react-csv";

const ExportReactCSV = ({ csvHeaders, csvData, fileName }: any) => (
  <CSVLink headers={csvHeaders} data={csvData} filename={fileName}>
    <Button variant="contained">Download</Button>
  </CSVLink>
);

export default ExportReactCSV;
