import { styled } from "@mui/material/styles"
import { Backdrop, Box } from "../Layout/Layout"
import { CircularProgress } from "../Progress/Progress"

const AppLoaderContainer = styled(Box)`
  display: flex;
  justify-content: flex-center;
  align-items: center;
`

AppLoaderContainer.displayName = "AppLoaderContainer"

export const AppLoader = () => {
  return (
    <AppLoaderContainer>
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    </AppLoaderContainer>
  )
}

AppLoader.displayName = "AppLoader"
