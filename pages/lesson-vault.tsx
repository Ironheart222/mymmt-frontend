import * as React from "react";
import {
  Box,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
  OutlinedInput,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  CardContent,
  Tooltip,
  CardActions,
  Stack,
  Button,
  Card,
  InputLabel,
  Autocomplete,
  TextField,
  Divider,
  Pagination,
  Backdrop,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { mdTheme } from "../config/theme_config";
import Topbar from "../components/header/topbar";
import Auth from "../config/auth";
import {
  ApolloClientType,
  CoreConceptCategory,
  LessonData,
  VaultVideoData,
} from "../store/Interface";
import { useAppDispatch, useAppSelector } from "../store/store";
import { getVaultVideoData } from "../store/thunk/lessonThunk";
import VaultVideoPlayer from "../components/video-player/videoplayer-vault";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import { Description } from "@mui/icons-material";
import EmptyState from "../components/empty-state";
import { getCategoryForMapping } from "../store/thunk/admin/lesson";
import { GetVaultVideoData } from "../store/slices/lessonSlice";

function escapeRegExp(value: string) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function LessonVault(props: any) {
  const dispatch = useAppDispatch();
  const { userClient, adminClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const { vaultVideoData } = useAppSelector(
    (state) => state.childLessonReducer
  );
  const { childData } = useAppSelector((state) => state.childReducer);

  const [loading, setLoading] = React.useState<boolean>(true);
  const [searchText, setSearchText] = React.useState<string>("");
  const [vaultVideoList, setVaultVideoList] = React.useState<VaultVideoData[]>(
    []
  );
  const [view, setView] = React.useState("list");
  const [title, setTitle] = React.useState("Core Concepts");
  const [stageNo, setStageNo] = React.useState(0);
  const [categoryLoading, setCategoryLoading] = React.useState<boolean>(false);
  const [openACCategory, setOpenACCategory] = React.useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = React.useState<any>(null);
  const [categoryOptions, setCategoryOptions] = React.useState<
    readonly CoreConceptCategory[]
  >([]);
  const { coreConceptCategoryData } = useAppSelector(
    (state) => state.lessonReducer
  );

  const [page, setPage] = React.useState(1);
  const [pageCount, setPageCount] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);
  const [pageRange, setPageRange] = React.useState({
    start: 0,
    end: 0,
  });
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

  React.useEffect(() => {
    if (stageNo != 0) {
      setLoading(true);
      setTitle(
        stageNo == 2 ? "Core Concepts For Stage 2" : "Core Concepts For Stage 3"
      );
      let _request = {
        stage_no: stageNo == 2 ? 20 : 30,
        category_id: +selectedCategory?.category_id || 0,
        page_no: page,
      };
      dispatch(
        getVaultVideoData({
          _request,
          userClient,
          result: (response: any) => {
            setLoading(false);
          },
        })
      );
    }
  }, [stageNo, selectedCategory, page]);

  React.useEffect(() => {
    setCategoryLoading(false);
    setCategoryOptions(coreConceptCategoryData ? coreConceptCategoryData : []);
    // setSelectedCategory(coreConceptCategoryData ? coreConceptCategoryData[0] : null)
  }, [coreConceptCategoryData]);

  // React.useEffect(() => {
  // 	dispatch(getCategoryForMapping({ userClient }));
  //     setCategoryLoading(openACCategory);
  // },[]);

  React.useEffect(() => {
    if (!openACCategory) {
      setCategoryOptions([]);
    } else {
      dispatch(getCategoryForMapping({ userClient }));
    }
    setCategoryLoading(openACCategory);
  }, [openACCategory]);

  React.useEffect(() => {
    if (childData && childData.stage_no) {
      setStageNo(childData.stage_no);
    } else {
      setStageNo(0);
    }
  }, [childData]);

  React.useEffect(() => {
    let mainBreakPoints = {
      md: view === "tile" ? 4 : 12,
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

  React.useEffect(() => {
    setVaultVideoList(vaultVideoData?.rows || []);
    setPage(vaultVideoData?.page_no || 1);
    setTotalCount(Number(vaultVideoData.total_count));
    let pageCount = Math.ceil(Number(vaultVideoData.total_count) / 10);
    range(vaultVideoData?.total_count, vaultVideoData?.page_no);
    setPageCount(pageCount);
  }, [vaultVideoData]);

  const handleOnChange =
    (name: string) =>
    (
      event: React.SyntheticEvent<Element, Event>,
      value: CoreConceptCategory | string | null
    ) => {
      setSelectedCategory(value);
    };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setVaultVideoList([]);
    setPage(value);
  };

  const range = (totalItemsCount: any, page: any) => {
    // var numberOfPages = Math.floor((totalItemsCount + 10 - 1) / 10);
    const numberOfItemsPerPage = 10;
    var start = page * numberOfItemsPerPage - (numberOfItemsPerPage - 1);
    var end = Math.min(page * numberOfItemsPerPage, totalItemsCount);

    setPageRange({
      start: start,
      end: end,
    });
  };

  // const reqestSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
  // 	setSearchText(event.target.value);
  // 	const searchRegex = new RegExp(escapeRegExp(event.target.value), 'i');
  // 	const filteredData = vaultVideoData.filter((value) => {
  // 		return searchRegex.test(value.title);
  // 	})
  // 	if (!event.target.value) {
  // 		setVaultVideoList(vaultVideoData);
  // 	} else {
  // 		setVaultVideoList(filteredData);
  // 	}

  // }

  return (
    <ThemeProvider theme={mdTheme}>
      <CssBaseline />
      <Topbar id={3} />
      <main className="main-content bg-grey">
        <Box
          sx={{
            // bgcolor: 'background.paper',
            pt: {
              lg: 4,
              md: 4,
              sm: 2,
              xs: 0,
            },
            pb: 6,
          }}
        >
          <Container maxWidth="md">
            <Grid container>
              <Grid item md={6} sm={8} xs={12} alignItems="center">
                <Typography
                  component="h1"
                  align="center"
                  variant="h5"
                  gutterBottom
                  className="vault-header"
                >
                  {title}
                </Typography>
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Autocomplete
                  id="asynchronous-demo"
                  open={openACCategory}
                  onOpen={() => {
                    setOpenACCategory(true);
                  }}
                  onClose={() => {
                    setOpenACCategory(false);
                  }}
                  fullWidth
                  size="small"
                  onChange={handleOnChange("category")}
                  value={selectedCategory ? selectedCategory : null}
                  isOptionEqualToValue={(option, value) =>
                    option?.category_tag === value?.category_tag
                  }
                  getOptionLabel={(option) => option?.category_name}
                  options={categoryOptions}
                  loading={categoryLoading}
                  loadingText={"Loading..."}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      // error={formError && formError.category ? true : false}
                      // helperText={formError && formError.category}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {categoryLoading ? (
                              <CircularProgress
                                color="inherit"
                                size={20}
                                sx={{ mr: 4 }}
                              />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              {vaultVideoList && vaultVideoList.length > 0 ? (
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
              {/* <Grid item md={2} sm={4} xs={12}>
								<Grid container spacing={1} className="vault-search">
									<Grid item xs={12} className="search-wrapper">
										<OutlinedInput
											className="slideOut"
											placeholder="Search"
											sx={{ borderRadius: "8px" }}
											value={searchText}
											onChange={reqestSearch}
											endAdornment={
												<InputAdornment position="end">
													<IconButton>
														<img src="/images/Iconly-Bold-Search.svg" className='img-invert' alt='search' />
													</IconButton>
												</InputAdornment>
											}
										/>
									</Grid>
								</Grid>
							</Grid> */}
            </Grid>
          </Container>
        </Box>
        <Container maxWidth="md" sx={{ backgroundColor: "white", pb: 4 }}>
          <Grid container spacing={4}>
            {vaultVideoList.length > 0 &&
              vaultVideoList.map((lesson: any, index: number) => {
                return (
                  <Grid
                    item
                    md={breakPoint.main.md}
                    sm={breakPoint.main.sm}
                    xs={breakPoint.main.xs}
                    key={index}
                  >
                    <Card elevation={6} sx={{ height: "100%" }}>
                      {view === "list" ? (
                        <Grid container>
                          <Grid
                            textAlign={"center"}
                            sx={{ p: "12px" }}
                            item
                            md={breakPoint.item.md}
                            sm={breakPoint.item.sm}
                            xs={breakPoint.item.xs}
                          >
                            {console.log("lesson", lesson)}
                            {Object.keys(lesson).length > 0 && (
                              <VaultVideoPlayer lessonObj={lesson} />
                            )}
                          </Grid>

                          <Grid
                            item
                            md={12 - breakPoint.item.md}
                            sm={12 - breakPoint.item.sm}
                            xs={breakPoint.item.xs}
                            display={"flex"}
                            flexDirection={"column"}
                          >
                            <CardContent
                              sx={{
                                flexGrow: 2,
                                px: "8px",
                                pt: "8px",
                                pb: "0px",
                              }}
                            >
                              <Box
                                display={"flex"}
                                flexDirection="row"
                                justifyContent={"space-between"}
                              >
                                <Tooltip title={lesson.vdo_cipher_video.title}>
                                  <Typography
                                    component={"p"}
                                    variant={"caption"}
                                    className={
                                      view === "list"
                                        ? "text-list-title"
                                        : "text-tile-title"
                                    }
                                  >
                                    {lesson.vdo_cipher_video.title}
                                  </Typography>
                                </Tooltip>
                              </Box>
                              {lesson.vdo_cipher_video?.description && (
                                <Box className="lesson_description">
                                  <Divider sx={{ my: 1 }} />
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        lesson.vdo_cipher_video?.description,
                                    }}
                                  ></div>
                                </Box>
                              )}
                            </CardContent>
                            {lesson.worksheet_detail && (
                              <CardActions
                                sx={{
                                  flexGrow: 1,
                                  pt: "0px",
                                  alignItems: "end",
                                }}
                              >
                                <Stack
                                  spacing={1}
                                  direction={
                                    view === "list"
                                      ? {
                                          md: "row",
                                          sm: "column-reverse",
                                          xs: "column-reverse",
                                        }
                                      : "column-reverse"
                                  }
                                >
                                  <Button type="button" variant="contained">
                                    <a
                                      href={
                                        lesson.worksheet_detail.worksheet_url
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Lesson Worksheet
                                    </a>
                                  </Button>
                                  {lesson.worksheet_detail && (
                                    <Box
                                      alignItems={"center"}
                                      sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                      }}
                                    >
                                      <Description className="description-icon" />
                                      <Tooltip
                                        title={
                                          lesson?.worksheet_detail
                                            ?.worksheet_name || ""
                                        }
                                      >
                                        <Typography
                                          component={"p"}
                                          variant={"caption"}
                                          className="text-with-icon"
                                        >
                                          {
                                            lesson.worksheet_detail
                                              .worksheet_name
                                          }
                                        </Typography>
                                      </Tooltip>
                                    </Box>
                                  )}
                                </Stack>
                              </CardActions>
                            )}
                          </Grid>
                        </Grid>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                          }}
                        >
                          <Box sx={{ p: "12px" }}>
                            {console.log("lesson", lesson)}
                            {Object.keys(lesson).length > 0 && (
                              <VaultVideoPlayer lessonObj={lesson} />
                            )}
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              height: "100%",
                            }}
                          >
                            <CardContent
                              sx={{
                                flexGrow: 2,
                                px: "8px",
                                pt: "8px",
                                pb: "0px",
                              }}
                            >
                              <Box
                                display={"flex"}
                                flexDirection="row"
                                justifyContent={"space-between"}
                              >
                                <Tooltip title={lesson.vdo_cipher_video.title}>
                                  <Typography
                                    component={"p"}
                                    variant={"caption"}
                                    className={
                                      view === "list"
                                        ? "text-list-title"
                                        : "text-tile-title"
                                    }
                                  >
                                    {lesson.vdo_cipher_video.title}
                                  </Typography>
                                </Tooltip>
                              </Box>
                              {lesson.vdo_cipher_video?.description && (
                                <Box className="lesson_description">
                                  <Divider sx={{ my: 1 }} />
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        lesson.vdo_cipher_video?.description,
                                    }}
                                  ></div>
                                </Box>
                              )}
                            </CardContent>
                            {lesson.worksheet_detail && (
                              <CardActions
                                sx={{
                                  flexGrow: 1,
                                  pt: "0px",
                                  alignItems: "end",
                                  mt: 2,
                                }}
                              >
                                <Stack
                                  spacing={1}
                                  direction={
                                    view === "list"
                                      ? {
                                          md: "row",
                                          sm: "column-reverse",
                                          xs: "column-reverse",
                                        }
                                      : "column-reverse"
                                  }
                                >
                                  <Button type="button" variant="contained">
                                    <a
                                      href={
                                        lesson.worksheet_detail.worksheet_url
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Lesson Worksheet
                                    </a>
                                  </Button>
                                  {lesson.worksheet_detail && (
                                    <Box
                                      alignItems={"center"}
                                      sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                      }}
                                    >
                                      <Description className="description-icon" />
                                      <Tooltip
                                        title={
                                          lesson?.worksheet_detail
                                            ?.worksheet_name || ""
                                        }
                                      >
                                        <Typography
                                          component={"p"}
                                          variant={"caption"}
                                          className="text-with-icon"
                                        >
                                          {
                                            lesson.worksheet_detail
                                              .worksheet_name
                                          }
                                        </Typography>
                                      </Tooltip>
                                    </Box>
                                  )}
                                </Stack>
                              </CardActions>
                            )}
                          </Box>
                        </Box>
                      )}
                    </Card>
                  </Grid>
                );
              })}
          </Grid>

          {!loading && vaultVideoList && vaultVideoList.length <= 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <EmptyState />
            </Box>
          )}

          {vaultVideoList.length > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 2,
                flexDirection: { md: "row", sm: "row", xs: "column" },
              }}
            >
              <Typography align="center" variant="body1" gutterBottom>
                Showing {pageRange.start} to {pageRange.end} from {totalCount}{" "}
                Lessons
              </Typography>
              <Pagination
                count={pageCount}
                size={"small"}
                showFirstButton
                showLastButton
                page={page}
                onChange={handlePageChange}
              />
            </Box>
          )}

          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 2,
              }}
            >
              {/* <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading} > */}
              <CircularProgress color="primary" />
              {/* <div className="balls">
										<div className="ball one"></div>
										<div className="ball two"></div>
										<div className="ball three"></div>
									</div> */}
              {/* </Backdrop> */}
            </Box>
          )}
        </Container>
      </main>
    </ThemeProvider>
  );
}
export default Auth(LessonVault);
