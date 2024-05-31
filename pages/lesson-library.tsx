import * as React from "react";
import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { mdTheme } from "../config/theme_config";
import Topbar from "../components/header/topbar";
import Auth from "../config/auth";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  getChildWeekData,
  getCurrWeekLesson,
  getWeekWiseLesson,
} from "../store/thunk/lessonThunk";
import {
  ApolloClientType,
  SidebarData,
  WeeklyLessonData,
} from "../store/Interface";
import Router from "next/router";
import { userLogout } from "../helpers/helper";
import WeekLessonLayout from "../components/lesson/week-lesson-layout";
import LessonSidebar from "../components/lesson/lesson-sidebar";
import EmptyState from "../components/empty-state";
import { GetWeeklyData } from "../store/slices/lessonSlice";
import { setLoading } from "../store/slices/loadingSlice";
import AllLessonLayout from "../components/lesson/all-lesson-layout";
import { logout } from "../store/slices/userSlice";
import LockLessonModel from "../components/model/lock-lesson-model";
import ChallengesLayout from "../components/lesson/challenges-layout";

function LessonLibrary() {
  let [selectedLesson, setSelectedLesson] = React.useState<any>({});
  let [challengeData, setChallengeData] = React.useState<any>({});
  let [lastWatchLesson, setLastWatchLesson] = React.useState<any>({});
  let [isLessonLock, setIsLessonLock] = React.useState<boolean>(false);

  const handleSelectedLesson = (
    lesson: any,
    isLock: boolean,
    challengeData: any = null,
    className: any = ""
  ) => {
    setIsLessonLock(isLock);
    if (challengeData && Object.keys(challengeData).length) {
      setChallengeData(challengeData);
      setSelectedLesson({});
    } else {
      setChallengeData({});
      setSelectedLesson(lesson);
    }
  };

  const setLastWatchLession = (lastWatchLessonNo: any) => {
    setLastWatchLesson(lastWatchLessonNo);
  };

  const handleCloseModel = () => {
    handleSelectedLesson(lastWatchLesson, false, null, "");
    // setSelectedLesson(lastWatchLesson)
  };

  const lessonLayout = React.useMemo(() => {
    if (challengeData && Object.keys(challengeData).length) {
      return (
        <ChallengesLayout
          className={"lesson-library main-content"}
          challengeData={challengeData}
        />
      );
    } else {
      return (
        <WeekLessonLayout
          className={"lesson-library main-content"}
          selectedLesson={selectedLesson}
          isLessonLock={isLessonLock}
          handleCloseModel={handleCloseModel}
        />
      );
    }
  }, [selectedLesson]);

  return (
    <ThemeProvider theme={mdTheme}>
      <CssBaseline />
      <Topbar id={2} />
      <Box>
        <Box display={"flex"} flexDirection={"row"}>
          <LessonSidebar
            handleSelectedLesson={handleSelectedLesson}
            selectedLesson={selectedLesson}
            handleLastWatchLesson={setLastWatchLession}
          />
          {lessonLayout}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Auth(LessonLibrary);
