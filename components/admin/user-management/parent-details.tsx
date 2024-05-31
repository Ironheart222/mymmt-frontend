import Head from "next/head";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { DashboardLayout } from "../dashboard/dashboard-layout";
import { ParentParam } from "../../../store/Interface";
import moment from "moment";

enum UserType {
  PARENT = "parent",
  CHILD = "child",
}
const ParentDetails = (props: any) => {
  let { parentDetail } = props;

  const AccountParentProfile = (data: ParentParam, type: UserType) => {
    return (
      <Card>
        <CardHeader
          subheader="Parent Information"
          title={data.first_name + " " + data.last_name}
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={{ xs: 2, md: 2 }}
            columns={{ xs: 2, sm: 4, md: 12 }}
          >
            <Grid item xs={3}>
              <Typography component="p" variant="subtitle2">
                Email
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography component="h1" variant="subtitle2">
                <strong>{data.email ? data.email : "-"}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={3}>
              <Typography component="p" variant="subtitle2">
                Mobile No
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography component="h1" variant="subtitle2">
                <strong>{data.mobile_no ? data.mobile_no : "-"}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={3}>
              <Typography component="p" variant="subtitle2">
                Street name and number
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography component="h1" variant="subtitle2">
                <strong>
                  {data
                    ? data.street_1 && data.street_2
                      ? data.street_1 + " " + data.street_2
                      : data.street_1
                      ? data.street_1
                      : data.street_2
                      ? data.street_2
                      : "-"
                    : "-"}
                </strong>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={3}>
              <Typography component="p" variant="subtitle2">
                Apartment,Suite,Unit, etc
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography component="h1" variant="subtitle2">
                <strong>{data.apartment_no ? data.apartment_no : "-"}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={3}>
              <Typography component="p" variant="subtitle2">
                Suburb
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography component="h1" variant="subtitle2">
                <strong>{data.suburb ? data.suburb : "-"}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={3}>
              <Typography component="p" variant="subtitle2">
                State
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography component="h1" variant="subtitle2">
                <strong>{data.state ? data.state : "-"}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={3}>
              <Typography component="p" variant="subtitle2">
                Country
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography component="h1" variant="subtitle2">
                <strong>{data.country ? data.country : "-"}</strong>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const AccountChildProfile = (data: any, type: UserType) => {
    return (
      <Card>
        <CardHeader
          subheader={"Child Information"}
          title={data.child_name}
          avatar={
            type == UserType.CHILD ? (
              <Avatar
                src={data.profile_image_url}
                sx={{
                  height: 60,
                  width: 60,
                }}
              />
            ) : null
          }
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={{ xs: 2, md: 2 }}
            columns={{ xs: 2, sm: 4, md: 12 }}
          >
            <Grid item xs={3}>
              <Typography component="p" variant="subtitle2">
                Name
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography component="h1" variant="subtitle2">
                <strong>{data.child_name ? data.child_name : "-"}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={3}>
              <Typography component="p" variant="subtitle2">
                Age
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography component="h1" variant="subtitle2">
                <strong>{data.child_age ? data.child_age : 0} Year</strong>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={3}>
              <Typography component="p" variant="subtitle2">
                Date of birth
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography component="h1" variant="subtitle2">
                <strong>
                  {data.birth_date ? moment(data.birth_date).format("LL") : "-"}
                </strong>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={3}>
              <Typography component="p" variant="subtitle2">
                School name
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography component="h1" variant="subtitle2">
                <strong>{data.school_name ? data.school_name : "-"}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={3}>
              <Typography component="p" variant="subtitle2">
                School year
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography component="h1" variant="subtitle2">
                <strong>
                  {data.class_no
                    ? data.class_no.charAt(0).toUpperCase() +
                      data.class_no.slice(1)
                    : "-"}
                </strong>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={3}>
              <Typography component="p" variant="subtitle2">
                Gender
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography component="h1" variant="subtitle2">
                <strong>{data.gender ? data.gender : "-"}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={3}>
              <Typography component="p" variant="subtitle2">
                Lessons/week
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography component="h1" variant="subtitle2">
                <strong>
                  {data.video_allowed_count ? data.video_allowed_count : "0"}{" "}
                  Video allowed per week
                </strong>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Head>
        <title>Parent Details | Admin</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          m: 2,
        }}
      >
        <Typography sx={{ mb: 3 }} variant="h5">
          <b> Parent </b>- Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item lg={12} md={12} sm={12}>
            {AccountParentProfile(parentDetail, UserType.PARENT)}
          </Grid>
        </Grid>

        <Typography sx={{ mt: 3, mb: 3 }} variant="h5">
          <b> Child </b>- Information
        </Typography>
        <Grid container spacing={3}>
          {parentDetail && parentDetail.child_detail.length > 0 ? (
            parentDetail.child_detail.map((value: any, index: number) => (
              <Grid item lg={6} md={6} sm={12} key={index}>
                {AccountChildProfile(value, UserType.CHILD)}
              </Grid>
            ))
          ) : (
            <Typography sx={{ mt: 2, ml: 3 }} variant="subtitle2">
              Child are not available yet!
            </Typography>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

ParentDetails.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default ParentDetails;
