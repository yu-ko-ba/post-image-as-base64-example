import { LoadingButton } from "@mui/lab";
import { Button, Card, CardActions, CardContent, CardMedia, Container, Grid, TextField } from "@mui/material";
import axios from "axios";
import { useRef, useState } from "react";
import HeadWithOGP from "../components/HeadWithOGP";

export default function Home() {
  const [image, setImage] = useState("")
  const [base64Image, setBase64Image] = useState("")

  const [postUrl, setPostUrl] = useState("")
  const [canPost, setCanPost] = useState(false)

  const [waitingResponse, setWaitingResponse] = useState(false)

  const [responseData, setResponseData] = useState("")

  const postBase64Image = async (url: string, image: string) => {
    await axios.post( url, { image: image })
      .then((res) => {
        setResponseData(JSON.stringify(res.data, null, "    "))
      })
  }

  const imageInputRef = useRef(null)

  return (
    <Container maxWidth="sm">
      <HeadWithOGP
        url="https://yu-ko-ba.github.io/post-image-as-base64-example/"
        title="post-image-as-base64-example"
        imageUrl="https://raw.githubusercontent.com/yu-ko-ba/post-image-as-base64-example/main/screenshot.png"
      />
      <Grid container spacing={3}>
        <Grid item xs={12} />
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={() => {
              imageInputRef.current.click()
            }}
            fullWidth
          >
            Select Image
          </Button>
        </Grid>
        {(() => {
          if (image !== "" && base64Image !== "") {
            return (
              <Grid item xs={12}>
                <Card>
                  <CardMedia
                    component="img"
                    alt="image preview"
                    image={image}
                  />
                  <CardContent>
                    <TextField
                      label="base64"
                      value={base64Image}
                      multiline
                      maxRows={4}
                      disabled
                      fullWidth
                    />
                  </CardContent>
                </Card>
              </Grid>
            )
          }
        })()}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <TextField
                label="POST URL"
                onChange={(e) => {
                  const value = e.target.value
                  setPostUrl(value)
                  if (base64Image !== "" && value !== "") {
                    setCanPost(true)
                    return
                  }
                  setCanPost(false)
                }}
                multiline
                fullWidth
              />
            </CardContent>
            <CardActions>
              <LoadingButton
                variant="contained"
                loading={waitingResponse}
                onClick={() => {
                  setWaitingResponse(true)
                  postBase64Image(postUrl, base64Image)
                    .then(() => {
                      setWaitingResponse(false)
                    })
                }}
                disabled={!canPost}
                fullWidth
              >
                post
              </LoadingButton>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="response.data"
            value={responseData}
            multiline
            disabled
            fullWidth
          />
        </Grid>
        <Grid item xs={12} />
      </Grid>
      <input
        type="file"
        accept="image/jpeg"
        ref={imageInputRef}
        onChange={(event) => {
          const fileReader = new FileReader()
          fileReader.onload = (e) => {
            const image = e.target!.result as string
            setImage(image)
            setBase64Image(image.slice(23))
            if (postUrl !== "") {
              setCanPost(true)
            }
          }
          fileReader.readAsDataURL(event.target.files[0])
        }}
        hidden
      />
    </Container>
  )
}
