import dynamic from "next/dynamic";
import {
  Backdrop,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import * as React from "react";
// import Chart from "react-apexcharts";
import { styled } from "@mui/material/styles";
import moment from "moment";
import { LocalizationProvider, DesktopDateRangePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { DateRangePicker } from "materialui-daterange-picker";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { ApolloClientType } from "../../../../store/Interface";
import { SetRevenueLoading } from "../../../../store/slices/admin/anlyaticsSlice";
import DownArrowIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { getRevenueData } from "../../../../store/thunk/admin/analyticsThunk";

const Chart: any = dynamic(() => import("react-apexcharts"), { ssr: false });

interface RangeType {
  label: string;
  startDate: any;
  endDate: any;
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: "white",
  // border: "1px solid #d3d3d3",
  "& .MuiToggleButtonGroup-grouped": {
    margin: theme.spacing(0.5),
    border: 0,
    "&.Mui-disabled": {
      border: 0,
    },
    "&.Mui-selected": {
      backgroundColor: "#99fc31",
    },
    "&:not(:first-of-type)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-of-type": {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

export const RevenueChart = (props: any) => {
  const dispatch = useAppDispatch();
  const { adminClient }: Partial<ApolloClientType> = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const { revenueData, revenueLoading } = useAppSelector(
    (state) => state.analyticsSlice
  );

  const [filterBy, setFilterBy] = React.useState("monthly");
  const [dateValue, setDateValue] = React.useState<any>([null, null]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [dateOpen, setDateOpen] = React.useState<boolean>(false);
  const [selectedDate, setSelectedDate] = React.useState<any>({
    from: moment().startOf("month").format("YYYY-MM-DD"),
    to: moment().endOf("month").format("YYYY-MM-DD"),
  });
  const [selectedTimestamp, setSelectedTimestamp] = React.useState<any>({
    from: 0,
    to: 0,
  });
  const [selectedDatelabel, setSelectedDateLabel] =
    React.useState<string>("Filter By");
  const [series, setSeries] = React.useState<any>([
    {
      name: "Revenue (Profit AUD)",
      data: [],
    },
  ]);

  const [options, setOptions] = React.useState<any>({
    chart: {
      type: "line",
      width: "100%",
      height: "100px",
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: false,
          zoomin: true,
          zoomout: true,
          pan: false,
          reset: false,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    yaxis: {
      title: { text: "Revenue (Profit AUD)" },
    },
    // title: {
    //     text: 'Revenue (Profit AUD)',
    //     align: 'left'
    // },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    xaxis: {
      // type: 'datetime',
      crosshair: true,
      tickPlacement: "on",
    },
  });

  React.useEffect(() => {
    if (filterBy == "weekly" || filterBy == "monthly" || filterBy == "yearly") {
      let _request = {
        filter_by: filterBy,
        start_date: null,
        end_date: null,
      };
      dispatch(SetRevenueLoading(true));
      dispatch(getRevenueData({ _request, adminClient }));
      setSelectedTimestamp({
        from: 0,
        to: 0,
      });
      setSelectedDateLabel("Filter By");
    }
  }, [filterBy]);

  React.useEffect(() => {
    if (selectedTimestamp.from != 0 || selectedTimestamp.to != 0) {
      let _request = {
        filter_by: "custom",
        start_date: selectedTimestamp.from,
        end_date: selectedTimestamp.to,
      };
      dispatch(SetRevenueLoading(true));
      dispatch(getRevenueData({ _request, adminClient }));
      setFilterBy("");
    }
  }, [selectedTimestamp]);

  React.useEffect(() => {
    setIsLoading(revenueLoading);
  }, [revenueLoading]);

  React.useEffect(() => {
    if (revenueData.length > 0) {
      let label = revenueData.map((val: any) => val.label);
      label.reverse();
      setOptions({
        ...options,
        xaxis: {
          categories: label,
        },
      });
      let total_revenue = revenueData.map((val: any) => val.total_revenue);
      total_revenue.reverse();
      setSeries([
        {
          name: "Revenue (Profit AUD)",
          data: total_revenue,
        },
      ]);
    }
  }, [revenueData]);

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    if (!!newAlignment) {
      setFilterBy(newAlignment);
    }
  };

  const toggleDatePicker = () => {
    setDateOpen(!dateOpen);
  };

  const setDateRange = (range: any) => {
    let startDate = moment(range.startDate).format("YYYY-MM-DD");
    let endDate = moment(range.endDate).format("YYYY-MM-DD");

    let startTimestamp = moment(range.startDate).unix();
    let endTimestamp = moment(range.endDate).unix();

    setSelectedDate({ from: startDate, to: endDate });
    setSelectedTimestamp({ from: startTimestamp, to: endTimestamp });
    setSelectedDateLabel("");

    toggleDatePicker();
  };

  return (
    <Card
      elevation={8}
      sx={{ width: "100%", position: "relative", zIndex: 49 }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <StyledToggleButtonGroup
          size="small"
          value={filterBy}
          exclusive
          onChange={handleAlignment}
          aria-label=""
          style={{ margin: "4px" }}
        >
          <ToggleButton value="weekly" aria-label="weekly">
            Weekly
          </ToggleButton>
          <ToggleButton value="monthly" aria-label="monthly">
            Monthly
          </ToggleButton>
          <ToggleButton value="yearly" aria-label="yearly">
            Yearly
          </ToggleButton>
        </StyledToggleButtonGroup>
        <Box
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          {/* <Typography variant='subtitle2'>
                        Filter by
                    </Typography> */}
          <Box sx={{ ml: 1, mr: 2 }}>
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
                maxDate={new Date()}
                toggle={toggleDatePicker}
                definedRanges={[]}
                onChange={(range) => setDateRange(range)}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider />
      <CardContent>
        <div id="chart">
          <Chart
            options={options}
            series={series}
            type="line"
            width="100%"
            height="300px"
          />
        </div>
      </CardContent>

      {isLoading && (
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
            open={isLoading}
          >
            <div className="balls">
              <div className="ball one"></div>
              <div className="ball two"></div>
              <div className="ball three"></div>
            </div>
          </Backdrop>
        </Box>
      )}
    </Card>
  );
};
