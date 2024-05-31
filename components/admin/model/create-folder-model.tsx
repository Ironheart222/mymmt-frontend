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
  CircularProgress,
} from "@mui/material";

import { Person } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { ApolloClientType } from "../../../store/Interface";
import Validations from "../../../helpers/validations";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import FolderIcon from "@mui/icons-material/Folder";
import { addResourcesFolder } from "../../../store/thunk/admin/resourceThunk";
import { getParentList } from "../../../store/thunk/admin/adminAuthThunk";
import Select2 from "react-select";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

interface State {
  folderName: string;
  folderDescription: string;
}

interface FormValidation {
  folder_name: string;
  parent_id: number[];
}

interface PropType {
  editData: any;
  open: boolean;
  onClose: (event: any) => void;
}

export default function CreateFolderModel(props: PropType) {
  let { open, onClose, editData } = props;

  const dispatch = useAppDispatch();
  const { adminClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const notificationInfo = useAppSelector((state) => state.notificationReducer);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [allParentList, setAllParentList] = React.useState<any[]>([]);
  const [selectedParentList, setSelectedParentList] = React.useState<any[]>([]);
  const { parentListData } = useAppSelector((state) => state.adminReducer);
  let defaultOption = [{ label: "All", value: 0 }]; //Set default option for All parent
  const [optValue, setOptValue] = React.useState("all");

  React.useEffect(() => {
    if (parentListData) {
      const filteredParentList = parentListData.filter((parent: any) => {
        return (
          parent.is_active == true &&
          parent.is_delete == false &&
          parent.is_varified == true
        );
      });
      const allParentList = filteredParentList.map((p: any) => {
        return {
          value: p.parent_id,
          label: `${p.first_name} ${p.last_name}`,
        };
      });

      // setAllParentList(defaultOption.concat(allParentList));
      setAllParentList(allParentList);
    }

    adjustParentListSelection();
  }, [parentListData]);

  React.useEffect(() => {
    if (notificationInfo) {
      setLoading(false);
    }
  }, [notificationInfo]);

  const [formData, setFormData] = React.useState<State>({
    folderName: "",
    folderDescription: "",
  });
  const [formError, setFormError] = React.useState<Partial<FormValidation>>();
  console.log("formError", formError);
  React.useEffect(() => {
    if (editData && Object.keys(editData).length) {
      setFormData({
        folderName: editData?.folder_name || "",
        folderDescription: editData?.folder_description || "",
      });
      adjustParentListSelection();
    }
  }, [editData]);

  const adjustParentListSelection = () => {
    if (editData && Object.keys(editData).length) {
      let parentIds = editData?.parent_id || [];
      const selectedParentListFilter = parentListData.filter((p: any) => {
        if (parentIds.includes(parseInt(p.parent_id))) {
          return p;
        }
      });

      let filterListSelection = selectedParentListFilter.map((p: any) => {
        return {
          value: p.parent_id,
          label: `${p.first_name} ${p.last_name}`,
        };
      });

      if (parentIds.length == 0) {
        // filterListSelection = defaultOption;
        setOptValue("all");
      } else {
        setOptValue("parent");
      }

      setSelectedParentList(filterListSelection);
    } else {
      // setSelectedParentList(defaultOption); //Set Select All By Default
      setOptValue("all");
    }
  };

  const handleChange =
    (prop: keyof State) =>
    (
      event:
        | SelectChangeEvent<string>
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setFormData({
        ...formData,
        [prop]: event.target.value,
      });
    };

  React.useEffect(() => {
    dispatch(getParentList(adminClient));
  }, []);

  const handleChangeParentSelect = (field: any) => (event: any) => {
    if (field == "selParents") {
      setSelectedParentList((ls) => [...event]);
    }
  };

  const handleSubmit = () => {
    let allParentStatus = false;
    let selectedParentIds = selectedParentList.map((p: any) => Number(p.value));

    if (optValue === "all") {
      selectedParentIds = [];
      allParentStatus = true;
    }

    const requestData = {
      id: +editData?.folder_id || null,
      name: formData.folderName.trim(),
      description: formData.folderDescription.trim(),
      is_active: editData?.is_active || true,
      is_delete: editData?.is_delete || false,
      parent_id: selectedParentIds || [],
      all_parent: allParentStatus,
    };

    let error: Partial<FormValidation> =
      Validations.validateFolderForm(requestData);

    if (Object.entries(error).length === 0 && error.constructor === Object) {
      setLoading(true);
      dispatch(
        addResourcesFolder({
          _request: requestData,
          adminClient,
          result: (res: any) => {
            setLoading(false);
            onClose(null);
          },
        })
      );
    }
    setFormError(error);
  };

  const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOptValue((event.target as HTMLInputElement).value);
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
          {editData && Object.keys(editData).length > 0
            ? "Update Folder"
            : "Create New Folder"}
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

      <DialogContent style={{ overflow: "hidden" }}>
        <Box className="form-element">
          <Grid component={"form"} container spacing={1} direction="column">
            <Grid item>
              {/* <InputLabel className="textfield-label">Folder Name</InputLabel> */}
              <TextField
                required
                fullWidth
                id="name"
                name="child name"
                value={formData.folderName}
                onChange={handleChange("folderName")}
                autoComplete="given_folder_name"
                placeholder="Folder Name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FolderIcon />
                    </InputAdornment>
                  ),
                }}
                error={formError && formError.folder_name ? true : false}
                helperText={formError && formError.folder_name}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                id="description"
                name="description"
                value={formData.folderDescription}
                onChange={handleChange("folderDescription")}
                placeholder="Description"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={optValue}
                row
                onChange={handleChangeRadio}
              >
                <FormControlLabel value="all" control={<Radio />} label="All" />
                <FormControlLabel
                  value="parent"
                  control={<Radio />}
                  label="Select Parent"
                />
              </RadioGroup>
            </Grid>
            {/* Parent Selection */}
            {optValue && optValue == "parent" ? (
              <Grid item>
                <Select2
                  options={allParentList}
                  isMulti
                  name="parentSelection"
                  placeholder={"Select Parents *"}
                  value={selectedParentList ? selectedParentList : []}
                  onChange={handleChangeParentSelect("selParents")}
                  closeMenuOnSelect={false}
                  className="basic-multi-select"
                  classNamePrefix="select "
                  isSearchable={true}
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 1400 }) }}
                />
                <FormHelperText className="error-form-helpertext">
                  {formError && formError.parent_id ? formError.parent_id : ""}
                </FormHelperText>
              </Grid>
            ) : null}

            <Grid item textAlign={"end"} sx={{ mt: 1 }}>
              <Button
                variant="contained"
                onClick={() => {
                  handleSubmit();
                }}
                disabled={loading ? true : false}
              >
                {editData && Object.keys(editData).length > 0
                  ? "Update"
                  : "Create"}
                {loading && <CircularProgress color={"inherit"} size={20} />}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
