import { Box, Chip, Typography } from "@mui/material";
import { DateRangePicker } from "materialui-daterange-picker";
import moment from "moment";
import MUIDataTable, {
  MUIDataTableColumn,
  MUIDataTableOptions,
} from "mui-datatables";
import * as React from "react";
import { ApolloClientType } from "../../../store/Interface";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import DownArrowIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { getSubscriptionList } from "../../../store/thunk/admin/subscription";
import { PaymentStatistics } from "./payment-statistics";

interface RangeType {
  label: string;
  startDate: any;
  endDate: any;
}

export const PaymentCollection = (props: any) => {
  const dispatch = useAppDispatch();
  const { adminClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const { subscriptionList } = useAppSelector(
    (state) => state.adminSubscriptionSlice
  );

  // const [openAddPlan, setOpenAddPlan] = React.useState<boolean>(false);
  const [dateOpen, setDateOpen] = React.useState<boolean>(false);
  const [subscriptionData, setSubscriptionData] = React.useState<[]>([]);

  const [selectedDate, setSelectedDate] = React.useState<any>({
    from: moment().startOf("month").format("YYYY-MM-DD"),
    to: moment().endOf("month").format("YYYY-MM-DD"),
  });
  const [selectedDatelabel, setSelectedDateLabel] =
    React.useState<string>("This Year");
  const [definedRanges, setDefinedRanges] = React.useState<RangeType[]>([
    {
      label: "Today",
      startDate: moment().startOf("day"),
      endDate: moment().endOf("day"),
    },
    {
      label: "This Week",
      startDate: moment().day(1).startOf("day"),
      endDate: moment().day(7).endOf("day"),
    },
    {
      label: "This Month",
      startDate: moment().startOf("month"),
      endDate: moment().endOf("month"),
    },
    {
      label: "This Year",
      startDate: moment().startOf("year"),
      endDate: moment().endOf("year"),
    },
  ]);

  React.useEffect(() => {
    dispatch(getSubscriptionList(adminClient));
  }, []);

  React.useEffect(() => {
    // Startt
    const subscriptionDataList: any = [];
    subscriptionList?.map((subscription: any) => {
      if (subscription?.subscription_type === "paypal") {
        subscriptionDataList.push({
          customer_name: subscription?.parent_detail
            ? `${subscription?.parent_detail?.first_name} ${subscription?.parent_detail?.last_name}`
            : "-",
          customer_email: subscription?.parent_detail?.email
            ? subscription?.parent_detail?.email
            : "-",
          product: {
            name: subscription?.subscription_name
              ? subscription?.subscription_name
              : "-",
          },
          subtotal: subscription?.subtotal ? subscription?.subtotal * 100 : 0,
          total_discount_amounts:
            subscription?.total_discount_amounts &&
            subscription?.total_discount_amounts !== "-"
              ? [{ amount: subscription?.total_discount_amounts * 100 }]
              : [],
          amount_paid: subscription?.discounted_price
            ? subscription?.discounted_price * 100
            : 0,
          currency: "AUD",
          discount: subscription?.discount
            ? subscription?.discount === "-"
              ? ""
              : subscription?.discount
            : null,
          status: "paid",
          subscription_start_at: subscription?.created_date
            ? moment(subscription?.created_date).unix()
            : "-",
          subscription_end_at: subscription?.plan_end_at
            ? moment(subscription?.plan_end_at).unix()
            : "-",
          status_transitions: subscription?.paid_at
            ? { paid_at: moment(subscription?.paid_at).unix() }
            : {},
          created: subscription?.created_date
            ? moment(subscription?.created_date).unix()
            : "",
        });
      } else {
        subscriptionDataList.push(subscription);
      }

      return subscription;
    });

    // Enddd
    setSubscriptionData(subscriptionDataList);
  }, [subscriptionList]);

  const setDateRange = (range: any) => {
    let startDate = moment(range.startDate).format("YYYY-MM-DD");
    let endDate = moment(range.endDate).format("YYYY-MM-DD");

    let startTimestamp = moment(range.startDate).unix();
    let endTimestamp = moment(range.endDate).unix();

    if (range.label) {
      setSelectedDateLabel(range.label);
    } else {
      endTimestamp = moment(range.endDate).add(24, "hours").unix();
      setSelectedDate({ from: startDate, to: endDate });
      setSelectedDateLabel("");
    }

    let filteredData: any =
      subscriptionList &&
      subscriptionList.filter(
        (value: any) =>
          value.created >= startTimestamp && value.created <= endTimestamp
      );

    setSubscriptionData(filteredData);

    toggleDatePicker();

    // this.setState({ fromdate: startDate, todate: endDate })
  };

  const toggleDatePicker = () => {
    setDateOpen(!dateOpen);
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
      label: "Customer Name",
      name: "customer_name",
      options: {
        filter: false,
        customBodyRender: (value) => {
          return <strong>{value}</strong>;
        },
      },
    },
    {
      label: "Customer Email",
      name: "customer_email",
    },
    {
      label: "Plan",
      name: "product",
      options: {
        filter: false,
        customBodyRender: (value) => {
          let name = value && value.name ? value.name : "-";
          return <strong>{name}</strong>;
        },
      },
    },
    {
      label: "Total Amount",
      name: "subtotal",
      options: {
        filter: false,
        customBodyRender: (value) => {
          let amount = value ? Number(value / 100).toFixed(2) : null;
          if (amount) {
            return <strong>$ {amount}</strong>;
          } else {
            return "-";
          }
        },
      },
    },
    {
      label: "Discount Off",
      name: "total_discount_amounts",
      options: {
        filter: false,
        customBodyRender: (value) => {
          let amount =
            value.length > 0 ? Number(value[0].amount / 100).toFixed(2) : null;
          if (amount) {
            return `$ ${amount}`;
          } else {
            return "-";
          }
        },
      },
    },
    {
      label: "Amount Paid",
      name: "amount_paid",
      options: {
        filter: false,
        customBodyRender: (value) => {
          let amount = value ? Number(value / 100).toFixed(2) : null;
          if (amount) {
            return <strong>$ {amount}</strong>;
          } else {
            return "-";
          }
        },
      },
    },
    {
      label: "Currency",
      name: "currency",
      options: {
        filter: false,
        customBodyRender: (value) => {
          let currency = value ? value.toUpperCase() : "-";
          return currency;
        },
      },
    },
    {
      label: "Discount Code",
      name: "discount",
      options: {
        filter: false,
        customBodyRender: (value) => {
          if (value) {
            let couponCode = value.coupon ? value.coupon.name : "-";
            return (
              <>
                <Chip label={couponCode} size={"small"} color={"info"} />
              </>
            );
          }
          return "-";
        },
      },
    },
    {
      label: "Status",
      name: "status",
      options: {
        filter: false,
        customBodyRender: (value) => {
          if (value) {
            return (
              <>
                <Chip label={value} size={"small"} color={"success"} />
              </>
            );
          } else {
            return "-";
          }
        },
      },
    },
    {
      label: "Subscription Start At",
      name: "period_start",
      options: {
        filter: false,
        setCellProps: () => ({ style: { minWidth: "200px" } }),
        customBodyRender: (value) => {
          let formatedDate = value
            ? moment.unix(value).format("MMM Do YYYY, HH:mm:ss")
            : "-";
          return formatedDate;
        },
      },
    },
    {
      label: "Subscription End At",
      name: "period_end",
      options: {
        filter: false,
        setCellProps: () => ({ style: { minWidth: "200px" } }),
        customBodyRender: (value) => {
          let formatedDate = value
            ? moment.unix(value).format("MMM Do YYYY, HH:mm:ss")
            : "-";
          return formatedDate;
        },
      },
    },
    {
      label: "Paid At",
      name: "period_end",
      options: {
        filter: false,
        setCellProps: () => ({ style: { minWidth: "200px" } }),
        customBodyRender: (value) => {
          let formatedDate =
            value && Object.keys(value).length > 0
              ? moment.unix(value.paid_at).format("MMM Do YYYY, HH:mm:ss")
              : "-";
          return formatedDate;
        },
      },
    },
    {
      label: "Created At",
      name: "created",
      options: {
        filter: false,
        setCellProps: () => ({ style: { minWidth: "200px" } }),
        customBodyRender: (value) => {
          let formatedDate = value
            ? moment.unix(value).format("MMM Do YYYY, HH:mm:ss")
            : "-";
          return formatedDate;
        },
      },
    },
  ];

  const renderParentList = () => {
    let data: any[] = [];
    subscriptionData &&
      subscriptionData.map((val: any, index: number) => {
        data.push([
          index + 1,
          // val.field1,
          val.customer_name ? val.customer_name : "-",
          val.customer_email ? val.customer_email : "-",
          val.product,
          val.subtotal,
          val.total_discount_amounts ? val.total_discount_amounts : "-",
          val.amount_paid,
          val.currency ? val.currency : "-",
          val.discount ? val.discount : null,
          val.status,
          val.subscription_start_at ? val.subscription_start_at : "",
          val.subscription_end_at ? val.subscription_end_at : "",
          val.status_transitions ? val.status_transitions : "",
          val.created ? val.created : "",
        ]);
      });
    return data;
  };

  const options: MUIDataTableOptions = {
    filter: false,
    search: false,
    selectableRows: "none",
    selectableRowsOnClick: true,
    filterType: "dropdown",
    // responsive: "stacked",
    responsive: "vertical",
    rowsPerPage: 25,
    rowsPerPageOptions: [25, 50, 100, 150],
    download: false,
    print: false,
    viewColumns: false,
  };

  return (
    <Box {...props}>
      {/* <PaymentStatistics /> */}
      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            // mt: 4,
            mb: 2,
            mx: 1,
          }}
        >
          <Typography variant="body1" className="header-h6">
            Payments
          </Typography>
          <Box>
            <Box className="daterange-box">
              <div className="date_picker_div" onClick={toggleDatePicker}>
                <span>
                  {selectedDatelabel == ""
                    ? selectedDate.from + " to " + selectedDate.to
                    : selectedDatelabel}
                </span>
                <DownArrowIcon />
              </div>
            </Box>
            <Box className="date_range_picker_dialog">
              <DateRangePicker
                wrapperClassName="Meterialui-daterange-picker-custom-class"
                open={dateOpen}
                toggle={toggleDatePicker}
                definedRanges={definedRanges}
                onChange={(range) => setDateRange(range)}
              />
            </Box>
          </Box>
        </Box>
        <MUIDataTable
          title={""}
          data={renderParentList()}
          columns={tableColumns}
          options={options}
        />
      </Box>
    </Box>
  );
};
