import * as React from "react";
import {
  IconButton,
  InputAdornment,
  Button,
  Box,
  Typography,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  SelectChangeEvent,
  FormHelperText,
  OutlinedInput,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { ApolloClientType } from "../../../store/Interface";
import Validations from "../../../helpers/validations";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import FolderIcon from "@mui/icons-material/Folder";
import Link from "next/link";
import Select2 from "react-select";
import {
  addResourcesFolderDocuments,
  getVideoForMapping,
} from "../../../store/thunk/admin/resourceThunk";
import { getVideosFromVdoCipher } from "../../../store/thunk/admin/lesson";
import { getParentList } from "../../../store/thunk/admin/adminAuthThunk";

interface FormValues {
  //title: string,
  //description: string,
  file: File | null;
  name: string;
  fileURL?: string;
}

interface State {
  folderName: string;
}

// interface FormValidation {
//     folder_name: string,
// }

interface FormError {
  file?: string;
  fileURL?: string;
  parent_id?: string;
  video_id?: string;
}

interface PropType {
  folderID: string;
  open: boolean;
  onClose: (event: any) => void;
  onSubmitCallback: () => void;
}

const fileType = [
  "image/apng",
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/pjpeg",
  "image/png",
  "image/svg+xml",
  "image/tiff",
  "image/webp",
  "image/x-icon",
  "application/pdf",
  //"video/mp4",
  "application/vnd.ms-excel",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
//const videoExt = ['mp4'];
const acceptFileFormat =
  ".pdf,.doc,.docx,.xlsx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document.pdf,image/*,audio/*";
// const STAGE_NO_TO_GET_VIDEO = 2;
const STAGE_NO_TO_GET_VIDEO = 50;

export default function UploadDocumentsModel(props: PropType) {
  let { folderID, open, onClose, onSubmitCallback } = props;

  const dispatch = useAppDispatch();
  const { adminClient, uploadClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const notificationInfo = useAppSelector((state) => state.notificationReducer);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [allVdocipher, setAllVdocipher] = React.useState<any[]>([]);
  const [selectedParentList, setSelectedParentList] = React.useState<any[]>([]);
  const [selectedVideoList, setSelectedVideoList] = React.useState<any[]>([]);
  const [uploadDocType, setUploadDocType] = React.useState<string>("video");
  const { videoList } = useAppSelector((state) => state.lessonReducer);

  const { videoListFromVdocipher } = useAppSelector(
    (state) => state.resourceSlice
  );

  React.useEffect(() => {
    if (videoList) {
      const allVdocipher = videoList?.rows?.map((v: any) => {
        return {
          value: v.id,
          label: v.title,
        };
      });
      setAllVdocipher(allVdocipher);
    }
  }, [videoList]);

  React.useEffect(() => {
    if (notificationInfo) {
      setLoading(false);
    }
  }, [notificationInfo]);

  React.useEffect(() => {
    dispatch(getParentList(adminClient));
    const req = {
      stage_no: STAGE_NO_TO_GET_VIDEO.toString(),
      page_no: 0,
    };
    dispatch(getVideosFromVdoCipher({ _request: req, adminClient }));
  }, []);

  let initialValue: FormValues = {
    file: null,
    name: "",
  };

  const [values, setValues] = React.useState<FormValues>(initialValue);
  const [formError, setFormError] = React.useState<FormError>({});

  const fileExtension = (filename: any) => {
    if (!filename) return "";
    let ext = (/[^./\\]*$/.exec(filename) || [""])[0];
    return ext.toLowerCase();
  };

  const handleSubmit = () => {
    const fileExt = fileExtension(values.name);
    let selectedVideoData =
      videoList &&
      selectedVideoList.length > 0 &&
      videoList?.rows?.filter(
        (val: any) => val.id === selectedVideoList[0].value
      );

    const videoData =
      uploadDocType === "video" && selectedVideoList.length
        ? selectedVideoData
        : "";
    const requestData = {
      file: values.file || null,
      is_video: uploadDocType === "video" ? true : false,
      video_data: videoData,
      parent_id: [],
      folder_id: Number(folderID),
    };

    let error: any = Validations.validateUploadDocumentsForm(requestData);
    if (Object.entries(error).length === 0 && error.constructor === Object) {
      setLoading(true);
      dispatch(
        addResourcesFolderDocuments({
          _request: requestData,
          adminClient,
          uploadClient,
          result: (res: any) => {
            setLoading(false);
            onClose(null);
            if (onSubmitCallback) {
              onSubmitCallback();
            }
          },
        })
      );
    }
    setFormError(error);
  };

  const handleChange = (field: any) => (event: any) => {
    if (field == "selParents") {
      setSelectedParentList((ls) => [...event]);
    }
    if (field == "uploadDocType") {
      setUploadDocType(event.target.value);
      setSelectedVideoList([]);
      setValues(initialValue);
    }
    if (field == "selVideo") {
      setSelectedVideoList((ls) => [event]);
    }
  };

  const handleChangeFile = (event: any) => {
    if (event && event.target.files[0]) {
      if (!fileType.includes(event.target.files[0].type)) {
        setFormError({
          ...formError,
          file: "File type not supported!",
        });
      } else if (event.target.files[0].size > 50 * 1024 * 1024) {
        setFormError({
          ...formError,
          file: "The file must be smaller than 50Mb",
        });
      } else {
        setValues({
          ...values,
          file: event.target.files[0],
          name: event.target.files[0].name,
        });

        setFormError({
          ...formError,
          file: "",
        });
      }
    } else {
      setFormError({
        ...formError,
        file: "",
      });
    }
  };

  return (
    <Dialog
      open={open}
      fullWidth={true}
      maxWidth={"sm"}
      PaperProps={{
        style: {
          borderRadius: "10px",
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ float: "left" }}>
          Upload Documents
        </Typography>
        <IconButton
          color="default"
          sx={{ float: "right" }}
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box className="form-element">
          <Grid component={"form"} container spacing={1} direction="column">
            <Grid item>
              <div>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <InputLabel className="textfield-label">Type*</InputLabel>
                </Box>
                <RadioGroup
                  row
                  onChange={handleChange("uploadDocType")}
                  value={uploadDocType}
                >
                  <FormControlLabel
                    value={"video"}
                    control={<Radio />}
                    label="Video"
                  />
                  <FormControlLabel
                    value={"other"}
                    control={<Radio />}
                    label="Other"
                  />
                </RadioGroup>
              </div>
            </Grid>

            {uploadDocType === "other" && (
              <Grid item>
                <InputLabel className="textfield-label">
                  Attachments*
                </InputLabel>
                <TextField
                  required
                  fullWidth
                  type="file"
                  inputProps={{ accept: acceptFileFormat }}
                  // value={values.email}
                  onChange={handleChangeFile}
                  placeholder="Worksheet"
                  autoFocus
                  error={formError && formError.file ? true : false}
                  helperText={formError && formError.file}
                />
                {values && values.fileURL && (
                  <Typography variant="body1" component={"p"} sx={{ mt: 1 }}>
                    <strong>URL: </strong>
                    <Link href={values.fileURL}>
                      <a target="_blank">{values.fileURL}</a>
                    </Link>
                  </Typography>
                )}
              </Grid>
            )}

            {uploadDocType === "video" && (
              <Grid item>
                <InputLabel className="textfield-label">
                  Select Video*
                </InputLabel>
                <Select2
                  options={allVdocipher}
                  isMulti={false}
                  name="parentSelection"
                  placeholder={"Select Video *"}
                  value={selectedVideoList ? selectedVideoList : []}
                  onChange={handleChange("selVideo")}
                  closeMenuOnSelect={true}
                  className="basic-multi-select"
                  classNamePrefix="select "
                  isSearchable={true}
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 1400 }) }}
                />
                {formError.video_id && (
                  <span className="error-message">{formError.video_id}</span>
                )}
              </Grid>
            )}

            <Grid item textAlign={"end"} sx={{ mt: 1 }}>
              <Button
                variant="contained"
                onClick={() => {
                  handleSubmit();
                }}
                disabled={loading ? true : false}
              >
                Upload
                {loading && <CircularProgress color={"inherit"} size={20} />}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
