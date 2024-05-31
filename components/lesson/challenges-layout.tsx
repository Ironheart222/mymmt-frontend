import * as React from "react";
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ApolloClientType,
  LessonData,
  WeeklyLessonData,
} from "../../store/Interface";
import VideoPlayer from "../video-player/videoplayer-library";
import { Description } from "@mui/icons-material";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  getChallengeLink,
  getLessonOTP,
  getWeeklyLessonData,
} from "../../store/thunk/lessonThunk";
import EyeIcon from "@mui/icons-material/RemoveRedEye";
import { setLoading } from "../../store/slices/loadingSlice";
import EmptyState from "../empty-state";
import { GetLessonOTP, GetWeeklyData } from "../../store/slices/lessonSlice";
import LockLessonModel from "../model/lock-lesson-model";

interface PropType {
  challengeData: any;
  className: any;
}

const ChallengeLayout = (props: PropType) => {
  let { challengeData, className } = props;
  const [pdfLink, setPdfLink] = React.useState<any>("");
  let dispatch = useAppDispatch();
  const { userClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const { challengeLink } = useAppSelector((state) => state.childLessonReducer);

  React.useEffect(() => {
    if (challengeData && Object.keys(challengeData).length) {
      dispatch(getChallengeLink({ _request: challengeData, userClient }));
    }
  }, [challengeData]);

  React.useEffect(() => {
    if (challengeLink) {
      setPdfLink(challengeLink);
    }
  }, [challengeLink]);

  return (
    <main className={className}>
      <Box display="flex" justifyContent="center">
        <Box className="challenge-btn">
          <Typography component="h5" variant="h5" sx={{ color: "#99FD31" }}>
            {challengeData.challenge_name}
          </Typography>

          <Button
            variant="contained"
            className="challenge_button"
            sx={{ mt: 2 }}
          >
            <a href={pdfLink} target="_blank" rel="noopener noreferrer">
              Click to Open
            </a>
          </Button>
        </Box>
      </Box>
    </main>
  );
};
export default React.memo(ChallengeLayout);
