import {
  Avatar as MUIAvatar, // eslint-disable-line no-restricted-imports
  List as MUIList, // eslint-disable-line no-restricted-imports
  ListItem as MUIListItem, // eslint-disable-line no-restricted-imports
  ListItemButton as MUIListItemButton, // eslint-disable-line no-restricted-imports
  ListItemIcon as MUIListItemIcon, // eslint-disable-line no-restricted-imports
  ListItemText as MUIListItemText, // eslint-disable-line no-restricted-imports
  ListProps as MUIListProps, // eslint-disable-line no-restricted-imports
} from "@mui/material"
import { styled } from "@mui/material/styles"
import React from "react"
import { filterChildrenByBaseComponent } from "../../utils/components"
import { getNavigateToHrefClickHandler } from "../../utils/urls"
import { useNavigate } from "react-router-dom"
import { Box, Divider } from "../Layout/Layout"
import { Badge } from "../Badge/Badge"
import { CircularProgress } from "../Progress/Progress"

export interface ListItemProps extends React.PropsWithChildren {
  accessory?: React.ReactNode
  ellipsizeChildren?: boolean
  ellipsizeTitle?: boolean
  href?: string
  icon?: React.ReactNode
  iconBadge?: React.ReactNode | boolean
  indent?: number
  selected?: boolean
  title?: React.ReactNode
  onClick?: React.MouseEventHandler
}

export const ListItem: ExtendableComponent<ListItemProps> = ({
  children,
  accessory,
  ellipsizeChildren = false,
  ellipsizeTitle = true,
  href,
  icon,
  iconBadge,
  indent,
  selected,
  title,
  onClick,
}: ListItemProps) => {
  const navigate = useNavigate()

  // Measured once on mount so the button can reserve room for the accessory and
  // ellipsize against it. Assumes a static accessory — a swapped-in accessory of
  // a different size reuses the same node and won't re-measure.
  const [accessoryWidth, setAccessoryWidth] = React.useState(0)

  const measureAccessory = React.useCallback((element: HTMLDivElement | null) => {
    setAccessoryWidth(element?.getBoundingClientRect().width ?? 0)
  }, [])

  const badgeContent = typeof iconBadge === "boolean" ? undefined : iconBadge
  const badgeVariant = typeof iconBadge === "boolean" ? "dot" : "standard"

  const isInteractive = href !== undefined || onClick !== undefined

  const handleClick = getNavigateToHrefClickHandler(navigate, href, onClick)

  return (
    <MUIListItem
      disableGutters
      disablePadding
      secondaryAction={accessory
        ? (
            <Box ref={measureAccessory} sx={{ display: "flex", alignItems: "center" }}>
              {accessory}
            </Box>
          )
        : undefined}
      sx={{
        "& .MuiListItemButton-root": {
          pl: indent !== undefined ? (indent + 1) * 2 : 1,
          pr: `calc(${accessoryWidth}px + var(--mui-spacing) * 2)`,
        },
        "& .MuiListItemSecondaryAction-root": {
          right: "var(--mui-spacing)",
        },
      }}
    >
      <MUIListItemButton
        component={href ? "a" : "div"}
        disableRipple={!isInteractive}
        href={href}
        selected={selected}
        sx={[
          !isInteractive ? { "pointerEvents": "none", "&:hover": { backgroundColor: "transparent" } } : {},
        ]}
        onClick={handleClick}
      >
        {icon && (
          <MUIListItemIcon>
            <Badge badgeContent={badgeContent} variant={badgeVariant} invisible={!iconBadge}>
              <MUIAvatar>
                {icon}
              </MUIAvatar>
            </Badge>
          </MUIListItemIcon>
        )}
        {/* TODO: Conditionally show tooltip when text is truncated */}
        <MUIListItemText
          primary={title}
          slotProps={{
            primary: { noWrap: ellipsizeTitle },
            secondary: { noWrap: ellipsizeChildren },
          }}
          secondary={children}
        />
      </MUIListItemButton>
    </MUIListItem>
  )
}

ListItem.displayName = "ListItem"
ListItem.baseType = Symbol.for(ListItem.displayName)

const StyledList = styled(MUIList)`
  flex-grow: 1;
  min-height: 0;
  overflow: auto;
  padding: 0;
`

StyledList.displayName = "StyledList"

const StyledListLoadingBox = styled(Box)`
  flex-grow: 1;
  min-height: 0;
  overflow: auto;
  padding: 0;
`

StyledListLoadingBox.displayName = "StyledListLoadingBox"

export interface ListProps extends React.PropsWithChildren, MUIListProps {
  children?: React.ReactNode
  emptyMessage?: React.ReactNode
  loading?: boolean
  suppressDividers?: boolean
}

export const List = (props: ListProps) => {
  const items = filterChildrenByBaseComponent(ListItem, props.children)

  const filteredProps: Partial<ListProps> = {
    ...props,
  }
  delete filteredProps.children
  delete filteredProps.emptyMessage
  delete filteredProps.loading
  delete filteredProps.suppressDividers

  if (props.loading) {
    return (
      <StyledListLoadingBox>
        <CircularProgress
          size="1.5rem"
          sx={{
            position: "absolute",
            top: "calc(50% - 0.75rem)",
            left: "calc(50% - 0.75rem)",
          }}
        />
      </StyledListLoadingBox>
    )
  }

  return (
    <StyledList {...filteredProps}>
      {props.emptyMessage && items.length === 0 && (
        <ListItem>{props.emptyMessage}</ListItem>
      )}
      {items.map((item, index) => (
        <React.Fragment key={item.key ?? index}>
          {!props.suppressDividers && index > 0 && <Divider />}
          {item}
        </React.Fragment>
      ))}
    </StyledList>
  )
}

List.displayName = "List"
