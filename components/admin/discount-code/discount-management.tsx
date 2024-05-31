import * as React from "react";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
} from "mui-datatables";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { Add, Delete, Visibility } from "@mui/icons-material";
import AddDiscountModel, { AmountType } from "./add-discount-code";
import {
  deleteDiscountCode,
  getDiscountCodes,
} from "../../../store/thunk/admin/discountThunk";
import {
  ApolloClientType,
  CouponCode,
  DialogDetails,
} from "../../../store/Interface";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ConfirmationModel from "../model/confirmation-model";
import * as moment from "moment";
import { getSubscriptionPlanList } from "../../../store/thunk/admin/subscription";

enum FlagType {
  ACTIVE = "active",
  DELETE = "delete",
}

const dataArray = [
  {
    name: "black friday",
    code: "BLACKFRIDAY",
    amount: 12,
    status: "ACTIVE",
    created_date: "2022-04-27T01:31:02.825Z",
    updated_date: "2022-04-27T01:31:02.825Z",
  },
  {
    name: "black friday",
    code: "BLACKFRIDAY",
    amount: 18,
    status: "EXPIRED",
    created_date: "2022-04-27T01:31:02.825Z",
    updated_date: "2022-04-27T01:31:02.825Z",
  },
  {
    name: "black friday",
    code: "BLACKFRIDAY",
    amount: 20,
    status: "PENDING",
    created_date: "2022-04-27T01:31:02.825Z",
    updated_date: "2022-04-27T01:31:02.825Z",
  },
];

const color = {
  // ACTIVE: "#17c671",
  ACTIVE: "#17c671",
  EXPIRED: "#c4183c",
  PENDING: "#ffb400",
};

