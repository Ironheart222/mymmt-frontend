import * as React from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Link,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { ApolloClientType } from "../../store/Interface";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getResourceFolderDetailByFolderId } from "../../store/thunk/admin/resourceThunk";
import VaultVideoPlayerResource from "../video-player/videoplayer-resource";
import { GetResourceFolderDetail } from "../../store/slices/admin/resourceSlice";
import moment from "moment";
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
} from "mui-datatables";

function PortalResourcesDetails(props: any) {
  const dispatch = useAppDispatch();
  const [folderID, setFolderID] = React.useState<string>(props.folderId);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);

  const { userClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );

  const { selectedFolderDetails }: any = useAppSelector(
    (state) => state.resourceSlice
  );

  const { folder_name }: any = selectedFolderDetails;

  React.useEffect(() => {
    dispatch(GetResourceFolderDetail([]));
  }, []);

  React.useEffect(() => {
    if (folderID) {
      setLoading(true);
      const requestData = {
        folder_id: Number(folderID),
      };

      dispatch(
        getResourceFolderDetailByFolderId({
          _request: requestData,
          userClient,
          result: (response: any) => {
            setLoading(false);
          },
        })
      );
    }
  }, [folderID]);

  React.useEffect(() => {
    setFolderID(props.folderId);
  }, [props.folderId]);

  const DetailItemPortionDocument = ({ documentDetail }: any) => {
    const {
      document_name,
      created_date,
      document_type,
      video_data,
      is_video,
      document_key,
    } = documentDetail;
    let filePath = "";
    let fileType = document_type || "";

    switch (fileType) {
      case "image/apng":
      case "image/bmp":
      case "image/gif":
      case "image/jpeg":
      case "image/pjpeg":
      case "image/png":
      case "image/jpeg":
      case "image/svg+xml":
      case "image/webp":
      case "image/x-icon":
        filePath = document_key || ""; //Image link
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

    let itemDivDocument = (
      <>
        <Grid item md={2} sm={3} xs={12}>
          <Link
            href={document_key}
            target="_blank"
            download
            style={{ textDecoration: "none" }}
          >
            <div className="elem_access">
              <div
                className="access__image"
                style={{ justifyContent: "center" }}
              >
                <img src={filePath} style={{ width: "100px" }} />
              </div>
              <div className="access__info--file">
                <Tooltip
                  title={is_video ? video_data[0]?.title : document_name}
                >
                  <p className="noSelect">
                    {is_video ? video_data[0]?.title : document_name}
                  </p>
                </Tooltip>
                <span className="noSelect">
                  {created_date
                    ? moment(created_date).format("MMM Do YYYY, HH:mm:ss")
                    : "-"}
                </span>
              </div>
            </div>
          </Link>
        </Grid>
      </>
    );
    return itemDivDocument;
  };

  const DetailItemPortionVideo = ({ documentDetail }: any) => {
    const { document_name, created_date, video_data, is_video } =
      documentDetail;
    let filePath = "";

    let itemDivVideo = (
      <>
        <Grid item md={3} sm={3} xs={12}>
          <div className="elem_access">
            <VaultVideoPlayerResource resourceObj={documentDetail} />

            <div className="access__info--file">
              <Tooltip title={is_video ? video_data[0]?.title : document_name}>
                <p className="noSelect">
                  {is_video ? video_data[0]?.title : document_name}
                </p>
              </Tooltip>
              {/* <span className="noSelect">
                {created_date
                  ? moment(created_date).format("MMM Do YYYY, HH:mm:ss")
                  : "-"}
              </span> */}
            </div>
          </div>
        </Grid>
      </>
    );
    return itemDivVideo;
  };

  const tableDocumentColumns: MUIDataTableColumn[] = [
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
  ];

  const tableDocumentOptions: MUIDataTableOptions = {
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

  const renderResourceDocumentList = () => {
    let data: any[] = [];

    if (selectedFolderDetails && selectedFolderDetails?.document_list) {
      selectedFolderDetails?.document_list?.map(
        (listVal: any, listIndex: number) => {
          if (!listVal?.is_video) {
            data.push([
              listVal.document_id,
              listVal?.is_video
                ? listVal.video_data[0]?.title || ""
                : listVal.document_name,
              listVal,
              listVal.created_date,
            ]);
          }
        }
      );
    }

    return data;
  };

  return (
    <Box>
      <Box sx={{ mb: 1 }}>
        <Typography variant="body1" className="header-h6 border-green">
          Resource - <b>{folder_name ? folder_name : ""}</b>
        </Typography>
      </Box>
      {!loading && (
        <Box sx={{ my: 3 }}>
          <Paper
            sx={{ borderRadius: "10px", minHeight: "280px", p: 2 }}
            elevation={0}
          >
            <Grid
              container
              spacing={2}
              sx={{
                width: "100%",
              }}
            >
              {selectedFolderDetails &&
                selectedFolderDetails?.document_list?.length == 0 && (
                  <Typography sx={{ m: 1, color: "#243248" }} variant="h6">
                    No Record Found
                  </Typography>
                )}

              {selectedFolderDetails &&
                selectedFolderDetails?.document_list?.length > 0 && (
                  <Typography
                    variant="subtitle2"
                    className="header-subtext"
                    sx={{ mb: 2, width: "100%" }}
                  >
                    Documents
                  </Typography>
                )}
            </Grid>
            {/* Resource Document Table */}
            {selectedFolderDetails &&
              selectedFolderDetails?.document_list?.length > 0 && (
                <Box>
                  <MUIDataTable
                    title=""
                    data={renderResourceDocumentList()}
                    columns={tableDocumentColumns}
                    options={tableDocumentOptions}
                  />
                </Box>
              )}
            <Grid
              container
              spacing={2}
              sx={{
                width: "100%",
              }}
            >
              {selectedFolderDetails &&
                selectedFolderDetails?.document_list?.length > 0 && (
                  <Typography
                    variant="subtitle2"
                    className="header-subtext"
                    sx={{ mt: 4, width: "100%" }}
                  >
                    Videos
                  </Typography>
                )}
              {selectedFolderDetails &&
                selectedFolderDetails?.document_list?.map((document: any) => {
                  if (
                    document?.is_video === true &&
                    document?.video_data?.length > 0
                  )
                    return (
                      <DetailItemPortionVideo
                        documentDetail={document}
                        key={document.document_key}
                      />
                    );
                })}
            </Grid>
          </Paper>
        </Box>
      )}
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      )}
    </Box>
  );
}

export default PortalResourcesDetails;
