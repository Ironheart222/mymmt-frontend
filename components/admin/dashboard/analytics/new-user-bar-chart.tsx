import * as React from "react";
import dynamic from "next/dynamic";
import * as react from "react";
import { ApolloClientType } from "../../../../store/Interface";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import moment from "moment";
import {
  Backdrop,
  Box,
  Card,
  CardContent,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { SetMemberLoading } from "../../../../store/slices/admin/anlyaticsSlice";
import { getMemberData } from "../../../../store/thunk/admin/analyticsThunk";
import DownArrowIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { DateRangePicker } from "materialui-daterange-picker";
// import Chart from "react-apexcharts";

const Chart: any = dynamic(() => import("react-apexcharts"), { ssr: false });

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

export const NewUserBarChart = (props: any) => {
  const dispatch = useAppDispatch();
  const { adminClient }: Partial<ApolloClientType> = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const { memberData, memberLoading } = useAppSelector(
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

  const [series, setSeries] = react.useState<any>([
    {
      name: "New Added Member",
      data: [],
    },
  ]);

  const [options, setOptions] = react.useState<any>({
    chart: {
      type: "bar",
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
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      // type: 'datetime',
      crosshair: true,
      tickPlacement: "on",
    },
    yaxis: {
      title: { text: "New Member" },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val + " Members";
        },
      },
    },
  });

  React.useEffect(() => {
    if (filterBy == "weekly" || filterBy == "monthly" || filterBy == "yearly") {
      let _request = {
        filter_by: filterBy,
        start_date: null,
        end_date: null,
      };
      dispatch(SetMemberLoading(true));
      dispatch(getMemberData({ _request, adminClient }));
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
      dispatch(SetMemberLoading(true));
      dispatch(getMemberData({ _request, adminClient }));
      setFilterBy("");
    }
  }, [selectedTimestamp]);

  React.useEffect(() => {
    setIsLoading(memberLoading);
  }, [memberLoading]);

  React.useEffect(() => {
    if (memberData.length > 0) {
      let label = memberData.map((val: any) => val.label);
      label.reverse();
      setOptions({
        ...options,
        xaxis: {
          categories: label,
        },
      });
      let total_members = memberData.map((val: any) => val.total_members);
      total_members.reverse();
      setSeries([
        {
          name: "Newly Added Members",
          data: total_members,
        },
      ]);
    }
  }, [memberData]);

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
            type="bar"
            width="100%"
            height="350px"
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
    // <div id="chart">
    // <Chart
    //     options={options}
    //     series={series}
    //     type="bar"
    //     width="100%"
    //     height="350px"
    // />
    // </div>
  );
};
