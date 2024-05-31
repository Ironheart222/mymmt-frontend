import * as React from "react";
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";
import { Edit, PersonAddAlt1Rounded } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getAllChildInfo } from "../../store/thunk/childThunk";
import {
  ApolloClientType,
  ChildParam,
  ParentParam,
} from "../../store/Interface";
import Auth from "../../config/auth";
import ParentSettingsLayout from "../../components/parent-setting/parent-settings-layout";
import AddChildModel from "../../components/model/add-child-model";
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
  MUIDataTableProps,
} from "mui-datatables";
import {
  getParentById,
  getSubscriptionDetails,
} from "../../store/thunk/parentThunk";
import EditParentProfileModel from "../../components/model/edit-parent-profile";
import { verifyPurchasedPlan } from "../../store/thunk/subscription";
import Link from "next/link";
import moment from "moment";
import AddChildCompleteModel from "../../components/model/add-child-complete-model";
import MaxChildErrorModel from "../../components/model/max-child-error-model";
import { phoneNumberformat } from "../../helpers/helper";
import { useRouter } from "next/router";
import {
  notificationFail,
  notificationSuccess,
} from "../../store/slices/notificationSlice";

const defaultProps = {
  bgcolor: "background.paper",
  borderColor: "text.primary",
  borderRadius: "6%",
  m: 1,
  p: 2,
  border: 1,
};

export enum genderType {
  MALE = "male",
  FEMALE = "female",
  NA = "N/A",
}

interface FormData {
  child_id: string;
  child_name: string;
  child_age: number;
  birth_date: string;
  gender?: string;
  school_name?: string;
  class_no?: string;
  stage_no?: number;
  video_allowed_count?: number;
  past_video_no?: number;
  curr_video_no?: number;
  last_changed_week?: number;
  parent_id?: number;
  profile_image_url?: string;
  created_date?: string;
  updated_date?: string;
}

const classArray = ["year 3", "year 4"];

