import * as React from "react";
import {
  Button,
  Box,
  Typography,
  InputLabel,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  DialogTitle,
} from "@mui/material";
import Validations from "../../../helpers/validations";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { ApolloClientType, WorksheetData } from "../../../store/Interface";
import { addUpdateChallenge } from "../../../store/thunk/admin/lesson";
import Link from "next/link";
import { GetWorksheetDataById } from "../../../store/slices/admin/lessonSlice";

interface PropType {
  onClose: () => void;
  open: boolean;
  editId: string;
  stage_no: number;
}

interface FormValues {
  challenge_name: string;
  challenge_order: string;
  file: File | null;
  fileURL?: string;
}

interface FormError {
  challenge_name?: string;
  challenge_order?: string;
  file?: string;
  fileURL?: string;
}

let initialFormValue: any = {
  worksheet_id: 0,
  worksheet_name: "",
  worksheet_description: "",
  worksheet_url: "",
  stage_no: "",
  is_delete: false,
  created_date: new Date(0),
  updated_date: new Date(0),
};

const fileType = [
  "application/pdf",
  // "application/msword",
  // "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

export default function ChallengesModel(props: any) {
  const { onClose, open, challegesValue, stage_no } = props;

  console.log("challegesValue", challegesValue);

  const dispatch = useAppDispatch();
  const { adminClient, uploadClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const notificationInfo = useAppSelector((state) => state.notificationReducer);

  const [values, setValues] = React.useState<any>({});
  const [formError, setFormError] = React.useState<FormError>({});
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (notificationInfo) {
      setLoading(false);
    }
  }, [notificationInfo]);

  React.useEffect(() => {
    setValues(challegesValue);
  }, [challegesValue]);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  console.log("values", values);

  const handleChangeFile = (event: any) => {
    if (event && event.target.files[0]) {
      if (!fileType.includes(event.target.files[0].type)) {
        setFormError({
          ...formError,
          file: "You can only upload PDF file!",
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

  const handleSubmit = () => {
    let reqParams = {
      challenge_id: values?.challenge_id ? +values.challenge_id : 0,
      challenge_name: values?.challenge_name?.trim() || "",
      challenge_order: +values?.challenge_order || "",
      file: values?.file || null,
      stage_no: +stage_no,
    };
    if (values?.challenge_id) {
      Object.assign(reqParams, { file: values.file });
    }
    let allError = Validations.validateChallegesForm(reqParams);

    if (
      Object.entries(allError).length === 0 &&
      allError.constructor === Object
    ) {
      setLoading(true);
      dispatch(
        addUpdateChallenge({
          _request: reqParams,
          adminClient,
          uploadClient,
          onClose,
        })
      );
    }
    setFormError(allError);
  };

  return (
    <Dialog
      open={open}
      fullWidth={true}
      maxWidth="sm"
      PaperProps={{
        style: {
          borderRadius: "8px",
        },
      }}
    >
      <DialogTitle
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Typography variant="h6" color={"#000000"}>
          Upload Challenges
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box
          component="form"
          className="form-element"
          noValidate
          sx={{ mt: 2 }}
        >
          <InputLabel className="textfield-label">Challeges Name*</InputLabel>
          <TextField
            required
            fullWidth
            id="challenge_name"
            name="challenge_name"
            value={values?.challenge_name}
            onChange={handleChangeInput}
            autoComplete="Challeges Name"
            placeholder="Enter Challeges Name"
            autoFocus
            error={formError && formError.challenge_name ? true : false}
            helperText={formError && formError.challenge_name}
          />

          <InputLabel className="textfield-label">Challeges Order*</InputLabel>
          <TextField
            required
            fullWidth
            type={"number"}
            id="challenge_order"
            name="challenge_order"
            value={values?.challenge_order}
            onChange={handleChangeInput}
            autoComplete="Challeges Order"
            placeholder="Enter Challeges Order"
            autoFocus
            error={formError && formError.challenge_order ? true : false}
            helperText={formError && formError.challenge_order}
          />

          {/* {
                        !editId && (
                            <> */}
          <InputLabel className="textfield-label">Attachments*</InputLabel>
          <TextField
            required
            fullWidth
            type="file"
            inputProps={{ accept: ".doc,.docx,.pdf" }}
            // value={values.email}
            onChange={handleChangeFile}
            placeholder="Worksheet"
            autoFocus
            error={formError && formError.file ? true : false}
            helperText={formError && formError.file}
          />
          {values && values.challenge_file_key && (
            <Typography variant="body1" component={"p"} sx={{ mt: 1 }}>
              <strong>URL: </strong>
              <Link href={values.challenge_file_key}>
                <a target="_blank">{values.challenge_file_key}</a>
              </Link>
            </Typography>
          )}
          {/* </>
                        )
                    } */}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          pr: 3,
          my: 1,
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button type="button" color="inherit" variant="text" onClick={onClose}>
          Cancel
        </Button>

        <Button
          type="button"
          variant="contained"
          onClick={handleSubmit}
          disabled={loading ? true : false}
        >
          {challegesValue ? "Update" : "Upload"}
          {loading && <CircularProgress color={"primary"} size={20} />}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
