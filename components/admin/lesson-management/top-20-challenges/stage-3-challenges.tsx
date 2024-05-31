import * as React from "react";
import { Box, Button, Typography } from "@mui/material";
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
} from "mui-datatables";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { ApolloClientType, DialogDetails } from "../../../../store/Interface";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  deleteChallenge,
  getCategoryList,
  getTop20ChallengesList,
} from "../../../../store/thunk/admin/lesson";
import ChallengesModel from "../../model/challenges-model";

import EditIcon from "@mui/icons-material/Edit";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ConfirmationModel from "../../model/confirmation-model";

export const Stage3Challenges = (props: any) => {
  const dispatch = useAppDispatch();
  const { adminClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const { challengesList } = useAppSelector((state) => state.lessonReducer);

  const [challengeData, setChallengeData] = React.useState<any[]>([]);
  // const [categoryLessonData, setCategoryLessonData] = React.useState<[]>([]);
  // const [categoryName, setCategoryName] = React.useState<any>("");
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
  const [challegesValue, setChallengesValue] = React.useState<string>("");
  const [openChallengesModel, setOpenChallengesModel] =
    React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  // const [openCategoryModel, setOpenLessonModel] =
  //   React.useState<boolean>(false);

  React.useEffect(() => {
    dispatch(getTop20ChallengesList({ adminClient, stage_no: 3 }));
  }, []);
  const [openConfirmationModel, setOpenConfirmationModel] =
    React.useState<boolean>(false);
  const [dialogDetails, setDialogDetails] = React.useState<DialogDetails>({
    title: "",
    body_content: "",
    id: "",
  });

  React.useEffect(() => {
    if (challengesList && challengesList?.length > 0) {
      setChallengeData(challengesList);
    } else {
      setChallengeData([]);
    }
  }, [challengesList]);

  const toggleEditChallegesModel = (value: any) => {
    setChallengesValue(value);
    setOpenChallengesModel(!openChallengesModel);
  };

  // const toggleDrawer = (value: any) => {
  //   setCategoryName(value.category_name);
  //   setCategoryLessonData(
  //     value.lesson_detail?.length > 0 ? value.lesson_detail : []
  //   );
  //   setOpenLessonModel(!openCategoryModel);
  // };

  const options: MUIDataTableOptions = {
    filter: true,
    selectableRows: "none",
    selectableRowsOnClick: true,
    filterType: "dropdown",
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

  const toggleConfirmationModel = (value: any) => {
    if (value && value.challenge_id) {
      let dialogDetails: DialogDetails = {
        title: "Delete Confirmation",
        body_content: "Are you sure you want to delete this challenge?",
        id: String(value.challenge_id),
      };
      setDialogDetails(dialogDetails);
      setOpenConfirmationModel(!openConfirmationModel);
    } else {
      onCloseDialog();
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
      label: "Challenge Name",
      name: "challenge_name",
      options: {
        customBodyRender: (value) => {
          return <span>{value}</span>;
        },
      },
    },
    {
      label: "Challenge Order",
      name: "challenge_order",
      options: {
        customBodyRender: (value) => {
          return <strong>{value}</strong>;
        },
      },
    },
    {
      label: "Pdf Name",
      name: "challenge_file_name",
      options: {
        customBodyRender: (value) => {
          return <strong>{value}</strong>;
        },
      },
    },
    {
      label: "Pdf Link",
      name: "challenge_file_key",
      options: {
        setCellProps: () => ({
          style: { minWidth: "250px", maxWidth: "250px" },
        }),
        customBodyRender: (value) => {
          return (
            <a
              className="challenge_pdf_link_anchor"
              href={value}
              target="_blank"
              rel="noreferrer"
            >
              {value}
            </a>
          );
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
                onClick={() => toggleEditChallegesModel(value)}
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

  const onCloseDialog = () => {
    setDialogDetails({
      title: "",
      body_content: "",
      id: "",
    });
    setOpenConfirmationModel(!openConfirmationModel);
  };

  const handleDeleteChallenge = (id: string) => {
    if (id) {
      setLoading(true);
      let _request = {
        challengeId: +id,
        stage_no: 3,
      };
      dispatch(
        deleteChallenge({
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

  const renderList = () => {
    let data: any[] = [];
    challengeData.map((val: any, index: number) => {
      data.push([
        index + 1,
        val.challenge_name ? val.challenge_name : "-",
        val.challenge_order ? val.challenge_order : "-",
        val.challenge_file_name ? val.challenge_file_name : "-",
        val.challenge_file_key ? val.challenge_file_key : "-",
        val,
      ]);
    });
    return data;
  };

  return (
    <Box {...props}>
      <Box>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Typography sx={{ m: 1, color: "#243248" }} variant="h5">
            Top 20 Challenges - <b>Stage-3</b>
          </Typography>
          <Button
            color="primary"
            variant="contained"
            sx={{ m: 1 }}
            onClick={() => toggleEditChallegesModel(null)}
          >
            Add Challeges
          </Button>
        </Box>

        <Box sx={{ my: 2 }}>
          <MUIDataTable
            title={""}
            data={renderList()}
            columns={tableColumns}
            options={options}
          />
        </Box>
      </Box>
      {openChallengesModel && (
        <ChallengesModel
          challegesValue={challegesValue}
          open={openChallengesModel}
          onClose={toggleEditChallegesModel}
          stage_no={3}
        />
      )}
      {openConfirmationModel && (
        <ConfirmationModel
          loading={loading}
          dialogDetails={dialogDetails}
          modelOpen={openConfirmationModel}
          onClose={onCloseDialog}
          onDelete={handleDeleteChallenge}
        />
      )}
    </Box>
  );
};