function StudentProfile() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { userClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const { childListData } = useAppSelector((state) => state.childReducer);
  const { purchasePlan } = useAppSelector((state) => state.subscriptionSlice);
  const { parentProfileData } = useAppSelector((state) => state.parentReducer);
  const notificationInfo = useAppSelector((state) => state.notificationReducer);

  const [openEditParentModel, setOpenEditParentModel] =
    React.useState<boolean>(false);
  const [openAddChildModel, setOpenAddChildModel] =
    React.useState<boolean>(false);
  const [maxChildError, setMaxChildError] = React.useState<boolean>(false);
  const [planPurchase, setPlanPurchase] = React.useState<any>("");
  const [planPurchaseError, setPlanPurchaseError] =
    React.useState<boolean>(false);
  // const [showAddChildBtn, setShowAddChildBtn] = React.useState<boolean>(false);
  const [childList, setChildList] = React.useState<[ChildParam] | null>(null);
  const [parentData, setParentData] = React.useState<ParentParam | null>(null);
  const [editChildID, setEditChildID] = React.useState<string>("");
  const [editParentID, setEditParentID] = React.useState<string>("");
  const [openCompleteAddChildModel, setOpenCompleteAddChildModel] =
    React.useState<boolean>(false);
  const [allSetupModel, setAllSetupModel] = React.useState<boolean>(false);

  React.useEffect(() => {
    dispatch(verifyPurchasedPlan(userClient));
    dispatch(getAllChildInfo(userClient));
    // dispatch(getParentById({ _request: "", client: userClient }));
  }, []);

  React.useEffect(() => {
    if (router.query.status && router.query.status == "success") {
      if (router?.query?.subscription_id) {
        let requestParam = {
          subscription_id: router?.query?.subscription_id,
        };
        dispatch(
          getSubscriptionDetails({ _request: requestParam, userClient })
        );
      }

      dispatch(notificationSuccess("Plan purchased successfully"));
    } else if (router.query.status && router.query.status == "fail") {
      dispatch(notificationFail("Failed Transaction"));
    }
  }, [router.query]);

  React.useEffect(() => {
    setChildList(childListData ? childListData : null);
  }, [childListData]);

  React.useEffect(() => {
    if (parentProfileData && Object.keys(parentProfileData).length > 0) {
      setParentData(parentProfileData);
    } else {
      setParentData(null);
    }
  }, [parentProfileData]);

  React.useEffect(() => {
    if (Object.keys(purchasePlan).length > 0) {
      setPlanPurchaseError(false);
      setPlanPurchase(purchasePlan);
    } else {
      setPlanPurchase("");
    }
  }, [purchasePlan]);

  // React.useEffect(() => {
  //     let childLimit = Number(parentData?.product?.metadata?.max_child_allowed || 0);

  //     if (planPurchase) {
  //         if (childList && childList.length >= childLimit) {
  //             setShowAddChildBtn(false);
  //         } else {
  //             setShowAddChildBtn(true);
  //         }
  //     }

  // }, [planPurchase, parentData, childList]);

  React.useEffect(() => {
    if (maxChildError || planPurchaseError) {
      window.scroll({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [maxChildError, planPurchaseError]);

  const toggleOpenAddModel = (type: string) => {
    if (type === "EDIT") {
      if (openAddChildModel) {
        setEditChildID("");
      }
      setOpenAddChildModel(true);
    } else {
      let childLimit = Number(
        parentData?.product?.metadata?.max_child_allowed || 0
      );

      if (!planPurchase) {
        setPlanPurchaseError(true);
        return;
      }
      if (!childList || (childList && childList.length <= 0)) {
        setAllSetupModel(true);
      } else {
        setAllSetupModel(false);
      }
      if (childList && childList.length >= childLimit) {
        setMaxChildError(true);
      } else {
        setMaxChildError(false);
        if (openAddChildModel) {
          setEditChildID("");
        }
        setOpenAddChildModel(true);
      }
    }
  };

  const toggleCloseAddModel = () => {
    if (openAddChildModel) {
      setEditChildID("");
    }
    setOpenAddChildModel(false);
  };

  const toggleCompleteAddChildModel = () => {
    setOpenCompleteAddChildModel(!openCompleteAddChildModel);
  };

  const toggleEditParentModel = (value: string | null) => {
    setEditParentID(value ? value : "");
    setOpenEditParentModel(!openEditParentModel);
  };

  const handleAddChild = (value: ChildParam) => {
    if (value) {
      setEditChildID(value.child_id);
      toggleOpenAddModel("EDIT");
    }
  };

  const parentTableColumns: MUIDataTableColumn[] = [
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
      label: "First name",
      name: "first_name",
      options: {
        setCellProps: () => ({ style: { minWidth: "120px" } }),
      },
    },
    {
      label: "Last name",
      name: "last_name",
      options: {
        setCellProps: () => ({ style: { minWidth: "120px" } }),
      },
    },
    {
      label: "Email",
      name: "email",
    },
    {
      label: "Phone",
      name: "mobile_no",
      options: {
        setCellProps: () => ({ style: { minWidth: "150px" } }),
      },
    },
    {
      label: "Appt/Suite/Unit",
      name: "apartment_no",
      options: {
        setCellProps: () => ({ style: { minWidth: "150px" } }),
      },
    },
    {
      label: "Street line 1",
      name: "street_1",
      options: {
        setCellProps: () => ({ style: { minWidth: "150px" } }),
      },
    },
    {
      label: "Street line 2",
      name: "street_2",
      options: {
        setCellProps: () => ({ style: { minWidth: "150px" } }),
      },
    },
    {
      label: "Suburb",
      name: "suburb",
      options: {
        setCellProps: () => ({ style: { minWidth: "120px" } }),
      },
    },
    {
      label: "State",
      name: "state",
      options: {
        setCellProps: () => ({ style: { minWidth: "150px" } }),
      },
    },
    {
      label: "Postal code",
      name: "postal_code",
    },
    {
      label: "Country",
      name: "country",
    },
    {
      name: "Action",
      options: {
        filter: false,
        // setCellProps: () => ({ style: { minWidth: "150px", maxWidth: "150px" } }),
        customBodyRender: (value) => {
          return (
            <>
              <Button
                type="button"
                className="min_width_auto"
                color="primary"
                variant="contained"
                title="View Detail"
                onClick={() => toggleEditParentModel(value)}
              >
                <Edit fontSize="small" />
              </Button>
            </>
          );
        },
      },
    },
  ];

  const renderParentData = () => {
    let data: any[] = [];
    // parentProfileData && parentProfileData.map((val: ParentParam, index: number) => {
    data.push([
      1,
      parentData?.first_name ? parentData.first_name : "-",
      parentData?.last_name ? parentData.last_name : "-",
      parentData?.email ? parentData?.email : "-",
      phoneNumberformat(parentData?.mobile_no || ""),
      parentData?.apartment_no ? parentData?.apartment_no : "-",
      parentData?.street_1 ? parentData?.street_1 : "-",
      parentData?.street_2 ? parentData?.street_2 : "-",
      parentData?.suburb ? parentData?.suburb : "-",
      parentData?.state ? parentData?.state : "-",
      parentData?.postal_code ? parentData?.postal_code : "-",
      parentData?.country ? parentData?.country : "-",
      parentData,
    ]);
    // })
    return data;
  };

  const options: MUIDataTableOptions = {
    filter: false,
    searchOpen: false,
    searchAlwaysOpen: false,
    search: false,
    sort: false,
    selectableRows: "none",
    selectableRowsOnClick: false,
    responsive: "vertical",
    // rowsPerPage: 25,
    // rowsPerPageOptions: [25, 50, 100, 150],
    download: false,
    print: false,
    viewColumns: false,
    customFooter: () => {
      return null;
    },
  };

  const tableColumns: MUIDataTableColumn[] = [
    {
      name: "#",
      options: {
        filter: false,
        // setCellProps: () => ({ style: { minWidth: "150px", maxWidth: "150px" } }),
        customBodyRender: (value) => {
          let result = (
            <Avatar alt="Nikunj Solanki" src={value.profile_image_url} />
          );
          return result;
        },
      },
    },
    {
      name: "Index",
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
      name: "child_name",
      options: {
        setCellProps: () => ({ style: { minWidth: "150px" } }),
      },
    },
    {
      label: "Date of birth",
      name: "birth_date",
      options: {
        setCellProps: () => ({ style: { minWidth: "150px" } }),
        customBodyRender: (value) => {
          let formatedDate = value ? moment(value).format("D MMM, YYYY") : "-";
          return formatedDate;
        },
      },
    },
    {
      label: "Stage No",
      name: "stage_no",
      options: {
        setCellProps: () => ({ style: { minWidth: "150px" } }),
        customBodyRender: (value) => {
          let val = `Stage ${value}`;
          return val;
        },
      },
    },
    {
      label: "School year",
      name: "class_no",
      options: {
        customBodyRender: (value) => {
          let val = value.charAt(0).toUpperCase() + value.slice(1);
          return val;
        },
      },
    },
    {
      label: "School Name",
      name: "school_name",
    },
    {
      label: "Gender",
      name: "gender",
      options: {
        customBodyRender: (value) => {
          if (!value) return "-";
          let val =
            value == "female" ? "Female" : value == "N/A" ? "N/A" : "Male";
          return val;
        },
      },
    },
    {
      label: "Lessons/week",
      name: "video_allowed_count",
      options: {
        customBodyRender: (value) => {
          return value;
        },
      },
    },
    // {
    //     label: "Lessons In holidays",
    //     name: "keep_holidays",
    //     options: {
    //         customBodyRender: (value) => {
    //             let val = value ? "Yes" : "No"
    //             return val;
    //         }
    //     }
    // },
    {
      name: "Action",
      options: {
        filter: false,
        // setCellProps: () => ({ style: { minWidth: "150px", maxWidth: "150px" } }),
        customBodyRender: (value: ChildParam) => {
          return (
            <>
              <Button
                type="button"
                className="min_width_auto"
                color="primary"
                variant="contained"
                title="View Detail"
                onClick={() => handleAddChild(value)}
              >
                <Edit fontSize="small" />
              </Button>
            </>
          );
        },
      },
    },
  ];

  const renderChildList = () => {
    let data: any[] = [];
    childList &&
      childList.map((val: ChildParam, index: number) => {
        data.push([
          val,
          index + 1,
          val.child_name ? val.child_name : "-",
          val.birth_date ? val.birth_date : "-",
          val.stage_no ? val.stage_no : "-",
          val.class_no ? val.class_no : "-",
          val.school_name ? val.school_name : "-",
          val.gender,
          val.video_allowed_count ? val.video_allowed_count : "-",
          // val.keep_holidays,
          val,
        ]);
      });
    return data;
  };

  return (
    <ParentSettingsLayout>
      {openAddChildModel && (
        <AddChildModel
          open={openAddChildModel}
          onClose={toggleCloseAddModel}
          editID={editChildID}
          setUpModel={allSetupModel}
          completeSetupModel={toggleCompleteAddChildModel}
        />
      )}

      {openEditParentModel && (
        <EditParentProfileModel
          open={openEditParentModel}
          onClose={toggleEditParentModel}
          editID={editParentID}
        />
      )}

      {openCompleteAddChildModel && (
        <AddChildCompleteModel
          open={openCompleteAddChildModel}
          onClose={toggleCompleteAddChildModel}
        />
      )}
      {maxChildError && (
        <MaxChildErrorModel
          open={maxChildError}
          product={parentData?.product || null}
          onClose={() => {
            setMaxChildError(!maxChildError);
          }}
        />
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container
          className="parent-setting-container"
          sx={{ p: { lg: 2, md: 2, sm: 1, xs: 1 } }}
          maxWidth={false}
        >
          {/* {
                        maxChildError && (
                            <Alert id='error-alert' severity='error' onClose={() => { setMaxChildError(false) }}>
                                You can only add 2 child. For more, you have to upgrade your plan.
                            </Alert>
                        )
                    } */}
          {planPurchaseError && (
            <Alert
              id="error-alert"
              severity="error"
              onClose={() => {
                setPlanPurchaseError(false);
              }}
            >
              First Upgrade your subscription plan.
              <span style={{ color: "#0000EE" }}>
                <Link href={"parentportal/subscription-plan"}>
                  Go to Subscription page
                </Link>
              </span>
              {/* You can only add 2 child. For more, you have to upgrade your plan. */}
            </Alert>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="body1" className="header-h6" sx={{ m: 2 }}>
              Parent Details
            </Typography>
            <div className="student-data-table">
              <MUIDataTable
                data={renderParentData()}
                columns={parentTableColumns}
                options={options}
                title={undefined}
              />
            </div>

            {/* Student details */}

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 4,
                mb: 2,
                pl: 1,
              }}
            >
              <Typography variant="body1" className="header-h6">
                Student Details
              </Typography>
              {/* { */}
              {/*  showAddChildBtn && ( */}
              <Button
                variant="contained"
                onClick={() => toggleOpenAddModel("ADD")}
                startIcon={<PersonAddAlt1Rounded />}
              >
                Add Student
              </Button>
              {/* ) */}
              {/* } */}
            </Box>

            <div className="student-data-table">
              <MUIDataTable
                data={renderChildList()}
                columns={tableColumns}
                options={options}
                title={undefined}
              />
            </div>
          </Box>
        </Container>
      </Box>
    </ParentSettingsLayout>
  );
}
export default Auth(StudentProfile);
