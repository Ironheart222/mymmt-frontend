import * as React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
} from "mui-datatables";
import WorksheetModel from "../../model/worksheet-model";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import {
  deleteWorksheet,
  getWorksheetList,
} from "../../../../store/thunk/admin/lesson";
import EditIcon from "@mui/icons-material/Edit";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { DialogDetails, WorksheetData } from "../../../../store/Interface";
import ConfirmationModel from "../../model/confirmation-model";
import { setLoading } from "../../../../store/slices/loadingSlice";
import { GetWeekData } from "../../../../store/slices/lessonSlice";
import moment from "moment";
import { GetWorksheetData } from "../../../../store/slices/admin/lessonSlice";

export const WorksheetList = () => {
  const dispatch = useAppDispatch();
  const { adminClient }: any = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const { worksheetData } = useAppSelector((state) => state.lessonReducer);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);

  React.useEffect(() => {
    dispatch(GetWorksheetData([]));
    dispatch(getWorksheetList({ _request: 3, adminClient }));
  }, []);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [openWorksheetUpload, setOpenWorksheetUpload] =
    React.useState<boolean>(false);
  const [openConfirmationModel, setOpenConfirmationModel] =
    React.useState<boolean>(false);
  const [dialogDetails, setDialogDetails] = React.useState<DialogDetails>({
    title: "",
    body_content: "",
    id: "",
  });
  const [editId, setEditId] = React.useState<string>("");

  const tableColumns: MUIDataTableColumn[] = [
    {
      name: "#",
      options: {
        filter: false,
        customBodyRender: (value) => {
          return value;
        },
      },
    },
    {
      label: "Title",
      name: "title",
      options: {
        setCellProps: () => ({ style: { minWidth: "150px" } }),
      },
    },
    {
      label: "Description",
      name: "description",
      options: {
        setCellProps: () => ({ style: { minWidth: "150px" } }),
      },
    },
    {
      label: "Worksheet Url",
      name: "worksheet_url",
    },
    {
      label: "Created Date",
      name: "created_Date",
      options: {
        setCellProps: () => ({ style: { minWidth: "200px" } }),
        customBodyRender: (value) => {
          return moment(value).format("MMM Do YYYY, HH:mm:ss");
        },
      },
    },
    {
      label: "Updated Date",
      name: "updated_Date",
      options: {
        setCellProps: () => ({ style: { minWidth: "200px" } }),
        customBodyRender: (value) => {
          return moment(value).format("MMM Do YYYY, HH:mm:ss");
        },
      },
    },
    {
      name: "Action",
      options: {
        filter: false,
        setCellProps: () => ({
          style: { minWidth: "150px", maxWidth: "150px" },
        }),
        customBodyRender: (value) => {
          return (
            <div>
              <Button
                type="button"
                className="min_width_auto"
                sx={{ backgroundColor: "#3f51b5" }}
                variant="contained"
                title="View Detail"
                onClick={() => toggleEditWorksheetModel(value)}
              >
                <EditIcon fontSize="small" />
              </Button>{" "}
              <Button
                type="button"
                className="min_width_auto"
                color="error"
                variant="contained"
                title="View Detail"
                onClick={() => toggleConfirmationModel(value)}
              >
                <DeleteRoundedIcon fontSize="small" />
              </Button>
            </div>
          );
        },
      },
    },
  ];

  const options: MUIDataTableOptions = {
    filter: true,
    selectableRows: "none",
    selectableRowsOnClick: true,
    filterType: "dropdown",
    // responsive: "stacked",
    responsive: "vertical",
    rowsPerPage: rowsPerPage,
    rowsPerPageOptions: [25, 50, 100, 150],
    download: false,
    print: false,
    viewColumns: false,
    onChangeRowsPerPage: (val: number) => {
      setRowsPerPage(val);
    },
  };

  const renderWorksheets = () => {
    let data: any[] = [];
    worksheetData &&
      worksheetData.map((val: any, index: number) => {
        data.push([
          index + 1,
          val.worksheet_name ? val.worksheet_name : "-",
          val.worksheet_description ? val.worksheet_description : "-",
          val.worksheet_url ? val.worksheet_url : "-",
          val.created_date ? val.created_date : "-",
          val.updated_date ? val.updated_date : "-",
          val,
        ]);
      });
    return data;
  };

  const toggleWorksheetModel = () => {
    setEditId("");
    setOpenWorksheetUpload(!openWorksheetUpload);
  };

  const toggleEditWorksheetModel = (value: WorksheetData) => {
    setEditId(String(value.worksheet_id));
    setOpenWorksheetUpload(!openWorksheetUpload);
  };

  const toggleConfirmationModel = (value: WorksheetData | null) => {
    if (value && value.worksheet_id) {
      let dialogDetails: DialogDetails = {
        title: "Delete Confirmation",
        body_content: "Are you sure you want to delete this worksheet?",
        id: String(value.worksheet_id),
      };
      setDialogDetails(dialogDetails);
      setOpenConfirmationModel(!openConfirmationModel);
    } else {
      onClose();
    }
  };

  const onClose = () => {
    setDialogDetails({
      title: "",
      body_content: "",
      id: "",
    });
    setOpenConfirmationModel(!openConfirmationModel);
  };

  const handleDeleteWorksheet = (id: string) => {
    if (id) {
      setLoading(true);
      let _request = {
        worksheetId: id,
        stage_no: 3,
      };
      dispatch(
        deleteWorksheet({
          _request,
          adminClient,
          result: (res: any) => {
            setLoading(false);
            onClose();
          },
        })
      );
    }
  };

  return (
    <Box>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          my: 1,
        }}
      >
        <Typography sx={{ m: 1 }} variant="h5">
          Manage Worksheet
        </Typography>

        <Button
          color="primary"
          variant="contained"
          sx={{ m: 1 }}
          onClick={() => toggleWorksheetModel()}
        >
          Upload Worksheet
        </Button>
      </Box>
      <MUIDataTable
        title={"Worksheet List"}
        data={renderWorksheets()}
        columns={tableColumns}
        options={options}
      />
      {openWorksheetUpload && (
        <WorksheetModel
          editId={editId}
          open={openWorksheetUpload}
          onClose={toggleWorksheetModel}
          stage_no={3}
        />
      )}

      {openConfirmationModel && (
        <ConfirmationModel
          loading={loading}
          dialogDetails={dialogDetails}
          modelOpen={openConfirmationModel}
          onClose={onClose}
          onDelete={handleDeleteWorksheet}
        />
      )}
    </Box>
  );
};
