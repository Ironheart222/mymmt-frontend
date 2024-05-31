import { Box, Chip } from "@mui/material";
import * as React from "react";
import { ApolloClientType, LessonData } from "../../store/Interface";
import { GetLessonWatched } from "../../store/slices/lessonSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { addLessonHistoryData } from "../../store/thunk/lessonThunk";

interface PropType {
  lessonObj: LessonData;
}

function VaultVideoPlayer(props: PropType) {
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
        });

        video.addEventListener("progress", () => {
          console.log("progress");
        });

        video.addEventListener("play", function () {
          // fullScreen(`child_${videoObj.id}_${lessonObj.lesson_id}`)
        });
        video.addEventListener("pause", function () {
          // cancelFullScreen()
          console.log("pause");
        });
        video.addEventListener("ended", () => {
          // cancelFullScreen()
        });
      }
    }
  }, [lessonObj]);

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

export default React.memo(VaultVideoPlayer);
