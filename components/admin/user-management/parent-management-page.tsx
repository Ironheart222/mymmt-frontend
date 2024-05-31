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
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ParentDetails from "./parent-details";
import {
  ApolloClientType,
  ParentParam,
  DialogDetails,
} from "../../../store/Interface";
import EditParentModel from "../model/edit-parent";
import { setLoading } from "../../../store/slices/loadingSlice";
import moment from "moment";
import { phoneNumberformat } from "../../../helpers/helper";
import ConfirmationModel from "../model/confirmation-model";

enum FlagType {
  ACTIVE = "active",
  DELETE = "delete",
  VERIFY = "verify",
}

export const ParentManagementPage = (props: any) => {
  const dispatch = useAppDispatch();
  const { adminClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const { parentListData } = useAppSelector((state) => state.adminReducer);
  const { isLoading } = useAppSelector((state) => state.loadingReducer);
  const [openConfirmationModel, setOpenConfirmationModel] =
    React.useState<boolean>(false);

  const [parentDetailOpen, setParentDetailOpen] = React.useState(false);
  const [openEditParentModel, setOpenEditParentModel] = React.useState(false);
  const [editID, setEditID] = React.useState<string>("");

  const [deleteData, setDeleteData] = React.useState<any>({});
  const [parentDetail, setParentDetail] = React.useState({});
  const [dialogDetails, setDialogDetails] = React.useState<DialogDetails>({
    title: "",
    body_content: "",
    id: "",
  });
  const [isDeleteStatus, setIsDeleteStatus] = React.useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);

  React.useEffect(() => {
    dispatch(getParentList(adminClient));
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

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: any,
    flag: FlagType
  ) => {
    dispatch(setLoading(true));
    if (value) {
      let _request = {
        is_delete:
          flag == FlagType.DELETE ? event.target.checked : value.is_delete,
        is_active:
          flag == FlagType.ACTIVE ? event.target.checked : value.is_active,
        is_verify:
          flag == FlagType.VERIFY ? event.target.checked : value.is_varified,
        parent_id: Number(value.parent_id),
      };

      dispatch(updateParentStatus({ _request, adminClient }));
    }
  };

  const toggleConfirmationModel = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: any,
    flag: FlagType
  ) => {
    if (value && value.parent_id) {
      setDeleteData(value);
      let dialogDetails: DialogDetails = {
        title: "Delete Confirmation",
        body_content: "Are you sure you want to delete this item?",
        id: String(value.parent_id),
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
    dispatch(setLoading(false));
  };

  const handleDeleteParent = (id: string) => {
    if (id && Object.keys(deleteData).length > 0) {
      dispatch(setLoading(true));
      let _request = {
        is_delete: isDeleteStatus,
        is_active: deleteData.is_active,
        is_verify: deleteData.is_varified,
        parent_id: Number(deleteData.parent_id),
        is_delete_call: 1,
      };

      dispatch(
        updateParentStatus({
          _request,
          adminClient,
          result: (res: any) => {
            dispatch(setLoading(false));
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
      label: "Name",
      name: "full_name",
      options: {
        setCellProps: () => ({ style: { minWidth: "150px" } }),
        customBodyRender: (value) => {
          return (
            <strong>
              {value.first_name} {value.last_name}
            </strong>
          );
        },
      },
    },
    {
      label: "Email",
      name: "email",
      options: {
        customBodyRender: (value) => {
          return <strong>{value}</strong>;
        },
      },
    },
    {
      label: "Contact Number",
      name: "mobile_no",
      options: {
        setCellProps: () => ({ style: { minWidth: "200px" } }),
      },
    },
    {
      label: "No of Child",
      name: "child_count",
      options: {
        customBodyRender: (value) => {
          return <strong>{value}</strong>;
        },
      },
    },
    {
      label: "Street name and number  ",
      name: "street_1",
      options: {
        filter: false,
        setCellProps: () => ({ style: { minWidth: "150px" } }),
        customBodyRender: (value) => {
          if (!value.street_1 && !value.street_2) {
            return "-";
          }
          return `${value.street_1 || ""} ${value.street_2 || ""}`;
        },
      },
    },
    {
      label: "Apartment No",
      name: "apartment_no",
    },
    {
      label: "Suburb",
      name: "suburb",
    },
    {
      label: "Postal/Zip Code",
      name: "postal_code",
    },
    {
      label: "State",
      name: "state",
      options: {
        setCellProps: () => ({ style: { minWidth: "150px" } }),
        customBodyRender: (value) => {
          return <strong>{value}</strong>;
        },
      },
    },
    {
      label: "Country",
      name: "country",
      options: {
        customBodyRender: (value) => {
          return <strong>{value}</strong>;
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
      label: "Updated Date",
      name: "updated_Date",
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
      name: "Verified",
      options: {
        filter: false,
        // setCellProps: () => ({ style: { minWidth: "150px", maxWidth: "150px" } }),
        customBodyRender: (value) => {
          return (
            <>
              <FormControlLabel
                control={
                  <Switch
                    checked={value.is_varified ? value.is_varified : false}
                    onChange={(e) => handleChange(e, value, FlagType.VERIFY)}
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
                onClick={() => handleEditParent(value)}
              >
                <EditIcon fontSize="small" />
              </Button>{" "}
              <Button
                className="min_width_auto"
                type="button"
                sx={{ backgroundColor: "#ff9800" }}
                variant="contained"
                title="View Detail"
                onClick={() => viewParentDetails(value)}
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
    parentListData &&
      parentListData.map((val: any, index: number) => {
        data.push([
          index + 1,
          val,
          val.email ? val.email : "-",
          phoneNumberformat(val?.mobile_no || ""),
          val.child_detail ? val.child_detail.length : "0",
          val,
          val.apartment_no ? val.apartment_no : "-",
          val.suburb ? val.suburb : "-",
          val.postal_code ? val.postal_code : "-",
          val.state ? val.state : "-",
          val.country ? val.country : "-",
          val.created_date ? val.created_date : "-",
          val.updated_date ? val.updated_date : "-",
          val,
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
  };

  return (
    <Box {...props}>
      <Stack direction={"row"} alignSelf={"center"} sx={{ mb: 1 }}>
        <Button
          variant="text"
          sx={{ fontSize: "16px" }}
          onClick={() => setParentDetailOpen(false)}
        >
          Parents {"/"}
        </Button>
        {/* <Typography color={ parentDetailOpen ? "gray" : "text.primary"} sx={{mr:1}} ><a></a> {'/'}</Typography> */}
        {parentDetailOpen && (
          <Typography
            color="text.primary"
            sx={{ display: "flex", alignItems: "center" }}
          >
            Details
          </Typography>
        )}
      </Stack>

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
              Parent - <b>Management</b>
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
          loading={isLoading}
          dialogDetails={dialogDetails}
          modelOpen={openConfirmationModel}
          onClose={onCloseDialog}
          onDelete={handleDeleteParent}
        />
      )}
    </Box>
  );
};
