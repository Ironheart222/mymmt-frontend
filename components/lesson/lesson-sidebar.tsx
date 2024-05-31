import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import {
  Menu,
  MenuItem,
  ProSidebar,
  SidebarContent,
  SidebarHeader,
} from "react-pro-sidebar";
import { ArrowForwardIos } from "@mui/icons-material";
import { LibrarySidebarItem } from "./library-sidebaritem";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  getChildWeekData,
  getWeekWiseLesson,
} from "../../store/thunk/lessonThunk";
import { setLoading } from "../../store/slices/loadingSlice";
import { logout } from "../../store/slices/userSlice";
import Router from "next/router";
import { ApolloClientType } from "../../store/Interface";

interface Props {
  handleSelectedLesson: (
    lesson: any,
    isLock: boolean,
    challengesList: any,
    className: any
  ) => void;
  selectedLesson: number;
  handleLastWatchLesson: (lesson: any) => void;
}

const LessonSidebar = (props: Props) => {
  const { handleSelectedLesson, selectedLesson, handleLastWatchLesson } = props;

  const dispatch = useAppDispatch();
  const { userClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const { childData } = useAppSelector((state) => state.childReducer);
  const { weekWiseLessonData } = useAppSelector(
    (state) => state.childLessonReducer
  );

  const [slideOpen, setSlideOpen] = React.useState(false);
  const [childInfo, setChildInfo] = React.useState<any>({});
  const [selectedLessonData, setSelectedLessonData] = React.useState<any>({});
  const [currWatchLessonNo, setCurrWatchLessonNo] = React.useState<any>(0);
  let [lastWatchLession, setLastWatchLession] = React.useState<any>(null);
  let [currWeekLesson, setCurrWeekLesson] = React.useState<any[]>([]);
  let [lessonList, setLessonList] = React.useState<any[]>([]);
  let [challengesList, setChallengesList] = React.useState<any[]>([]);
  let [tempIndex, setTempIndex] = React.useState<any>(0);

  React.useEffect(() => {
    if (childData) {
      setChildInfo(childData);
    }
  }, [childData]);

  React.useEffect(() => {
    let child_id = localStorage.getItem("child_id");
    if (child_id) {
      dispatch(setLoading(true));
      dispatch(getChildWeekData({ _request: child_id, userClient }));
      dispatch(getWeekWiseLesson({ _request: child_id, userClient }));
    } else {
      dispatch(logout());
      Router.replace("/");
    }
  }, []);

  React.useEffect(() => {
    if (weekWiseLessonData && weekWiseLessonData.data) {
      // 02/Jan/2022 - Old Code
      /* let lastWatchLessonNo = +weekWiseLessonData?.data?.lastWatchLession;
      if (+lastWatchLessonNo !== +weekWiseLessonData?.data.lessionList.length) {
        lastWatchLessonNo = lastWatchLessonNo + 1;
      } */
      // 02/Jan/2022 - new code updated as it not shows lock icon in stage 3 in first step
      let lastWatchLessonNo = +weekWiseLessonData?.data?.lastWatchLession + 1;
      let lessonData =
        weekWiseLessonData?.data?.lastWatchLession != 0
          ? weekWiseLessonData?.data.lessionList.filter(
              (val: any) => val.lesson_no === lastWatchLessonNo
            )
          : weekWiseLessonData?.data?.lessionList;

      if (selectedLesson && Object.keys(selectedLesson).length == 0) {
        handleSelectedLesson(lessonData[0], false, null, "");
      }
      handleLastWatchLesson(lessonData[0]);
      setLastWatchLession(lastWatchLessonNo);
      setCurrWeekLesson(weekWiseLessonData?.data?.currentWeekLession || []);
      setLessonList(weekWiseLessonData?.data.lessionList || []);
      setChallengesList(weekWiseLessonData?.data.challenges || []);
    }
  }, [weekWiseLessonData]);

  React.useEffect(() => {
    if (selectedLesson && Object.keys(selectedLesson).length > 0) {
      setSelectedLessonData(selectedLesson);
    } else {
      setSelectedLessonData({});
    }
  }, [selectedLesson]);

  React.useEffect(() => {
    let lesson =
      weekWiseLessonData?.data?.lastWatchLession != 0
        ? lessonList.filter((val) => +val.lesson_no == lastWatchLession)
        : lessonList;

    setCurrWatchLessonNo(lesson[0]?.lesson_no || 0);
  }, [lessonList, lastWatchLession]);

  const handleToggleSidebar = () => {
    setSlideOpen(!slideOpen);
  };

  const handleLessonStatus = (
    val: any,
    currWatchLessonNo: any,
    currWeekLesson: any,
    challengeValue: any
  ) => {
    let className = "";
    if (Number(val.lesson_no) > Number(currWatchLessonNo)) {
      className = "disable-lesson";
    }

    if (
      (currWeekLesson[1] >= val.lesson_no &&
        currWatchLessonNo < val.lesson_no) ||
      val.lesson_no == currWatchLessonNo + 1
    ) {
      className = "lock-lesson";
    }
    return className;
  };

  const isLessonLock = React.useCallback(
    (val: any, currWatchLessonNo: any, currWeekLesson: any) => {
      if (
        (currWeekLesson[1] >= val.lesson_no &&
          currWatchLessonNo < val.lesson_no) ||
        val.lesson_no == currWatchLessonNo + 1
      ) {
        return true;
      } else {
        return false;
      }
    },
    [currWatchLessonNo]
  );

  return (
    <>
      <div
        className={slideOpen ? "sidebar-wrapper active" : "sidebar-wrapper"}
      ></div>
      <ProSidebar className={slideOpen ? "active" : ""}>
        <div className="sidebar-btn" onClick={handleToggleSidebar}>
          <ArrowForwardIos />
        </div>
        <div className="menusidebar-wrapper">
          <SidebarContent>
            <Box>
              {childInfo?.stage_no && (
                <Typography className="sidebar-subtitle" sx={{ py: 1 }}>
                  {"Stage " + childInfo?.stage_no + " Lessons"}
                </Typography>
              )}
              <Divider color="grey" sx={{ mb: 1 }} />
              {lessonList.map((val, i) => {
                console.log("divide", i / 4);
                console.log("i / 4 - 1", i / 4 - 1);

                const challengeValue =
                  i > 0 && i % 4 === 0 && challengesList[i / 4 - 1]
                    ? challengesList[i / 4 - 1]
                    : null;

                return (
                  <LibrarySidebarItem
                    selectedLesson={selectedLessonData}
                    handleSelectedLesson={handleSelectedLesson}
                    key={i}
                    lessonData={val}
                    challengesList={challengeValue}
                    isLock={isLessonLock(
                      val,
                      currWatchLessonNo,
                      currWeekLesson
                    )}
                    className={handleLessonStatus(
                      val,
                      currWatchLessonNo,
                      currWeekLesson,
                      challengeValue
                    )}
                  />
                );
                // if (i > 0 && i % 4 === 0 && challengesList[i / 4 - 1]) {
                //   return (
                //     <Box>
                //       <Button>testttttt</Button>

                //     </Box>
                //   );
                // } else {
                //   return (
                //     <LibrarySidebarItem
                //       selectedLesson={selectedLessonData}
                //       handleSelectedLesson={handleSelectedLesson}
                //       key={i}
                //       lessonData={val}
                //       isLock={isLessonLock(
                //         val,
                //         currWatchLessonNo,
                //         currWeekLesson
                //       )}
                //       className={handleLessonStatus(
                //         val,
                //         currWatchLessonNo,
                //         currWeekLesson
                //       )}
                //     />
                //   );
                // }
              })}
            </Box>
          </SidebarContent>
        </div>
      </ProSidebar>
    </>
  );
};
export default React.memo(LessonSidebar);
