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
  getLessonOTP,
  getWeeklyLessonData,
} from "../../store/thunk/lessonThunk";
import EyeIcon from "@mui/icons-material/RemoveRedEye";
import { setLoading } from "../../store/slices/loadingSlice";
import EmptyState from "../empty-state";
import { GetLessonOTP, GetWeeklyData } from "../../store/slices/lessonSlice";
import LockLessonModel from "../model/lock-lesson-model";

interface PropType {
  className: string;
  selectedLesson: any;
  isLessonLock: boolean;
  handleCloseModel: () => void;
}

const WeekLessonLayout = (props: PropType) => {
  let { className, selectedLesson, isLessonLock, handleCloseModel } = props;

  let dispatch = useAppDispatch();
  const { userClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const { lessonOTP, watchedFlag } = useAppSelector(
    (state) => state.childLessonReducer
  );

  const [view, setView] = React.useState("list");
  const [breakPoint, setBreakPoint] = React.useState({
    main: {
      xs: 12,
      sm: 12,
      md: 12,
    },
    item: {
      xs: 12,
      sm: 12,
      md: 12,
    },
  });
  let [lessonItem, setLessonItem] = React.useState<any>({});
  const [openLockLessonModel, setOpenLockLessonModel] =
    React.useState<boolean>(false);
  const [showEmptyState, setShowEmptyState] = React.useState<boolean>(false);
  // let [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    setOpenLockLessonModel(isLessonLock);
  }, [isLessonLock]);

  React.useEffect(() => {
    dispatch(GetLessonOTP({}));
    if (selectedLesson && selectedLesson.lesson_id) {
      let child_id = localStorage.getItem("child_id");
      let _request = {
        child_id: child_id ? Number(child_id) : 0,
        lesson_id: +selectedLesson.lesson_id,
      };
      dispatch(getLessonOTP({ _request, userClient }));
    }
  }, [selectedLesson]);

  React.useEffect(() => {
    if (lessonOTP && Object.keys(lessonOTP).length > 0) {
      setLessonItem(lessonOTP);
      setShowEmptyState(false);
    } else {
      setShowEmptyState(true);
    }
    dispatch(setLoading(false));
  }, [lessonOTP]);

  React.useEffect(() => {
    let mainBreakPoints = {
      md: view === "tile" ? 5 : 12,
      sm: view === "tile" ? 6 : 12,
      xs: view === "tile" ? 12 : 12,
    };
    let itemBreakPoints = {
      md: view === "tile" ? 12 : 4,
      sm: view === "tile" ? 12 : 4,
      xs: view === "tile" ? 12 : 12,
    };
    setBreakPoint({
      main: mainBreakPoints,
      item: itemBreakPoints,
    });
  }, [view]);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    nextView: string
  ) => {
    setView(nextView);
  };

  return (
    <main className={className}>
      <Box
        sx={{
          bgcolor: "background.paper",
          pt: 2,
          pb: 4,
        }}
      >
        <Container maxWidth="md">
          <Grid container>
            <Grid
              item
              md={Object.keys(lessonItem).length > 0 ? 10 : 12}
              sm={Object.keys(lessonItem).length > 0 ? 8 : 12}
              xs={12}
              alignItems="center"
            >
              <Stack direction="row" justifyContent="center">
                {lessonItem && lessonItem?.vdo_cipher_video?.title && (
                  <Button
                    className="video-button"
                    disableTouchRipple
                    disableElevation
                    variant="contained"
                  >
                    Lesson Number{" "}
                    {Number(
                      lessonItem?.vdo_cipher_video?.title.split(" ").pop()
                    )}
                  </Button>
                )}
              </Stack>
            </Grid>
            {lessonItem && Object.keys(lessonItem).length > 0 ? (
              <Grid
                item
                md={2}
                sm={4}
                xs={5}
                textAlign="end"
                display={{ xs: "none", sm: "block" }}
              >
                <ToggleButtonGroup
                  orientation="horizontal"
                  value={view}
                  exclusive
                  onChange={handleChange}
                >
                  <ToggleButton value="list" aria-label="list">
                    <ViewListIcon />
                  </ToggleButton>
                  <ToggleButton value="tile" aria-label="tile">
                    <ViewModuleIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            ) : null}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ backgroundColor: "white", pb: 4 }}>
        <Grid container spacing={4} alignItems={"center"}>
          <Grid
            item
            md={breakPoint.main.md}
            sm={breakPoint.main.sm}
            xs={breakPoint.main.xs}
          >
            {Object.keys(lessonItem).length > 0 && (
              <Card elevation={6}>
                <Grid container>
                  <Grid
                    textAlign={"center"}
                    sx={{ p: "12px" }}
                    item
                    md={breakPoint.item.md}
                    sm={breakPoint.item.sm}
                    xs={breakPoint.item.xs}
                  >
                    {Object.keys(lessonItem).length > 0 && (
                      <VideoPlayer lessonObj={lessonItem} />
                    )}
                  </Grid>

                  <Grid
                    item
                    md={12 - breakPoint.item.md}
                    sm={12 - breakPoint.item.sm}
                    xs={breakPoint.item.xs}
                    sx={{ height: view === "tile" ? "auto" : "auto" }}
                    display={"flex"}
                    flexDirection={"column"}
                  >
                    <CardContent
                      sx={{ flexGrow: 2, px: "8px", pt: "8px", pb: "0px" }}
                    >
                      <Box
                        display={"flex"}
                        flexDirection="row"
                        justifyContent={"space-between"}
                      >
                        <Tooltip
                          title={lessonItem.vdo_cipher_video?.title || ""}
                        >
                          <Typography
                            component={"p"}
                            variant={"caption"}
                            className={
                              view === "list"
                                ? "text-list-title"
                                : "text-tile-title"
                            }
                          >
                            {lessonItem.vdo_cipher_video?.title || ""}
                          </Typography>
                        </Tooltip>
                        {watchedFlag && (
                          <Tooltip title="watched">
                            <EyeIcon sx={{ ml: 1, color: "#008000" }} />
                          </Tooltip>
                        )}
                      </Box>
                      {lessonItem.vdo_cipher_video?.description && (
                        <Box className="lesson_description">
                          <Divider sx={{ my: 1 }} />
                          <div
                            dangerouslySetInnerHTML={{
                              __html: lessonItem.vdo_cipher_video?.description,
                            }}
                          ></div>
                        </Box>
                      )}
                    </CardContent>
                    {lessonItem.worksheet_detail && (
                      <CardActions
                        sx={{ flexGrow: 1, pt: "0px", alignItems: "end" }}
                      >
                        <Stack
                          spacing={1}
                          direction={
                            view === "tile"
                              ? { sm: "column-reverse", xs: "column-reverse" }
                              : { sm: "row", xs: "column-reverse" }
                          }
                        >
                          <Button type="button" variant="contained">
                            <a
                              href={lessonItem.worksheet_detail.worksheet_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Lesson Worksheet
                            </a>
                          </Button>
                          {lessonItem.worksheet_detail && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "row",
                              }}
                            >
                              <Description fontSize="small" />
                              <Tooltip
                                title={
                                  lessonItem?.worksheet_detail
                                    ?.worksheet_name || ""
                                }
                              >
                                <Typography
                                  component={"p"}
                                  variant={"caption"}
                                  className="text-with-icon"
                                >
                                  {lessonItem.worksheet_detail.worksheet_name}
                                </Typography>
                              </Tooltip>
                            </Box>
                          )}
                        </Stack>
                      </CardActions>
                    )}
                  </Grid>
                </Grid>
              </Card>
            )}
          </Grid>
          {/* {
						showEmptyState && (
							<Grid item md={12} sm={12} xs={12}>
								<EmptyState />
							</Grid>
						)
					} */}
        </Grid>
      </Container>
      {openLockLessonModel && (
        <LockLessonModel
          open={openLockLessonModel}
          lesson={selectedLesson}
          onClose={handleCloseModel}
        />
      )}
    </main>
  );
};
export default React.memo(WeekLessonLayout);
