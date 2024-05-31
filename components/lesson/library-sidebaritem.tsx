import * as React from "react";
import { Menu, MenuItem } from "react-pro-sidebar";
import { currentWeek } from "../../helpers/helper";
import { WeeklyLessonData } from "../../store/Interface";
import LockIcon from "@mui/icons-material/Lock";
import { Box, Typography } from "@mui/material";

interface DataType {
  // pastData?: WeeklyLessonData,
  // upcomingData?: WeeklyLessonData,
  handleSelectedLesson: (
    lesson: any,
    isLock: boolean,
    challengesList: any,
    className: any
  ) => void;
  selectedLesson: any;
  lessonData: any;
  className: string;
  challengesList: any;
  isLock: boolean;
}

export const LibrarySidebarItem = (data: DataType) => {
  let {
    handleSelectedLesson,
    selectedLesson,
    lessonData,
    className,
    isLock,
    challengesList,
  } = data;

  React.useEffect(() => {
    let anchor = document.getElementById("lesson_" + selectedLesson.lesson_no);
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedLesson]);

  // if (pastData) {

  if (challengesList && Object.keys(challengesList).length) {
    return (
      <>
        <Menu
          className={
            className === "disable-lesson"
              ? " challenge-menu disable-challenge"
              : "challenge-menu"
          }
        >
          <MenuItem
            // id={"lesson_" + lessonData?.lesson_no}
            onClick={() => {
              className !== "disable-lesson"
                ? handleSelectedLesson(
                    lessonData,
                    isLock,
                    challengesList,
                    className
                  )
                : null;
            }}
            className={
              selectedLesson?.lesson_id == lessonData?.lesson_id &&
              className !== "disable-lesson"
                ? "active-challenge-menu"
                : ""
            }
          >
            <Typography variant="subtitle2">
              {challengesList.challenge_name}
            </Typography>
          </MenuItem>
        </Menu>
        <Menu className={className}>
          <MenuItem
            id={"lesson_" + lessonData?.lesson_no}
            onClick={() => {
              className !== "disable-lesson"
                ? handleSelectedLesson(lessonData, isLock, null, "")
                : null;
            }}
            className={
              selectedLesson?.lesson_id == lessonData?.lesson_id &&
              className !== "disable-lesson"
                ? "active-menu"
                : ""
            }
          >
            {isLock ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle2" sx={{ lineHeight: 0 }}>
                  {"Lesson " +
                    Number(
                      lessonData?.vdo_cipher_video?.title.split(" ").pop()
                    )}
                </Typography>
                <LockIcon />
              </Box>
            ) : (
              <Typography variant="subtitle2">
                {"Lesson " +
                  Number(lessonData?.vdo_cipher_video?.title.split(" ").pop())}
              </Typography>
            )}
          </MenuItem>
        </Menu>
      </>
    );
  } else {
    return (
      <Menu className={className}>
        <MenuItem
          id={"lesson_" + lessonData?.lesson_no}
          onClick={() => {
            className !== "disable-lesson"
              ? handleSelectedLesson(lessonData, isLock, null, "")
              : null;
          }}
          className={
            selectedLesson?.lesson_id == lessonData?.lesson_id &&
            className !== "disable-lesson"
              ? "active-menu"
              : ""
          }
        >
          {isLock ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle2" sx={{ lineHeight: 0 }}>
                {"Lesson " +
                  Number(lessonData?.vdo_cipher_video?.title.split(" ").pop())}
              </Typography>
              <LockIcon />
            </Box>
          ) : (
            <Typography variant="subtitle2">
              {"Lesson " +
                Number(lessonData?.vdo_cipher_video?.title.split(" ").pop())}
            </Typography>
          )}
        </MenuItem>
      </Menu>
    );
  }
};
