import { Backdrop, Box, Chip, Typography } from "@mui/material";
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
import { getRevenueReportData } from "../../../store/thunk/admin/analyticsThunk";
import ExportReactCSV from "../../export-react-csv";
import { SetRevenueLoading } from "../../../store/slices/admin/anlyaticsSlice";
import { setLoading } from "../../../store/slices/loadingSlice";

interface RangeType {
  label: string;
  startDate: any;
  endDate: any;
}

const headers = [
  "Index",
  "Amount",
  "Currency",
  "Status",
  "Type",
  "Arrival Date",
  "Created At",
];

export const RevenueTable = (props: any) => {
  const dispatch = useAppDispatch();
  const { adminClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const { revenueReportData, revenueLoading } = useAppSelector(
    (state) => state.analyticsSlice
  );

  const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);

  // const [openAddPlan, setOpenAddPlan] = React.useState<boolean>(false);
  const [dateOpen, setDateOpen] = React.useState<boolean>(false);
  const [reportData, setReportData] = React.useState<[]>([]);

  const [selectedDate, setSelectedDate] = React.useState<any>({
    from: moment().startOf("year"),
    to: moment().endOf("year"),
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
    if (!!selectedDate.from || !!selectedDate.to) {
      let _request = {
        start_date: moment(selectedDate.from).unix(),
        end_date: moment(selectedDate.to).unix(),
      };
      dispatch(setLoading(true));
      dispatch(getRevenueReportData({ _request, adminClient }));
    }
  }, []);

  React.useEffect(() => {
    const revenueDataList: any = [];
    revenueReportData?.map((revenue: any) => {
      if (revenue?.transaction_info) {
        revenueDataList.push({
          amount: revenue?.transaction_info?.transaction_amount?.value * 100,
          currency:
            revenue?.transaction_info?.transaction_amount?.currency_code,
          status: "paid",
          type: "bank_account",
          arrival_date: moment(
            revenue?.transaction_info.transaction_info
              ?.transaction_initiation_date
          ).unix(),
          created: moment(
            revenue?.transaction_info.transaction_info?.transaction_updated_date
          ).unix(),
        });
      } else {
        revenueDataList.push(revenue);
      }

      return revenue;
    });

    setReportData(revenueDataList);
  }, [revenueReportData]);

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

    if (!!startTimestamp || !!endTimestamp) {
      let _request = {
        start_date: startTimestamp,
        end_date: endTimestamp,
      };
      dispatch(setLoading(true));
      dispatch(getRevenueReportData({ _request, adminClient }));
    }

    toggleDatePicker();
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
      label: "Amount",
      name: "amount",
      options: {
        filter: false,
        customBodyRender: (value) => {
          let val = value ? Number(value) / 100 : 0;
          return <strong>$ {val.toFixed(2)}</strong>;
        },
      },
    },
    {
      label: "Currency",
      name: "currency",
      options: {
        customBodyRender: (value) => {
          return value.toUpperCase();
        },
      },
    },
    {
      label: "Status",
      name: "status",
      options: {
        customBodyRender: (value) => {
          return <strong>{value.toUpperCase()}</strong>;
        },
      },
    },
    {
      label: "Type",
      name: "type",
    },
    {
      label: "Arrival Date",
      name: "arrival_date",
      options: {
        filter: false,
        customBodyRender: (value) => {
          let formatedDate = value
            ? moment.unix(value).format("MMM Do YYYY, HH:mm:ss")
            : "-";
          return <strong>{formatedDate}</strong>;
        },
      },
    },
    {
      label: "Created At",
      name: "created",
      options: {
        filter: false,
        customBodyRender: (value) => {
          let formatedDate = value
            ? moment.unix(value).format("MMM Do YYYY, HH:mm:ss")
            : "-";
          return formatedDate;
        },
      },
    },
  ];

  const getArrayToExport = () => {
    let temp: any[] = [];
    reportData &&
      reportData.map((val: any, index: number) => {
        temp.push([
          index + 1,
          // val.amount ? val.amount : "",
          val.amount ? (Number(val.amount) / 100).toFixed(2) : 0,
          val.currency ? val.currency : "",
          val.status ? val.status : "",
          val.type ? val.type : "",
          val.arrival_date
            ? moment.unix(val.arrival_date).format("MMM Do YYYY, HH:mm:ss")
            : "",
          val.created
            ? moment.unix(val.created).format("MMM Do YYYY, HH:mm:ss")
            : "",
        ]);
      });

    return temp;
  };

  const renderReportData = () => {
    let data: any[] = [];

    reportData &&
      reportData.map((val: any, index: number) => {
        data.push([
          index + 1,
          val.amount ? val.amount : "-",
          val.currency ? val.currency : "-",
          val.status ? val.status : "-",
          val.type ? val.type : "-",
          val.arrival_date ? val.arrival_date : "",
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
            Revenue Report
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box sx={{ marginRight: "12px" }}>
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
            <Box>
              <ExportReactCSV
                csvHeaders={headers}
                csvData={getArrayToExport()}
                fileName="Revenue_reports.csv"
              />
            </Box>
          </Box>
        </Box>
        <MUIDataTable
          title={""}
          data={renderReportData()}
          columns={tableColumns}
          options={options}
        />
        {revenueLoading && (
          <Box>
            <Backdrop
              sx={{
                color: "#fff",
                backgroundColor: "rgba(255,255,255,0.4)",
                zIndex: 50,
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
              open={revenueLoading}
            >
              <div className="balls">
                <div className="ball one"></div>
                <div className="ball two"></div>
                <div className="ball three"></div>
              </div>
            </Backdrop>
          </Box>
        )}
      </Box>
    </Box>
  );
};
