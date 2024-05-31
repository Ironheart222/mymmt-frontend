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
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
} from "mui-datatables";
import * as moment from "moment";

interface PropType {
  lessonData: any[];
  open: boolean;
  categoryName: string;
  onClose: (event: any) => void;
}

export default function CategoryLessonModel(props: PropType) {
  let { open, onClose, lessonData, categoryName } = props;

  const [lessonList, setLessonList] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (lessonData.length > 0) {
      setLessonList(lessonData);
    } else {
      setLessonList([]);
    }
  }, [lessonData]);

  const options: MUIDataTableOptions = {
    filter: true,
    selectableRows: "none",
    selectableRowsOnClick: true,
    filterType: "dropdown",
    responsive: "vertical",
    rowsPerPage: 25,
    rowsPerPageOptions: [25, 50, 100, 150],
    download: false,
    print: false,
    viewColumns: false,
  };

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
      label: "Video title",
      name: "video title",
    },
    {
      label: "Video description",
      name: "video description",
      options: {
        filter: false,
        setCellProps: () => ({ style: { minWidth: "150px" } }),
        customBodyRender: (value) => {
          return (
            <Box>
              <div dangerouslySetInnerHTML={{ __html: value }}></div>
            </Box>
          );
        },
      },
    },
    {
      label: "Status",
      name: "status",
      options: {
        setCellProps: () => ({ style: { minWidth: "150px" } }),
        customBodyRender: (value) => {
          return value.toUpperCase();
        },
      },
    },
    {
      label: "Stage no",
      name: "stage_no",
      options: {
        setCellProps: () => ({ style: { minWidth: "150px" } }),
        customBodyRender: (value) => {
          return `Stage ${value == 20 ? "2" : "3"}`;
        },
      },
    },
    {
      label: "upload time",
      name: "upload time",
      options: {
        setCellProps: () => ({ style: { minWidth: "200px" } }),
        customBodyRender: (value) => {
          return moment.unix(value).format("MMM Do YYYY, HH:mm:ss");
        },
      },
    },
  ];

  const renderList = () => {
    let data: any[] = [];
    lessonList.map((val: any, index: number) => {
      data.push([
        index + 1,
        val.vdo_cipher_video.title ? val.vdo_cipher_video.title : "-",
        val.vdo_cipher_video.description
          ? val.vdo_cipher_video.description
          : "-",
        val.vdo_cipher_video.status ? val.vdo_cipher_video.status : "-",
        val.stage_no ? val.stage_no : "-",
        val.vdo_cipher_video.upload_time
          ? val.vdo_cipher_video.upload_time
          : "-",
      ]);
    });

    return data;
  };

  return (
    <Dialog
      open={open}
      fullWidth={true}
      maxWidth={"lg"}
      PaperProps={{
        style: {
          borderRadius: "10px",
          overflowY: "clip",
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ float: "left" }}>
          {categoryName}
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
        <Box>
          <MUIDataTable
            title={""}
            data={renderList()}
            columns={tableColumns}
            options={options}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
