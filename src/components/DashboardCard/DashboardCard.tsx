import { Flip, OpenInFull } from "@mui/icons-material"
import {
  Card as MUICard, // eslint-disable-line no-restricted-imports
  CardActionArea as MUICardActionArea, // eslint-disable-line no-restricted-imports
  CardContent as MUICardContent, // eslint-disable-line no-restricted-imports
} from "@mui/material"
import { styled } from "@mui/material/styles"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getTextContentFromNode } from "../../utils/components"
import { getNavigateToHrefClickHandler } from "../../utils/urls"
import { Box, Grid, GridSize, ResponsiveStyleValue, Typography } from "../Layout/Layout"
import { Button } from "../Button/Button"

const CardContainer = styled(Box)`
  position: relative;
  transform: perspective(2000px);
  transform-style: preserve-3d;
  transition: transform 400ms ease-in-out;

  &.flipped {
    transform: perspective(2000px) rotateY(180deg);
  }

  &.maximized {
    position: fixed;
    top: 64px;
    left: 0;
    width: 100vw;
    height: calc(100vh - 64px);
    z-index: 5;
    transition: none;

    > .MuiPaper-root {
      border: none;
      height: 100%;
    }
  }
`

CardContainer.displayName = "CardContainer"

const CardFront = styled(MUICard)`
  backface-visibility: hidden;
`

CardFront.displayName = "CardFront"

const CardBack = styled(MUICard)`
  backface-visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotateY(180deg);
`

CardBack.displayName = "CardBack"

const CardTitleBar = styled(Grid)`
  display: flex;
  margin-bottom: 1rem;
`

CardTitleBar.displayName = "CardTitleBar"

const CardTitle = styled(Typography)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  align-content: center;
  flex: 1;
`

CardTitle.displayName = "CardTitle"

const CardBody = styled(Grid)`
  display: flex;
  height: calc(100% - 3rem);

  > * {
    flex: 1;
    min-height: 300px;
    height: auto !important;
  }
`

CardBody.displayName = "CardBody"

const FlippedFlip = styled(Flip)`
  transform: rotateY(180deg);
`

FlippedFlip.displayName = "FlippedFlip"

export interface DashboardCardProps extends React.PropsWithChildren {
  flippable?: boolean
  href?: string
  maximizable?: boolean
  size?: ResponsiveStyleValue<GridSize>
  title?: React.ReactNode
}

export const DashboardCard = ({
  children,
  flippable,
  href,
  maximizable,
  size,
  title,
}: DashboardCardProps) => {
  const navigate = useNavigate()

  const [flipped, setFlipped] = useState(false)
  const [maximized, setMaximized] = useState(false)

  const handleClick = getNavigateToHrefClickHandler(navigate, href)

  const handleFlip = () => {
    setFlipped(!flipped)
  }

  const handleMaximize = () => {
    setMaximized(!maximized)
  }

  const cardFrontChildren = flippable ? React.Children.toArray(children)[0] : children
  const cardBackChildren = flippable ? React.Children.toArray(children)[1] : undefined

  const cardFrontContent = (
    <MUICardContent sx={{ height: "100%" }}>
      <CardTitleBar>
        <CardTitle component="h2" title={getTextContentFromNode(title)} variant="subtitle1">{title}</CardTitle>
        {!!flippable && (
          <Button circular tooltipTitle="Flip To Grid" onClick={handleFlip}>
            <Flip />
          </Button>
        )}
        {!!maximizable && (
          <Button circular tooltipTitle={maximized ? "Restore" : "Maximize"} onClick={handleMaximize}>
            <OpenInFull />
          </Button>
        )}
      </CardTitleBar>
      <CardBody>
        {cardFrontChildren}
      </CardBody>
    </MUICardContent>
  )
  const cardBackContent = (
    <MUICardContent sx={{ height: "100%" }}>
      <CardTitleBar>
        <CardTitle component="h2" variant="subtitle1">{title}</CardTitle>
        {!!flippable && (
          <Button circular tooltipTitle="Flip To Visualization" onClick={handleFlip}>
            <FlippedFlip />
          </Button>
        )}
        {!!maximizable && (
          <Button circular tooltipTitle={maximized ? "Restore" : "Maximize"} onClick={handleMaximize}>
            <OpenInFull />
          </Button>
        )}
      </CardTitleBar>
      <CardBody>
        {cardBackChildren}
      </CardBody>
    </MUICardContent>
  )

  const classNames = [
    ...(flipped ? ["flipped"] : []),
    ...(maximized ? ["maximized"] : []),
  ]

  return (
    <Grid size={typeof size === "object" && !Array.isArray(size) ? { xs: 12, md: 6, ...size } : size}>
      <CardContainer className={classNames.join(" ")}>
        <CardFront variant="outlined">
          {href ? <MUICardActionArea href={href} onClick={handleClick}>{cardFrontContent}</MUICardActionArea> : cardFrontContent}
        </CardFront>
        {!!flippable && (
          <CardBack variant="outlined">
            {href ? <MUICardActionArea href={href} onClick={handleClick}>{cardBackContent}</MUICardActionArea> : cardBackContent}
          </CardBack>
        )}
      </CardContainer>
    </Grid>
  )
}

DashboardCard.displayName = "DashboardCard"
