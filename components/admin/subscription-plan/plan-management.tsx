import * as React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import {
  Add,
  Edit,
  CheckCircleOutlineRounded,
  HighlightAltRounded,
  DeleteRounded,
} from "@mui/icons-material";
import { ApolloClientType } from "../../../store/Interface";
import PlanCard from "./plan-card";
import AddPlanModel from "./add-plan-model";
import { getSubscriptionPlanList } from "../../../store/thunk/admin/subscription";
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
} from "mui-datatables";
import * as moment from "moment";
import { GetSubscriptionPlanById } from "../../../store/slices/admin/subscription";

export const PlanManagement = (props: any) => {
  const dispatch = useAppDispatch();
  const { adminClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const { subscriptionPlanList } = useAppSelector(
    (state) => state.adminSubscriptionSlice
  );

  const [openAddPlan, setOpenAddPlan] = React.useState<boolean>(false);
  const [planList, setPlanList] = React.useState<any[]>([]);
  const [planId, setPlanId] = React.useState<string>("");
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);

  React.useEffect(() => {
    dispatch(getSubscriptionPlanList(adminClient));
  }, []);

  React.useEffect(() => {
    setPlanList(subscriptionPlanList);
  }, [subscriptionPlanList]);

  const toggleModel = (value: any) => {
    if (value) {
      setPlanId(value.id);
    } else {
      dispatch(GetSubscriptionPlanById(null));
      setPlanId("");
    }
    setOpenAddPlan(!openAddPlan);
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
      name: "name",
      options: {
        customBodyRender: (value) => {
          return <strong>{value}</strong>;
        },
      },
    },
    {
      label: "Subtitle",
      name: "subtitle",
      options: {
        customBodyRender: (value) => {
          return <strong>{value}</strong>;
        },
      },
    },
    {
      label: "Amount",
      name: "amount",
      options: {
        customBodyRender: (value) => {
          let data = value
            ? `$ ${Number(value.unit_amount / 100).toFixed(2)}`
            : "-";
          return <strong>{data}</strong>;
        },
      },
    },
    {
      label: "Status",
      name: "active",
      options: {
        customBodyRender: (value) => {
          let data = value ? (
            <Box className={"plan-status-box"}>
              <CheckCircleOutlineRounded
                sx={{ mr: 0.8, fontSize: "20px", color: "#4BB543" }}
              />{" "}
              Active
            </Box>
          ) : (
            <Box className={"plan-status-box"}>
              <HighlightAltRounded
                sx={{ mr: 0.8, fontSize: "20px", color: "#FF9494" }}
              />
              Expired
            </Box>
          );
          return data;
        },
      },
    },
    {
      label: "Currency",
      name: "currency",
      options: {
        customBodyRender: (value) => {
          let data = value ? value.toUpperCase() : "-";
          return data;
        },
      },
    },
    {
      label: "Created Date",
      name: "created",
      options: {
        filter: false,
        setCellProps: () => ({ style: { minWidth: "200px" } }),
        customBodyRender: (value: any) => {
          let date = value
            ? moment.unix(value).format("MMM Do YYYY, HH:mm:ss")
            : "-";
          return date;
        },
      },
    },
    {
      label: "Updated Date",
      name: "updated",
      options: {
        filter: false,
        setCellProps: () => ({ style: { minWidth: "200px" } }),
        customBodyRender: (value: any) => {
          let date = value
            ? moment.unix(value).format("MMM Do YYYY, HH:mm:ss")
            : "-";
          return date;
        },
      },
    },
    {
      name: "Action",
      options: {
        filter: false,
        // setCellProps: () => ({ style: { minWidth: "150px", maxWidth: "150px" } }),
        customBodyRender: (value) => {
          return (
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Button
                type="button"
                className="min_width_auto"
                sx={{ backgroundColor: "#3f51b5", mr: 1 }}
                variant="contained"
                onClick={() => toggleModel(value)}
              >
                <Edit fontSize="small" />
              </Button>
              {/* {" "}
                            <Button 
                                className="min_width_auto" 
                                type="button" 
                                color="error" 
                                variant="contained" 
                                title="View Detail" 
                                // onClick={() => viewParentDetails(value)}
                                >
                                <DeleteRounded fontSize='small' />
                            </Button> */}
            </Box>
          );
        },
      },
    },
  ];

  const renderPlanList = () => {
    let data: any[] = [];
    planList.map((val: any, index: number) => {
      data.push([
        index + 1,
        val.name ? val.name : "-",
        val.metadata.subtitle ? val.metadata.subtitle : "-",
        val.product_price,
        val.active ? val.active : "-",
        val.product_price?.currency,
        val.created,
        val.updated,
        val,
      ]);
    });
    return data;
  };

  return (
    <Box {...props}>
      {openAddPlan && (
        <AddPlanModel
          open={openAddPlan}
          toggleModel={toggleModel}
          planId={planId}
        />
      )}
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
            Subscription - <b>Plan</b>
          </Typography>

          {/* <Button
                        color="primary"
                        variant="contained"
                        sx={{ m: 1 }}
                        startIcon={<Add />}
                        onClick={toggleModel}
                    >
                        Add Plan
                    </Button> */}
        </Box>

        <Box sx={{ my: 2 }}>
          <MUIDataTable
            title={""}
            data={renderPlanList()}
            columns={tableColumns}
            options={options}
          />
        </Box>

        {/* <Grid container spacing={2} sx={{ my: 4, mx: 0 }} direction={"row"} alignItems={"stretch"}>
                    {
                        planList.map((value, i) => (
                            <Grid item md={3} sm={3} xs={12} key={i}>
                                <PlanCard plandetails={value}/>
                            </Grid>
                        ))
                    }
                </Grid> */}
      </Box>
    </Box>
  );
};
