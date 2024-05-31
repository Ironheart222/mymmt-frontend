import { Box } from "@mui/material";
import * as React from "react";
import { ApolloClientType } from "../../store/Interface";
import { useAppDispatch, useAppSelector } from "../../store/store";

interface PropType {
  resourceObj: any;
}

function VaultVideoPlayerResource(props: PropType) {
  const dispatch = useAppDispatch();
  const { userClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );

  let { resourceObj } = props;

  let windowObj: any = window;
  React.useEffect(() => {
    if (resourceObj) {
      let videoObj = resourceObj?.video_data || [];

      let vdo_container = document.querySelector(
        `#child_${resourceObj?.document_id}_${resourceObj?.folder_id}`
      );

      if (vdo_container && videoObj[0]) {
        let video = new windowObj.VdoPlayer({
          otp: videoObj[0]?.video_otp_data?.otp || null,
          playbackInfo: videoObj[0]?.video_otp_data?.playbackInfo || null,
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
          // fullScreen(`child_${videoObj.id}_${resourceObj.lesson_id}`)
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
  }, [resourceObj]);

  return (
    <Box className="flex-auto">
      <div id="all-player-top">
        <div id="all-player">
          <div
            style={{ position: "relative", zIndex: 1, height: "150px" }}
            id={`child_${resourceObj?.document_id}_${resourceObj?.folder_id}`}
          />
        </div>
      </div>
    </Box>
  );
}

export default React.memo(VaultVideoPlayerResource);
