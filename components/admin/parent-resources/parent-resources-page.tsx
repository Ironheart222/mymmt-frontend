import * as React from "react";
import {
  Box,
  Button,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
} from "mui-datatables";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import {
  getParentList,
  updateParentStatus,
} from "../../../store/thunk/admin/adminAuthThunk";
import { addResourcesFolder } from "../../../store/thunk/admin/resourceThunk";

import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ParentDetails from "../user-management/parent-details";
import {
  ApolloClientType,
  ParentParam,
  DialogDetails,
} from "../../../store/Interface";
import EditParentModel from "../model/edit-parent";
import { setLoading } from "../../../store/slices/loadingSlice";
import moment from "moment";
import { getResourcesFolder } from "../../../store/thunk/admin/resourceThunk";
import CreateFolderModel from "../model/create-folder-model";
import { Add, GifBox } from "@mui/icons-material";
import Router, { withRouter } from "next/router";
import ConfirmationModel from "../model/confirmation-model";

enum FlagType {
  ACTIVE = "active",
  DELETE = "delete",
  VERIFY = "verify",
}

export const ParentResourcesPage = (props: any) => {
  const dispatch = useAppDispatch();
  const { adminClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );

  const [dialogDetails, setDialogDetails] = React.useState<DialogDetails>({
    title: "",
    body_content: "",
    id: "",
  });

  const [openCreateFolderModel, setOpenCreateFolderModel] =
    React.useState(false);
  const [parentDetailOpen, setParentDetailOpen] = React.useState(false);
  const [openEditParentModel, setOpenEditParentModel] = React.useState(false);
  const [editID, setEditID] = React.useState<string>("");
  const [editData, setEditData] = React.useState<any>({});
  const [deleteData, setDeleteData] = React.useState<any>({});
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [parentDetail, setParentDetail] = React.useState({});

  const { folderDetails } = useAppSelector((state) => state.resourceSlice);
  const [openConfirmationModel, setOpenConfirmationModel] =
    React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isDeleteStatus, setIsDeleteStatus] = React.useState<boolean>(false);

  React.useEffect(() => {
    //dispatch(getParentList(adminClient));
    dispatch(getResourcesFolder(adminClient));
  }, []);

  const viewParentDetails = (value: any) => {
    if (value) {
      setParentDetailOpen(true);
      setParentDetail(value);
    }
  };

  const toggleEditParent = () => {
    if (openEditParentModel) {
      setEditID("");
    }
    setOpenEditParentModel(!openEditParentModel);
  };

  const handleEditParent = (value: ParentParam) => {
    if (value) {
      setEditID(value.parent_id);
      toggleEditParent();
    }
  };

  const handleEditParentResource = (value: any) => {
    if (value) {
      setEditID(value.folder_id);
      setEditData(value);
      toggleModel(0);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: any,
    flag: FlagType
  ) => {
    if (value) {
      let _request = {
        id: +value.folder_id,
        name: value.folder_name,
        description: value.folder_description,
        is_delete:
          flag == FlagType.DELETE ? event.target.checked : value.is_delete,
        is_active:
          flag == FlagType.ACTIVE ? event.target.checked : value.is_active,
        is_active_call: 1,
      };

      dispatch(addResourcesFolder({ _request, adminClient }));
    }
  };

  const toggleModel = (value: any) => {
    if (value === 1) {
      setEditData({}); //Clear Data if call for add new
    }
    setOpenCreateFolderModel(!openCreateFolderModel);
  };

  const viewParentResource = (value: any) => {
    if (value) {
      Router.push({
        pathname: `/admin/parent-resources/${value.folder_id}`,
        //query: { name: 'Someone' }
      });
    }
  };

  const toggleConfirmationModel = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: any,
    flag: FlagType
  ) => {
    if (value && value.folder_id) {
      setDeleteData(value);
      let dialogDetails: DialogDetails = {
        title: "Delete Confirmation",
        body_content: "Are you sure you want to delete this item?",
        id: String(value.folder_id),
      };
      setDialogDetails(dialogDetails);
      setOpenConfirmationModel(!openConfirmationModel);
      setIsDeleteStatus(
        flag == FlagType.DELETE ? event.target.checked : value.is_delete
      );
    } else {
      onCloseDialog();
    }
  };

  const onCloseDialog = () => {
    setDialogDetails({
      title: "",
      body_content: "",
      id: "",
    });
    setDeleteData({});
    setOpenConfirmationModel(!openConfirmationModel);
  };

  const handleDeleteFile = (id: string) => {
    if (id && Object.keys(deleteData).length > 0) {
      let _request = {
        id: +deleteData.folder_id,
        name: deleteData.folder_name,
        description: deleteData.folder_description,
        is_delete: isDeleteStatus,
        is_active: deleteData.is_active,
        is_delete_call: 1,
      };

      dispatch(
        addResourcesFolder({
          _request,
          adminClient,
          result: (res: any) => {
            setLoading(false);
            onCloseDialog();
          },
        })
      );
    }
  };

  const tableColumns: MUIDataTableColumn[] = [
    {
      name: "#",
      options: {
        filter: false,
        // setCellProps: () => ({ style: { minWidth: "150px", maxWidth: "150px" } }),
        customBodyRender: (value) => {
          return value;
        },
      },
    },
    {
      label: "Folder Name",
      name: "fname",
      options: {
        filter: true,
        setCellProps: () => ({ style: { minWidth: "150px" } }),
        // customBodyRender: (value) => {
        //   return (
        //     <strong>
        //       {value.folder_name}
        //     </strong>
        //   );
        // },
      },
    },
    {
      label: "Folder Description",
      name: "fdesc",
      options: {
        filter: false,
        customBodyRender: (value) => {
          return <span>{value?.folder_description}</span>;
        },
      },
    },
    {
      label: "No. Of Files",
      name: "mobile_no",
      options: {
        filter: false,
        customBodyRender: (value) => {
          return <strong>{value.document_list.length}</strong>;
        },
      },
    },
    {
      label: "No. Of Parent",
      name: "parent_id",
      options: {
        filter: false,
        customBodyRender: (value) => {
          return (
            <strong>{value.all_parent ? "All" : value.parent_id.length}</strong>
          );
        },
      },
    },
    {
      label: "Created Date",
      name: "created_Date",
      options: {
        filter: false,
        setCellProps: () => ({ style: { minWidth: "200px" } }),
        customBodyRender: (value: any) => {
          let date = value
            ? moment(value).format("MMM Do YYYY, HH:mm:ss")
            : "-";
          return date;
        },
      },
    },
    {
      label: "Visible to",
      name: "child_count",
      options: {
        filter: false,
        customBodyRender: (value) => {
          return <strong>{value}</strong>;
        },
      },
    },
    {
      name: "Active",
      options: {
        filter: false,
        // setCellProps: () => ({ style: { minWidth: "150px", maxWidth: "150px" } }),
        customBodyRender: (value) => {
          return (
            <>
              <FormControlLabel
                control={
                  <Switch
                    checked={value.is_active ? value.is_active : false}
                    onChange={(e) => handleChange(e, value, FlagType.ACTIVE)}
                    name="disabled"
                    color="primary"
                  />
                }
                label=""
              />
            </>
          );
        },
      },
    },
    {
      name: "Delete",
      options: {
        filter: false,
        // setCellProps: () => ({ style: { minWidth: "150px", maxWidth: "150px" } }),
        customBodyRender: (value) => {
          return (
            <>
              <FormControlLabel
                control={
                  <Switch
                    checked={value.is_delete ? value.is_delete : false}
                    onChange={(e) =>
                      toggleConfirmationModel(e, value, FlagType.DELETE)
                    }
                    name="disabled"
                    color="primary"
                  />
                }
                label=""
              />
            </>
          );
        },
      },
    },
    {
      name: "Action",
      options: {
        filter: false,
        setCellProps: () => ({ style: { minWidth: "150px" } }),
        customBodyRender: (value) => {
          return (
            <div>
              <Button
                type="button"
                className="min_width_auto"
                sx={{ backgroundColor: "#3f51b5" }}
                variant="contained"
                title="View Detail"
                onClick={() => handleEditParentResource(value)}
              >
                <EditIcon fontSize="small" />
              </Button>{" "}
              <Button
                className="min_width_auto"
                type="button"
                sx={{ backgroundColor: "#ff9800" }}
                variant="contained"
                title="View Detail"
                onClick={() => viewParentResource(value)}
              >
                <VisibilityIcon fontSize="small" />
              </Button>
            </div>
          );
        },
      },
    },
  ];

  const renderParentList = () => {
    let data: any[] = [];
    folderDetails &&
      folderDetails.map((val: any, index: number) => {
        data.push([
          index + 1,
          val.folder_name,
          val,
          val,
          val,
          val,
          "Select Members",
          val,
          val,
          val,
        ]);
      });

    return data;
  };

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
    customToolbar: () => {
      return (
        <Button
          color="primary"
          variant="contained"
          sx={{ m: 1 }}
          startIcon={<Add />}
          onClick={() => toggleModel(1)}
        >
          Create New Folder
        </Button>
      );
    },
  };

  return (
    <Box {...props}>
      {/* <Stack direction={"row"} alignSelf={"center"} sx={{ mb: 1 }}>
        <Button
          variant="text"
          sx={{ fontSize: "16px" }}
          onClick={() => setParentDetailOpen(false)}
        >
          Parents {"/"}
        </Button>
        {parentDetailOpen && (
          <Typography
            color="text.primary"
            sx={{ display: "flex", alignItems: "center" }}
          >
            Details
          </Typography>
        )}
      </Stack> */}
      {openCreateFolderModel && (
        <CreateFolderModel
          editData={editData}
          open={openCreateFolderModel}
          onClose={toggleModel}
        />
      )}
      {parentDetailOpen && <ParentDetails parentDetail={parentDetail} />}
      {openEditParentModel && (
        <EditParentModel
          open={openEditParentModel}
          onClose={toggleEditParent}
          editId={editID}
        />
      )}
      {!parentDetailOpen && (
        <>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Typography sx={{ m: 1, color: "#243248" }} variant="h5">
              <b>Parent Resources</b>
            </Typography>
          </Box>
          <Box sx={{ my: 2 }}>
            <MUIDataTable
              title={"Parents"}
              data={renderParentList()}
              columns={tableColumns}
              options={options}
            />
          </Box>
        </>
      )}
      {openConfirmationModel && (
        <ConfirmationModel
          loading={loading}
          dialogDetails={dialogDetails}
          modelOpen={openConfirmationModel}
          onClose={onCloseDialog}
          onDelete={handleDeleteFile}
        />
      )}
    </Box>
  );
};
