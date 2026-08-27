import React from "react"
import { Group, Panel, Separator } from "react-resizable-panels"
import { Property } from "csstype"

export interface SplitLayoutProps extends React.PropsWithChildren {
  disableResizing?: boolean
  mainDefaultSize?: number | string
  mainMinSize?: number | string
  mainMaxSize?: number | string
  minHeight?: Property.MinHeight
  navDefaultSize?: number | string
  navMinSize?: number | string
  navMaxSize?: number | string
  rightSideNav?: boolean
}

export const SplitLayout = ({
  children,
  disableResizing = false,
  mainDefaultSize,
  mainMaxSize,
  mainMinSize,
  minHeight,
  navDefaultSize = 320,
  navMinSize = 320,
  navMaxSize,
  rightSideNav = false,
}: SplitLayoutProps) => {
  const navContent = React.Children.toArray(children)[rightSideNav ? 1 : 0]
  const mainContent = React.Children.toArray(children)[rightSideNav ? 0 : 1]

  const navPanelGroupResizeBehavior = !navDefaultSize || (typeof navDefaultSize === "string" && !navDefaultSize.endsWith("px"))
    ? "preserve-relative-size"
    : "preserve-pixel-size"
  const mainPanelGroupResizeBehavior = !mainDefaultSize || (typeof mainDefaultSize === "string" && !mainDefaultSize.endsWith("px"))
    ? "preserve-relative-size"
    : "preserve-pixel-size"

  const navPanel = (
    <Panel
      defaultSize={navDefaultSize}
      groupResizeBehavior={navPanelGroupResizeBehavior}
      maxSize={navMaxSize}
      minSize={navMinSize}
    >
      {navContent}
    </Panel>
  )

  const mainPanel = (
    <Panel
      defaultSize={mainDefaultSize}
      groupResizeBehavior={mainPanelGroupResizeBehavior}
      maxSize={mainMaxSize}
      minSize={mainMinSize}
    >
      {mainContent}
    </Panel>
  )

  return (
    <Group disabled={disableResizing} style={{ minHeight }}>
      {rightSideNav && (
        <>
          {mainPanel}
          <Separator style={{ width: "var(--mui-spacing)" }} />
          {navPanel}
        </>
      )}
      {!rightSideNav && (
        <>
          {navPanel}
          <Separator style={{ width: "var(--mui-spacing)" }} />
          {mainPanel}
        </>
      )}
    </Group>
  )
}

SplitLayout.displayName = "SplitLayout"
