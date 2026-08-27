import {
  TabContext as MUITabContext, // eslint-disable-line no-restricted-imports
  TabList as MUITabList, // eslint-disable-line no-restricted-imports
  TabPanel as MUITabPanel, // eslint-disable-line no-restricted-imports
  useTabContext,
} from "@mui/lab"
import {
  Tab as MUITab, // eslint-disable-line no-restricted-imports
} from "@mui/material"
import { styled } from "@mui/material/styles"
import React, { useEffect, useState } from "react"
import { filterChildrenByBaseComponent } from "../../utils/components"
import { Divider } from "./Layout"
import { getHistoryStateHashParam, getHistoryStateHashParams, getNavigateToHrefClickHandler, mergeSearchParams, setHistoryStateHashParam } from "../../utils/urls"
import { useNavigate } from "react-router-dom"

const StyledTabPanel = styled(MUITabPanel)`
  flex-grow: 1;
  padding: 0.5rem 0 0;
`

export interface TabProps extends React.PropsWithChildren {
  keepMounted?: boolean
  title: string
  value: string
}

export const Tab: ExtendableComponent<TabProps> = ({
  children,
  keepMounted,
  title,
  value,
}: TabProps) => {
  const [hasBeenSelectedOnce, setHasBeenSelectedOnce] = useState<boolean>(false)
  const selectedTabValue = useTabContext()?.value

  useEffect(() => {
    if (!hasBeenSelectedOnce && value === selectedTabValue) {
      setHasBeenSelectedOnce(true)
    }
  }, [hasBeenSelectedOnce, selectedTabValue, value])

  return (
    <StyledTabPanel key={value} keepMounted={keepMounted} title={title} value={value}>
      {hasBeenSelectedOnce && children}
    </StyledTabPanel>
  )
}

Tab.displayName = "Tab"
Tab.baseType = Symbol.for(Tab.displayName)

export interface TabLayoutProps {
  children?: React.ReactNode
}

export const TabLayout = ({
  children,
}: TabLayoutProps) => {
  const tabs = filterChildrenByBaseComponent(Tab, children)

  const navigate = useNavigate()

  useEffect(() => {
    if (!getHistoryStateHashParam("tab")) {
      setHistoryStateHashParam("tab", tabs[0]?.props.value)
    }
  }, [tabs])

  const [currentTab, setCurrentTab] = useState<string>(getHistoryStateHashParam("tab") ?? tabs[0]?.props.value)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue)
  }

  return (
    <MUITabContext value={currentTab}>
      <MUITabList onChange={handleTabChange}>
        {tabs.map((tab) => {
          const href = `#${mergeSearchParams(getHistoryStateHashParams(), { tab: tab.props.value })}`
          const handleClick = getNavigateToHrefClickHandler(navigate, href)

          return (
            <MUITab
              key={tab.props.value}
              label={tab.props.title}
              value={tab.props.value}
              onClick={handleClick}
              href={href}
            />
          )
        })}
      </MUITabList>
      <Divider />
      {tabs}
    </MUITabContext>
  )
}

TabLayout.displayName = "TabLayout"
