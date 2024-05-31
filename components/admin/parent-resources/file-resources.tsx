import * as React from "react";
import { Add, GifBox } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  Paper,
  Tooltip,
  Typography,
  Link,
} from "@mui/material";
import { Folder } from "./folder";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import UploadDocumentsModel from "../model/upload-documents-model";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { ApolloClientType, DialogDetails } from "../../../store/Interface";
import {
  getResourceFolderDetailByFolderId,
  deleteFolderDocument,
} from "../../../store/thunk/admin/resourceThunk";
import { EmptyFiles } from "./empty-files";
import { GetResourceFolderDetail } from "../../../store/slices/admin/resourceSlice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import moment from "moment";
import Router from "next/router";
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
} from "mui-datatables";
import { valueContainerCSS } from "react-select/dist/declarations/src/components/containers";
import ConfirmationModel from "../model/confirmation-model";

export const FileResources = (props: any) => {
  const [openUploadDocumentsModel, setOpenUploadDocumentsModel] =
    React.useState(false);
  const [folderID, setFolderID] = React.useState<string>(props.folderId);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const dispatch = useAppDispatch();
  const { adminClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const { selectedFolderDetails }: any = useAppSelector(
    (state) => state.resourceSlice
  );
  const { folder_name }: any = selectedFolderDetails;
  const [dialogDetails, setDialogDetails] = React.useState<DialogDetails>({
    title: "",
    body_content: "",
    id: "",
  });
  const [openConfirmationModel, setOpenConfirmationModel] =
    React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    dispatch(GetResourceFolderDetail([]));
  }, []);

  React.useEffect(() => {
    if (folderID) {
      const requestData = {
        folder_id: Number(folderID),
      };
      dispatch(
        getResourceFolderDetailByFolderId({
          _request: requestData,
          adminClient,
        })
      );
    }
    //dispatch(getResourceFolderDetail(adminClient));
  }, [folderID]);

  React.useEffect(() => {
    setFolderID(props.folderId);
  }, [props.folderId]);

  React.useEffect(() => {
    if (folderID) {
      const requestData = {
        folder_id: Number(folderID),
      };
      dispatch(
        getResourceFolderDetailByFolderId({
          _request: requestData,
          adminClient,
        })
      );
    }
  }, [folderID]);

  const toggleModel = () => {
    // if (openUploadDocumentsModel) {
    //     setFolderID("");
    // }
    setOpenUploadDocumentsModel(!openUploadDocumentsModel);
  };

  //Reset List After Add new Document
  const onSubmitCallback = () => {
    if (folderID) {
      const requestData = {
        folder_id: Number(folderID),
      };
      dispatch(
        getResourceFolderDetailByFolderId({
          _request: requestData,
          adminClient,
        })
      );
    }
  };

  const toggleConfirmationModel = (value: any | null) => {
    if (value && value.document_id) {
      let dialogDetails: DialogDetails = {
        title: "Delete Confirmation",
        body_content: "Are you sure you want to delete this item?",
        id: String(value.document_id),
      };
      setDialogDetails(dialogDetails);
      setOpenConfirmationModel(!openConfirmationModel);
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
    setOpenConfirmationModel(!openConfirmationModel);
  };

  const goBackToListFolder = () => {
    Router.push({
      pathname: `/admin/parent-resources/`,
    });
  };

  const handleDeleteFile = (id: string) => {
    if (id) {
      setLoading(true);
      let _request = {
        document_id: +id,
      };
      dispatch(
        deleteFolderDocument({
          _request,
          adminClient,
          result: (res: any) => {
            setLoading(false);
            onCloseDialog();
            onSubmitCallback();
          },
        })
      );
    }
  };

  const tableColumns: MUIDataTableColumn[] = [
    {
      label: "#",
      name: "document_id",
      options: {
        filter: false,
        customBodyRender: (value) => {
          return value;
        },
      },
    },

    {
      label: "File Name",
      name: "document_name",
      options: {
        filter: true,
        setCellProps: () => ({ style: { maxWidth: "200px" } }),
        // customBodyRender: (value) => {
        //   return (
        //     <span>
        //       {value?.is_video
        //         ? value.video_data[0]?.title || ""
        //         : value.document_name}
        //     </span>
        //   );
        // },
      },
    },
    {
      label: "Preview",
      name: "document_key",
      options: {
        filter: false,
        setCellProps: () => ({ style: { maxWidth: "100px" } }),
        customBodyRender: (value) => {
          let filePath = "";
          let fileType = value?.document_type || "";

          switch (fileType) {
            case "image/apng":
            case "image/bmp":
            case "image/gif":
            case "image/jpeg":
            case "image/pjpeg":
            case "image/png":
            case "image/svg+xml":
            case "image/webp":
            case "image/x-icon":
              filePath = value?.document_key || ""; //Image link
              break;
            case "application/pdf":
              filePath = "/images/pdf-icon.png";
              break;
            case "application/msword":
              filePath = "/images/doc.png";
              break;
            case "application/vnd.ms-excel":
              filePath = "/images/xlsx.png";
              break;

            default:
              filePath = "/images/other.png";
              break;
          }
          return (
            <>
              {value && !value?.is_video ? (
                <div className="access__image">
                  <Link
                    href={value?.document_key}
                    target="_blank"
                    download
                    style={{ textDecoration: "none" }}
                  >
                    <img src={filePath} style={{ width: "50px" }} />
                  </Link>
                </div>
              ) : (
                <img src="/images/video.png" style={{ width: "50px" }} />
              )}
            </>
          );
        },
      },
    },
    {
      label: "Created Date",
      name: "created_date",
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
      name: "Action",
      options: {
        filter: false,
        setCellProps: () => ({ style: { minWidth: "150px" } }),
        customBodyRender: (value) => {
          return (
            <div>
              <Tooltip title="Delete">
                <Button
                  type="button"
                  className="min_width_auto"
                  color="error"
                  variant="contained"
                  onClick={() => toggleConfirmationModel(value)}
                >
                  <DeleteRoundedIcon fontSize="small" />
                </Button>
              </Tooltip>
            </div>
          );
        },
      },
    },
  ];

  const tableOptions: MUIDataTableOptions = {
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
          onClick={toggleModel}
        >
          Upload Documents
        </Button>
      );
    },
  };

  const renderResourceList = () => {
    let data: any[] = [];

    if (selectedFolderDetails && selectedFolderDetails?.document_list) {
      selectedFolderDetails?.document_list?.map(
        (listVal: any, listIndex: number) => {
          if (
            !listVal?.is_video ||
            (listVal?.is_video && listVal?.video_data?.length > 0)
          )
            data.push([
              listVal.document_id,
              listVal?.is_video
                ? listVal.video_data[0]?.title || ""
                : listVal.document_name,
              listVal,
              listVal.created_date,
              listVal,
            ]);
        }
      );
    }

    return data;
  };

  return (
    <Box>
      {/* <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Typography sx={{ m: 1, color: "#243248" }} variant="h5">
          Resource - <b>{folder_name}</b>
        </Typography>

        <Button
          color="primary"
          variant="contained"
          sx={{ m: 1 }}
          startIcon={<Add />}
          onClick={toggleModel}
        >
          Upload Documents
        </Button>
      </Box> */}
      {/* <Box sx={{ my: 3 }}>
        <Paper
          sx={{ borderRadius: "10px", minHeight: "280px", p: 2 }}
          elevation={0}
        >
          {/* <EmptyFiles /> */}
      {/*<Grid
            container
            spacing={2}
            sx={{
              width: "100%",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {[...Array(12)].map((item) => (
              <Grid item md={2}>
                <div className="elem_access">
                  <div className="access__image">
                    <img src="/images/logo.png" />
                  </div>
                  <div className="access__info--file">
                    <p className="noSelect">Download (12).png</p>
                    {/* <span className="noSelect">{moment("").format("L")}</span> */}
      {/*<span className="noSelect">12/10/2022</span>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box> */}

      {/* Resource Table */}
      <Box sx={{ my: 2 }}>
        <MUIDataTable
          title={
            <>
              <Typography
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginLeft: "-13px",
                  cursor: "pointer",
                }}
                variant="h6"
              >
                <ArrowBackIcon
                  sx={{ marginRight: "10px" }}
                  onClick={goBackToListFolder}
                />
                <span>{`Resource - ${folder_name ? folder_name : ""}`}</span>
              </Typography>
            </>
          }
          data={renderResourceList()}
          columns={tableColumns}
          options={tableOptions}
        />
      </Box>
      {openUploadDocumentsModel && (
        <UploadDocumentsModel
          folderID={folderID}
          open={openUploadDocumentsModel}
          onClose={toggleModel}
          onSubmitCallback={onSubmitCallback}
        />
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
