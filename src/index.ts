// Public API of @mozilla-services/ads-eng-react-components.
//
// Everything a consuming app can import lives here. When you relocate a component from
// ad-ops-dashboard, add its export below — anything not re-exported here is not part of
// the package, even if it ships in `src/`.

// Type-only. Re-exporting these is also what keeps the `ExtendableComponent*` globals and
// the MUI theme augmentation (`palette.env`, `palette.flags`) loaded in consumers — see the
// comments in `src/types/`.
export type { ExtendableComponent, ExtendableComponentWithForwardedRef } from "./types/global"
export type { EnvPalette, FlagsPalette } from "./types/mui"

// ---------------------------------------------------------------------------- components

export { Alert } from "./components/Alert/Alert"
export type { AlertProps } from "./components/Alert/Alert"

export { AppLoader } from "./components/AppLoader/AppLoader"

export { Badge } from "./components/Badge/Badge"
export type { BadgeProps } from "./components/Badge/Badge"

export {
  AsyncButton,
  Button,
  ClipboardButton,
  DialogButton,
  PopoverButton,
  RemoteButton,
} from "./components/Button/Button"
export type {
  AsyncButtonProps,
  ButtonProps,
  ClipboardButtonProps,
  DialogButtonHandle,
  DialogButtonProps,
  PopoverButtonHandle,
  PopoverButtonProps,
  RemoteButtonProps,
} from "./components/Button/Button"

export { ToggleButton, ToggleButtonGroup } from "./components/Button/ToggleButton"
export type { ToggleButtonGroupProps, ToggleButtonProps } from "./components/Button/ToggleButton"

export { ActionChip, Chip } from "./components/Chip/Chip"
export type { ActionChipProps, ChipProps } from "./components/Chip/Chip"

export { DashboardCard } from "./components/DashboardCard/DashboardCard"
export type { DashboardCardProps } from "./components/DashboardCard/DashboardCard"

export { Dialog } from "./components/Dialog/Dialog"
export type { DialogAction, DialogHandle, DialogProps } from "./components/Dialog/Dialog"

export {
  CheckboxField,
  DateField,
  EmailField,
  NumberField,
  SelectField,
  TextField,
} from "./components/InputField/InputField"
export type {
  CheckboxFieldProps,
  DateFieldProps,
  EmailFieldProps,
  NumberFieldProps,
  SelectFieldChangeEvent,
  SelectFieldOption,
  SelectFieldParams,
  SelectFieldProps,
  TextFieldProps,
} from "./components/InputField/InputField"

export {
  Backdrop,
  Box,
  CssBaseline,
  Divider,
  Grid,
  Header,
  Paper,
  SpacerBox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "./components/Layout/Layout"
export type {
  BackdropProps,
  BoxProps,
  Breakpoint,
  CssBaselineProps,
  DividerProps,
  GridProps,
  GridSize,
  HeaderProps,
  PaperProps,
  ResponsiveStyleValue,
  SpacerBoxProps,
  StackProps,
  TableBodyProps,
  TableCellProps,
  TableHeadProps,
  TableProps,
  TableRowProps,
  ToolbarProps,
  TypographyProps,
} from "./components/Layout/Layout"

export { SplitLayout } from "./components/Layout/SplitLayout"
export type { SplitLayoutProps } from "./components/Layout/SplitLayout"

export { Tab, TabLayout } from "./components/Layout/TabLayout"
export type { TabLayoutProps, TabProps } from "./components/Layout/TabLayout"

export { BackLink, ExternalLink, ExternalLinkOrNone } from "./components/Link/Link"
export type { BackLinkProps, ExternalLinkOrNoneProps, ExternalLinkProps } from "./components/Link/Link"

export { List, ListItem } from "./components/List/List"
export type { ListItemProps, ListProps } from "./components/List/List"

export { DescriptionList, DescriptionListItem } from "./components/List/DescriptionList"
export type { DescriptionListItemProps, DescriptionListProps } from "./components/List/DescriptionList"

export { EmbeddedPage, Page } from "./components/Page/Page"
export type { EmbeddedPageProps, PageProps } from "./components/Page/Page"

export { Popover } from "./components/Popover/Popover"
export type { PopoverHandle, PopoverProps } from "./components/Popover/Popover"

export { CircularProgress, LinearProgress } from "./components/Progress/Progress"
export type { CircularProgressProps, LinearProgressProps } from "./components/Progress/Progress"

export { ToastContainer } from "./components/Toast/ToastContainer"
export type { ToastContainerProps } from "./components/Toast/ToastContainer"

export { Tooltip } from "./components/Tooltip/Tooltip"
export type { TooltipProps } from "./components/Tooltip/Tooltip"

// ------------------------------------------------------------------- hooks and providers

export { PageContext, usePage } from "./hooks/usePage"
export type { PageState } from "./hooks/usePage"

export { ThemeContext, isThemeSettings, useTheme } from "./hooks/useTheme"
export type { ThemeSettings, ThemeSettingsMode, ThemeState } from "./hooks/useTheme"

export { PageProvider } from "./providers/PageProvider"
export type { PageProviderProps } from "./providers/PageProvider"

export { ThemeProvider } from "./providers/ThemeProvider"
export type { ThemeProviderProps } from "./providers/ThemeProvider"

// ----------------------------------------------------------------------- theme and utils

export { createAdsEngTheme, defaultPaletteOptions } from "./theme/theme"
export type { ThemeMode } from "./theme/theme"

export { sleep } from "./utils/async"
export { filterChildrenByBaseComponent, getTextContentFromNode } from "./utils/components"
export {
  getStorageItem,
  isStorageObject,
  parseStorageValue,
  removeStorageItem,
  setStorageItem,
} from "./utils/storage"
export type { StorageValidator } from "./utils/storage"
export { NON_BREAKING_SPACE, parseMultiValueInputString, splitStringByLastDelimiter } from "./utils/strings"
export {
  downloadBlob,
  downloadUrl,
  getCurrentBase,
  getCurrentOrigin,
  getCurrentPathname,
  getCurrentPathnameWithHash,
  getFormattedSearchParamsString,
  getHistoryStateHashParam,
  getHistoryStateHashParams,
  getHistoryStateParams,
  getHistoryStateQueryParam,
  getHistoryStateQueryParams,
  getNavigateToHrefClickHandler,
  getObjectFromSearchParams,
  getParamsFromUrl,
  getSearchParamsFromObject,
  getUrlForEmailAddress,
  getUrlFromBaseWithParams,
  mergeSearchParams,
  navigateToHref,
  removeSearchParams,
  replaceHistoryState,
  replaceHistoryStateHashParams,
  replaceHistoryStateQueryParams,
  setHistoryStateHashParam,
  setHistoryStateQueryParam,
} from "./utils/urls"
export type { URLBase, URLOrigin, URLParams, URLPathname, URLProtocol } from "./utils/urls"