export const DiscountManagement = (props: any) => {
  const dispatch = useAppDispatch();
  const { adminClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const { discountCodeList } = useAppSelector((state) => state.discountReducer);

  const [discountCodes, setDiscountCodes] = React.useState<CouponCode[] | []>(
    []
  );
  const [openDiscountModel, setOpenDiscountModel] =
    React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [dialogDetails, setDialogDetails] = React.useState<DialogDetails>({
    title: "",
    body_content: "",
    id: "",
  });
  const [openConfirmationModel, setOpenConfirmationModel] =
    React.useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);

  React.useEffect(() => {
    dispatch(getDiscountCodes(adminClient));
    dispatch(getSubscriptionPlanList(adminClient));
  }, []);

  React.useEffect(() => {
    if (discountCodeList) {
      setDiscountCodes(discountCodeList);
    }
  }, [discountCodeList]);

  const toggleConfirmationModel = (value: CouponCode) => {
    if (value && value.id) {
      let dialogDetails: DialogDetails = {
        title: "Delete Confirmation",
        body_content: "Are you sure you want to delete this discount code?",
        id: String(value.id),
      };
      setDialogDetails(dialogDetails);
      setOpenConfirmationModel(!openConfirmationModel);
    }
  };

  const handleDeleteCode = (discount_id: string) => {
    if (discount_id) {
      setLoading(true);
      dispatch(
        deleteDiscountCode({
          _request: discount_id,
          adminClient,
          result: (res: any) => {
            onClose();
            setLoading(false);
          },
        })
      );
    }
  };

  const onClose = () => {
    setDialogDetails({
      title: "",
      body_content: "",
      id: "",
    });
    setOpenConfirmationModel(!openConfirmationModel);
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
      label: "Code",
      name: "discount_code",
      options: {
        customBodyRender: (value) => {
          return (
            <>
              <Chip
                id="discount-code-chip"
                label={value}
                size={"small"}
                color={"success"}
              />
            </>
          );
        },
      },
    },
    // {
    //     label: "Currency",
    //     name: "currency",
    // },
    {
      label: "Amount",
      name: "amount_off",
      options: {
        customBodyRender: (value) => {
          let data = value ? `$ ${Number(value).toFixed(2)}` : "-";
          return <strong>{data}</strong>;
        },
      },
    },
    {
      label: "Percent",
      name: "percent_off",
      options: {
        customBodyRender: (value) => {
          // let data: string = "-";
          // if (value && value.amount && value.amount_type) {
          //     data = value.amount_type == AmountType.PERCENTAGE ? `${value.amount} %` : `${value.amount} $`
          // }
          let data = value ? `${value} %` : "-";
          return <strong>{data}</strong>;
        },
      },
    },
    {
      label: "Amount Type",
      name: "amount_type",
      options: {
        customBodyRender: (value) => {
          return value.amount_off ? "AMOUNT" : "PERCENTAGE";
        },
      },
    },
    {
      label: "Products",
      name: "metadata",
      options: {
        customBodyRender: (value) => {
          if (Object.keys(value).length > 0) {
            return <strong>{value.plan_name ? value.plan_name : "-"}</strong>;
          } else {
            return "-";
          }
        },
      },
    },
    {
      label: "Total redeem",
      name: "times_redeemed",
      options: {
        customBodyRender: (value) => {
          return <strong>{value}</strong>;
        },
      },
    },
    // {
    //     label: "Redemption Limit",
    //     name: "max_redemptions"
    // },
    {
      label: "Duration",
      name: "durations",
      options: {
        customBodyRender: (value) => {
          if (Object.keys(value).length > 0 && value.duration == "repeating") {
            return `Off for ${value.duration_in_months} month`;
          } else {
            return value.duration ? value.duration : "-";
          }
        },
      },
    },
    {
      label: "Status",
      name: "valid",
      options: {
        customBodyRender: (value: any) => {
          let status: any = "-";
          if (typeof value == "boolean") {
            status = (
              <Stack direction={"row"} alignItems={"center"}>
                <div
                  id="circle"
                  style={{
                    backgroundColor: value ? color.ACTIVE : color.EXPIRED,
                    boxShadow: value
                      ? `0 0 6px ${color.ACTIVE}, inset 0 0 6px ${color.ACTIVE}`
                      : `0 0 6px ${color.EXPIRED}, inset 0 0 6px ${color.EXPIRED}`,
                  }}
                />
                {value ? "ACTIVE" : "EXPIRED"}
              </Stack>
            );
          }
          return status;
        },
      },
    },
    {
      label: "Expire At",
      name: "redeem_by",
      options: {
        filter: false,
        setCellProps: () => ({ style: { minWidth: "150px" } }),
        customBodyRender: (value) => {
          let formatedDate = value
            ? moment.unix(value).format("DD-MM-YYYY")
            : "-";
          return formatedDate;
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
          let date = moment.unix(value).format("MMM Do YYYY, HH:mm:ss");
          return date;
        },
      },
    },
    // {
    //     label: "Updated Date",
    //     name: "updated_date"
    // },
    // {
    //     name: "Active",
    //     options: {
    //         filter: false,
    //         // setCellProps: () => ({ style: { minWidth: "150px", maxWidth: "150px" } }),
    //         customBodyRender: (value) => {
    //             return (
    //                 <>
    //                     <FormControlLabel
    //                         control={
    //                             <Switch
    //                                 checked={value.is_active ? value.is_active : false}
    //                                 // onChange={(e) => handleChange(e, value, FlagType.ACTIVE)}
    //                                 name="disabled"
    //                                 color="primary"
    //                             />
    //                         }
    //                         label=""
    //                     />
    //                 </>
    //             )
    //         }
    //     }
    // },
    // {
    //     name: "Delete",
    //     options: {
    //         filter: false,
    //         // setCellProps: () => ({ style: { minWidth: "150px", maxWidth: "150px" } }),
    //         customBodyRender: (value) => {
    //             return (
    //                 <>
    //                     <FormControlLabel
    //                         control={
    //                             <Switch
    //                                 checked={value.is_delete ? value.is_delete : false}
    //                                 // onChange={(e) => handleChange(e, value, FlagType.DELETE)}
    //                                 name="disabled"
    //                                 color="primary"
    //                             />
    //                         }
    //                         label=""
    //                     />
    //                 </>
    //             )
    //         }
    //     }
    // },
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
                color="error"
                variant="contained"
                title="View Detail"
                onClick={() => toggleConfirmationModel(value)}
              >
                <DeleteRoundedIcon fontSize="small" />
              </Button>
            </>
          );
        },
      },
    },
  ];

  const renderParentList = () => {
    let data: any[] = [];
    discountCodes &&
      discountCodes.map((val: CouponCode, index: number) => {
        data.push([
          index + 1,
          val.name ? val.name : "-",
          // val.currency ? val.currency : "-",
          val.amount_off,
          val.percent_off,
          val,
          val.metadata,
          val.times_redeemed,
          // val.max_redemptions ? val.max_redemptions : "-",
          val,
          val.valid,
          val.redeem_by,
          val.created ? val.created : "-",
          val,
          // val.updated_date ? val.updated_date : "-",
          // val,
          // val,
          // val
        ]);
      });
    return data;
  };

  const toggleModel = () => {
    setOpenDiscountModel(!openDiscountModel);
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
      {openDiscountModel && (
        <AddDiscountModel open={openDiscountModel} toggleModel={toggleModel} />
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
            Discount - <b>Code</b>
          </Typography>

          <Button
            color="primary"
            variant="contained"
            sx={{ m: 1 }}
            startIcon={<Add />}
            onClick={toggleModel}
          >
            Add Code
          </Button>
        </Box>
        <Box sx={{ my: 2 }}>
          <MUIDataTable
            title={"Discount codes"}
            data={renderParentList()}
            columns={tableColumns}
            options={options}
          />
        </Box>
        {openConfirmationModel && (
          <ConfirmationModel
            dialogDetails={dialogDetails}
            modelOpen={openConfirmationModel}
            onClose={onClose}
            onDelete={handleDeleteCode}
            loading={loading}
          />
        )}
      </Box>
    </Box>
  );
};
