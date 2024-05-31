import { Backdrop, Box, Typography } from "@mui/material";
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
import { getMemberReportData } from "../../../store/thunk/admin/analyticsThunk";
import ExportReactCSV from "../../export-react-csv";
import { setLoading } from "../../../store/slices/loadingSlice";

interface RangeType {
  label: string;
  startDate: any;
  endDate: any;
}

const headers = [
  "Index",
  "Name",
  "Email",
  "Contact Number",
  "No of Child",
  "Street name and number",
  "Apartment No",
  "Suburb",
  "State",
  "Country",
  "Created Date",
  "Updated Date",
];

export const MemberTable = (props: any) => {
  const dispatch = useAppDispatch();
  const { adminClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const { memberReportData } = useAppSelector((state) => state.analyticsSlice);
  let loadingInfo = useAppSelector((state) => state.loadingReducer);

  // const [openAddPlan, setOpenAddPlan] = React.useState<boolean>(false);
  const [dateOpen, setDateOpen] = React.useState<boolean>(false);
  const [reportData, setReportData] = React.useState<[]>([]);

  const [selectedDate, setSelectedDate] = React.useState<any>({
    from: moment().startOf("year").format("YYYY-MM-DD"),
    to: moment().endOf("year").format("YYYY-MM-DD"),
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
      dispatch(getMemberReportData({ _request, adminClient }));
    }
  }, []);

  React.useEffect(() => {
    setReportData(memberReportData);
  }, [memberReportData]);

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
      dispatch(getMemberReportData({ _request, adminClient }));
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
      label: "Name",
      name: "full_name",
      options: {
        setCellProps: () => ({ style: { minWidth: "150px" } }),
        customBodyRender: (value) => {
          return (
            <strong>
              {value.first_name} {value.last_name}
            </strong>
          );
        },
      },
    },
    {
      label: "Email",
      name: "email",
      options: {
        customBodyRender: (value) => {
          return <strong>{value}</strong>;
        },
      },
    },
    {
      label: "Contact Number",
      name: "mobile_no",
    },
    {
      label: "No of Child",
      name: "child_count",
      options: {
        customBodyRender: (value) => {
          return <strong>{value}</strong>;
        },
      },
    },
    {
      label: "Street name and number  ",
      name: "street_1",
      options: {
        filter: false,
        setCellProps: () => ({ style: { minWidth: "150px" } }),
        customBodyRender: (value) => {
          if (value.street_1 || value.street_2) {
            return `${value.street_1} ${value.street_2}`;
          } else {
            return "-";
          }
        },
      },
    },
    {
      label: "Apartment No",
      name: "apartment_no",
    },
    {
      label: "Suburb",
      name: "suburb",
    },
    {
      label: "State",
      name: "state",
      options: {
        setCellProps: () => ({ style: { minWidth: "150px" } }),
        customBodyRender: (value) => {
          return <strong>{value}</strong>;
        },
      },
    },
    {
      label: "Country",
      name: "country",
      options: {
        customBodyRender: (value) => {
          return <strong>{value}</strong>;
        },
      },
    },
    {
      label: "Created Date",
      name: "created_Date",
      options: {
        filter: false,
        setCellProps: () => ({ style: { minWidth: "200px" } }),
        customBodyRender: (value: any) => {
          let date = value
            ? moment(value).format("MMM Do YYYY, HH:mm:ss")
            : "-";
          return date;
        },
      },
    },
    {
      label: "Updated Date",
      name: "updated_Date",
      options: {
        filter: false,
        setCellProps: () => ({ style: { minWidth: "200px" } }),
        customBodyRender: (value: any) => {
          let date = value
            ? moment(value).format("MMM Do YYYY, HH:mm:ss")
            : "-";
          return date;
        },
      },
    },
  ];

  const renderReportData = () => {
    let data: any[] = [];
    let itemNumber = 1;
    reportData &&
      reportData.map((val: any, index: number) => {
        //Only show varified data in list
        if (val?.is_varified) {
          data.push([
            itemNumber,
            val,
            val.email ? val.email : "-",
            val.mobile_no ? val.mobile_no : "-",
            val.child_detail ? val.child_detail.length : "0",
            val,
            val.apartment_no ? val.apartment_no : "-",
            val.suburb ? val.suburb : "-",
            val.state ? val.state : "-",
            val.country ? val.country : "-",
            val.created_date ? val.created_date : "-",
            val.updated_date ? val.updated_date : "-",
            val,
            val,
            val,
            val,
          ]);
          itemNumber++;
        }
      });

    return data;
  };

  const getArrayToExport = () => {
    let temp: any[] = [];
    reportData &&
      reportData.map((val: any, index: number) => {
        temp.push([
          index + 1,
          val.first_name || val.last_name
            ? `${val.first_name} ${val.last_name}`
            : "",
          val.email ? val.email : "-",
          val.mobile_no ? val.mobile_no.toString() : "-",
          val.child_detail ? val.child_detail.length : "0",
          val.street_1 || val.street_2 ? `${val.street_1} ${val.street_2}` : "",
          val.apartment_no ? val.apartment_no : "-",
          val.suburb ? val.suburb : "-",
          val.state ? val.state : "-",
          val.country ? val.country : "-",
          val.created_date ? val.created_date : "-",
          val.updated_date ? val.updated_date : "-",
        ]);
      });

    return temp;
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
            Member Report
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
                fileName="Members_Report.csv"
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
        {loadingInfo.isLoading && (
          <Box>
            <Backdrop
              sx={{
                color: "#fff",
                backgroundColor: "rgba(255,255,255,0.4)",
                zIndex: 50,
                width: "100%",
                height: "100%",
              }}
              open={loadingInfo.isLoading}
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
