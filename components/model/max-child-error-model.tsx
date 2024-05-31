import { Button, Dialog, DialogContent, Typography } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";

interface Props {
  open: boolean;
  product: any;
  onClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const modalDetails = [
  {
    title: "Unfortunately you’ve reached your limit",
    paragraph_1:
      "A Single Child membership allows 1 child to be registered on the platform. To register additional children simply upgrade to a Family Membership in the Subscription tab.",
    paragraph_2:
      "If you have any questions please don’t hesitate to contact us at support@my5mt.com",
  },
  {
    title: "Unfortunately you’ve reached your limit",
    paragraph_1:
      "A Family membership allows up to 3 children to be registered on the platform.",
    paragraph_2:
      "To register additional children please contact our team at support@my5mt.com",
  },
];

export default function MaxChildErrorModel(props: Props) {
  let { open, onClose, product } = props;

  const [modelIndex, setModelIndex] = React.useState<number>(0);

  React.useEffect(() => {
    if (product?.metadata?.max_child_allowed) {
      if (Number(product?.metadata?.max_child_allowed) <= 1) {
        setModelIndex(0);
      } else if (Number(product?.metadata?.max_child_allowed) > 1) {
        setModelIndex(1);
      }
    }
  }, [product]);

  return (
    <Dialog
      open={open}
      scroll={"paper"}
      maxWidth={"sm"}
      className="dialog-container"
    >
      <DialogContent>
        <Box
          sx={{
            m: 2,
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <div>
            <Typography
              component="h1"
              variant="h4"
              className="header-h4 welcom-text"
            >
              {modalDetails[modelIndex].title}
            </Typography>
          </div>
          <div>
            <Typography component="p" className="login-text">
              {modalDetails[modelIndex].paragraph_1}
              <br />
              <br />
              {modalDetails[modelIndex].paragraph_2}
            </Typography>
          </div>
          <br />
          <div>
            <Button
              variant="contained"
              className="dialog-ok-button"
              onClick={onClose}
            >
              Got it
            </Button>
          </div>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
