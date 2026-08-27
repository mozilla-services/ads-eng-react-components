import {
  Backdrop as MUIBackdrop, // eslint-disable-line no-restricted-imports
  BackdropProps as MUIBackdropProps, // eslint-disable-line no-restricted-imports
  Box as MUIBox, // eslint-disable-line no-restricted-imports
  BoxProps as MUIBoxProps, // eslint-disable-line no-restricted-imports
  Breakpoint as MUIBreakpoint, // eslint-disable-line no-restricted-imports
  CssBaseline as MUICssBaseline, // eslint-disable-line no-restricted-imports
  CssBaselineProps as MUICssBaselineProps, // eslint-disable-line no-restricted-imports
  Divider as MUIDivider, // eslint-disable-line no-restricted-imports
  DividerProps as MUIDividerProps, // eslint-disable-line no-restricted-imports
  Grid as MUIGrid, // eslint-disable-line no-restricted-imports
  GridProps as MUIGridProps, // eslint-disable-line no-restricted-imports
  GridSize as MUIGridSize, // eslint-disable-line no-restricted-imports
  Paper as MUIPaper, // eslint-disable-line no-restricted-imports
  PaperProps as MUIPaperProps, // eslint-disable-line no-restricted-imports
  Stack as MUIStack, // eslint-disable-line no-restricted-imports
  StackProps as MUIStackProps, // eslint-disable-line no-restricted-imports
  Table as MUITable, // eslint-disable-line no-restricted-imports
  TableProps as MUITableProps, // eslint-disable-line no-restricted-imports
  TableBody as MUITableBody, // eslint-disable-line no-restricted-imports
  TableBodyProps as MUITableBodyProps, // eslint-disable-line no-restricted-imports
  TableCell as MUITableCell, // eslint-disable-line no-restricted-imports
  TableCellProps as MUITableCellProps, // eslint-disable-line no-restricted-imports
  TableHead as MUITableHead, // eslint-disable-line no-restricted-imports
  TableHeadProps as MUITableHeadProps, // eslint-disable-line no-restricted-imports
  TableRow as MUITableRow, // eslint-disable-line no-restricted-imports
  TableRowProps as MUITableRowProps, // eslint-disable-line no-restricted-imports
  Toolbar as MUIToolbar, // eslint-disable-line no-restricted-imports
  ToolbarProps as MUIToolbarProps, // eslint-disable-line no-restricted-imports
  Typography as MUITypography, // eslint-disable-line no-restricted-imports
  TypographyProps as MUITypographyProps, // eslint-disable-line no-restricted-imports
} from "@mui/material"
import { styled } from "@mui/material/styles"

export type Breakpoint = MUIBreakpoint
export type GridSize = MUIGridSize

export type ResponsiveStyleValue<T> = T | Array<T | null> | { [key in Breakpoint]?: T | null }

export type BackdropProps = MUIBackdropProps

export const Backdrop: ExtendableComponent<BackdropProps> = (props: BackdropProps) => {
  return (
    <MUIBackdrop sx={theme => ({ color: "#fff", zIndex: theme.zIndex.drawer })} {...props} />
  )
}

Backdrop.displayName = "Backdrop"
Backdrop.baseType = Symbol.for(Backdrop.displayName)

export type BoxProps = MUIBoxProps

export const Box: ExtendableComponent<BoxProps> = styled(MUIBox)``

Box.displayName = "Box"
Box.baseType = Symbol.for(Box.displayName)

export type SpacerBoxProps = BoxProps

export const SpacerBox: ExtendableComponent<SpacerBoxProps> = (props: SpacerBoxProps) => {
  return (
    <Box sx={{ flexGrow: 1, minWidth: "var(--mui-spacing)", minHeight: "var(--mui-spacing)" }} {...props} />
  )
}

SpacerBox.displayName = "SpacerBox"
SpacerBox.baseType = Box.baseType

export type CssBaselineProps = MUICssBaselineProps

export const CssBaseline: ExtendableComponent<CssBaselineProps> = styled(MUICssBaseline)``

CssBaseline.displayName = "CssBaseline"
CssBaseline.baseType = Symbol.for(CssBaseline.displayName)

export type DividerProps = MUIDividerProps

export const Divider: ExtendableComponent<DividerProps> = styled(MUIDivider)``

Divider.displayName = "Divider"
Divider.baseType = Symbol.for(Divider.displayName)

export type GridProps = MUIGridProps

export const Grid: ExtendableComponent<GridProps> = styled(MUIGrid)``

Grid.displayName = "Grid"
Grid.baseType = Symbol.for(Grid.displayName)

export interface HeaderProps {
  accessory?: React.ReactNode
  title?: React.ReactNode
}

export const Header: ExtendableComponent<HeaderProps> = ({
  accessory,
  title,
}: HeaderProps) => {
  return (
    <Stack direction="row" alignItems="center">
      <Typography variant="h6" component="h2">
        {title}
      </Typography>
      {accessory && (
        <>
          <SpacerBox />
          {accessory}
        </>
      )}
    </Stack>
  )
}

Header.displayName = "Header"
Header.baseType = Symbol.for(Header.displayName)

export type PaperProps = MUIPaperProps

export const Paper: ExtendableComponent<PaperProps> = styled(MUIPaper)``

Paper.displayName = "Paper"
Paper.baseType = Symbol.for(Paper.displayName)

export type StackProps = MUIStackProps

export const Stack: ExtendableComponent<StackProps> = styled(MUIStack)``

Stack.displayName = "Stack"
Stack.baseType = Symbol.for(Stack.displayName)

export type TableProps = MUITableProps

export const Table: ExtendableComponent<TableProps> = styled(MUITable)``

Table.displayName = "Table"
Table.baseType = Symbol.for(Table.displayName)

export type TableBodyProps = MUITableBodyProps

export const TableBody: ExtendableComponent<TableBodyProps> = styled(MUITableBody)``

TableBody.displayName = "TableBody"
TableBody.baseType = Symbol.for(TableBody.displayName)

export type TableCellProps = MUITableCellProps

export const TableCell: ExtendableComponent<TableCellProps> = styled(MUITableCell)``

TableCell.displayName = "TableCell"
TableCell.baseType = Symbol.for(TableCell.displayName)

export type TableHeadProps = MUITableHeadProps

export const TableHead: ExtendableComponent<TableHeadProps> = styled(MUITableHead)``

TableHead.displayName = "TableHead"
TableHead.baseType = Symbol.for(TableHead.displayName)

export type TableRowProps = MUITableRowProps

export const TableRow: ExtendableComponent<TableRowProps> = styled(MUITableRow)``

TableRow.displayName = "TableRow"
TableRow.baseType = Symbol.for(TableRow.displayName)

export type ToolbarProps = MUIToolbarProps

export const Toolbar: ExtendableComponent<ToolbarProps> = styled(MUIToolbar)``

Toolbar.displayName = "Toolbar"
Toolbar.baseType = Symbol.for(Toolbar.displayName)

export type TypographyProps = MUITypographyProps

export const Typography: ExtendableComponent<TypographyProps> = styled(MUITypography)``

Typography.displayName = "Typography"
Typography.baseType = Symbol.for(Typography.displayName)
