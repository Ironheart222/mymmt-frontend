import { Box, Chip } from "@mui/material";
import * as React from "react";
import { ApolloClientType, LessonData } from "../../store/Interface";
import { GetLessonWatched } from "../../store/slices/lessonSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { addLessonHistoryData } from "../../store/thunk/lessonThunk";

interface PropType {
  lessonObj: LessonData;
  weekNo?: number;
}

function VideoPlayer(props: PropType) {
  const dispatch = useAppDispatch();
  const { userClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );

  let { lessonObj } = props;

  let windowObj: any = window;
  React.useEffect(() => {
    if (lessonObj) {
      let videoObj = lessonObj.vdo_cipher_video;

      let vdo_container = document.querySelector(
        `#child_${videoObj?.id}_${lessonObj?.lesson_id}`
      );
      if (vdo_container) {
        let watchedFlag = lessonObj.history_detail?.length > 0 ? true : false;
        var video = new windowObj.VdoPlayer({
          otp: videoObj?.otp || null,
          playbackInfo: videoObj?.playbackInfo || null,
          theme: "9ae8bbe8dd964ddc9bdb932cca1cb59a",
          container: vdo_container,
          allowFullScreen: false,
          plugins: [
            {
              name: "keyboard",
              options: {
                bindings: {
                  Space: (player: any) =>
                    player.status === 1 ? player.pause() : player.play(),
                  // 'Up' : (player : any) => player.setVolume(player.volume + 0.2),
                  // 'Down' : (player : any) => player.setVolume(player.volume - 0.2),
                  // 'Left': (player : any) => player.seek(player.currentTime - 20),
                  // 'Right': (player : any) => player.seek(player.currentTime + 20),
                },
              },
            },
          ],
        });

        video.addEventListener(`load`, () => {
          console.log("loaded");
        });

        video.addEventListener("seeking", () => {
          console.log("seeking");
          let currTime: number = Math.round(video.currentTime);
          let videoDuration: number = video._metaData.duration;
          let watchTime = videoDuration - 120;
          if (currTime >= watchTime) {
            watchedFlag = true;
            setWatchLesson(+lessonObj.lesson_id);
          }
        });

        video.addEventListener("progress", () => {
          console.log("progress");
          let currTime: number = Math.round(video.currentTime);
          let videoDuration: number = video._metaData.duration;
          let watchTime = videoDuration - 120;

          if (
            currTime >= watchTime &&
            currTime < videoDuration &&
            !watchedFlag
          ) {
            watchedFlag = true;
            setWatchLesson(+lessonObj.lesson_id);
          }
        });

        video.addEventListener("play", function () {
          // fullScreen(`child_${videoObj.id}_${lessonObj.lesson_id}`)
        });
        video.addEventListener("pause", function () {
          // cancelFullScreen()
          console.log("pause");
          let currTime: number = Math.round(video.currentTime);
          let videoDuration: number = video._metaData.duration;
          let watchTime = videoDuration - 120;
          if (currTime >= watchTime) {
            watchedFlag = true;
            setWatchLesson(+lessonObj.lesson_id);
          }
        });
        video.addEventListener("ended", () => {
          // cancelFullScreen()
          let currTime: number = Math.round(video.currentTime);
          let videoDuration: number = video._metaData.duration;
          let watchTime = videoDuration - 120;
          if (currTime >= watchTime) {
            console.log("Video Watched");
            watchedFlag = true;
            setWatchLesson(+lessonObj.lesson_id);
          }
        });
      }
    }
  }, [lessonObj]);

  const setWatchLesson = (lesson_id: any) => {
    if (lesson_id && lesson_id != 0) {
      let child_id = localStorage.getItem("child_id");
      let _request = {
        child_id: child_id,
        lesson_id: +lessonObj.lesson_id,
      };
      dispatch(addLessonHistoryData({ _request, userClient }));
    }
  };

  const fullScreen = (htmlContent: any) => {
    let e: any = document.getElementById(htmlContent);

    if (document.fullscreenElement == null) {
      if (e.requestFullscreen) {
        e.requestFullscreen();
      } else if (e.webkitRequestFullscreen) {
        e.webkitRequestFullscreen();
      } else if (e.mozRequestFullScreen) {
        e.mozRequestFullScreen();
      } else if (e.msRequestFullscreen) {
        e.msRequestFullscreen();
      }
    }
  };
  const cancelFullScreen = () => {
    try {
      if (document && document.fullscreenElement) {
        document.exitFullscreen();
      }
    } catch (error) {
      console.log("error ", error);
    }
  };

  return (
    <Box className="flex-auto">
      <div id="all-player-top">
        <div id="all-player">
          <div
            style={{ position: "relative", zIndex: 1, height: "220px" }}
            id={`child_${lessonObj.vdo_cipher_video?.id}_${lessonObj.lesson_id}`}
          />
        </div>
      </div>
    </Box>
  );
}

export default React.memo(VideoPlayer);
