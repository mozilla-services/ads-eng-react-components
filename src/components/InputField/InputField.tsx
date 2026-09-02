import {
  Autocomplete as MUIAutocomplete, // eslint-disable-line no-restricted-imports
  Checkbox as MUICheckbox, // eslint-disable-line no-restricted-imports
  CheckboxProps as MUICheckboxProps, // eslint-disable-line no-restricted-imports
  FormControl as MUIFormControl, // eslint-disable-line no-restricted-imports
  FormHelperText as MUIFormHelperText, // eslint-disable-line no-restricted-imports
  InputLabel as MUIInputLabel, // eslint-disable-line no-restricted-imports
  SelectChangeEvent as MUISelectChangeEvent, // eslint-disable-line no-restricted-imports
  TextField as MUITextField, // eslint-disable-line no-restricted-imports
  TextFieldProps as MUITextFieldProps, // eslint-disable-line no-restricted-imports
} from "@mui/material"
import { useId } from "react"

export type TextFieldProps = MUITextFieldProps

export const TextField: ExtendableComponent<TextFieldProps> = (props: TextFieldProps) => (
  <MUITextField
    slotProps={{ inputLabel: { shrink: true } }}
    type="text"
    variant="outlined"
    {...props}
  />
)

TextField.displayName = "TextField"
TextField.baseType = Symbol.for(TextField.displayName)

export type DateFieldProps = TextFieldProps

export const DateField: ExtendableComponent<DateFieldProps> = (props: DateFieldProps) => (
  <TextField type="date" {...props} />
)

DateField.displayName = "DateField"
DateField.baseType = TextField.baseType

export type EmailFieldProps = TextFieldProps

export const EmailField: ExtendableComponent<EmailFieldProps> = (props: EmailFieldProps) => (
  <TextField type="email" {...props} />
)

EmailField.displayName = "EmailField"
EmailField.baseType = TextField.baseType

export type NumberFieldProps = TextFieldProps

export const NumberField: ExtendableComponent<NumberFieldProps> = (props: NumberFieldProps) => (
  <TextField type="number" {...props} />
)

NumberField.displayName = "NumberField"
NumberField.baseType = TextField.baseType

export interface CheckboxFieldProps extends MUICheckboxProps {
  error?: boolean
  helperText?: React.ReactNode
  label?: React.ReactNode
}

export const CheckboxField: ExtendableComponent<CheckboxFieldProps> = (props: CheckboxFieldProps) => {
  const id = useId()
  return (
    <MUIFormControl sx={{ alignItems: "center", flexDirection: "row" }}>
      <MUIInputLabel htmlFor={id} shrink>
        {props.label}
      </MUIInputLabel>
      <MUICheckbox id={id} sx={{ alignSelf: "flex-start", marginTop: 1 }} checked={!!props.value} {...props} />
      <MUIFormHelperText error={props.error} sx={{ ml: 1, mt: 1 }}>{props.helperText}</MUIFormHelperText>
    </MUIFormControl>
  )
}

CheckboxField.displayName = "CheckboxField"
CheckboxField.baseType = Symbol.for(CheckboxField.displayName)

export type SelectFieldChangeEvent = MUISelectChangeEvent

export interface SelectFieldProps {
  disabled?: boolean
  fullWidth?: boolean
  label?: React.ReactNode
  name?: string
  selectParams?: SelectFieldParams
  value?: string | number
  error?: boolean
  helperText?: React.ReactNode
  required?: boolean
  size?: "small" | "medium"
  onChange?: (event: SelectFieldChangeEvent) => void
}

export interface SelectFieldParams {
  options?: SelectFieldOption[]
}

export interface SelectFieldOption {
  label: string
  value: string | number
}

export const SelectField: ExtendableComponent<SelectFieldProps> = (props: SelectFieldProps) => {
  const key = useId()
  const value = props.selectParams?.options?.find(option => option.value === props.value) ?? null

  const onChange = (event: React.SyntheticEvent, option: SelectFieldOption | null) => {
    props.onChange?.({
      target: { name: props.name ?? "", value: option?.value ?? "" } as unknown as EventTarget,
    } as SelectFieldChangeEvent)
  }

  const { disabled, error, fullWidth, helperText, label, name, required, selectParams, size } = props

  return (
    <MUIFormControl key={key} disabled={disabled} error={error} fullWidth={fullWidth} required={required}>
      <MUIAutocomplete
        disabled={disabled}
        getOptionKey={option => option.value}
        getOptionLabel={option => option.label}
        onChange={onChange}
        options={selectParams?.options ?? []}
        size={size}
        value={value}
        renderInput={params => (
          <TextField
            {...params}
            disabled={disabled}
            label={label}
            name={name}
            error={error}
            helperText={helperText}
            required={required}
          />
        )}
      />
    </MUIFormControl>
  )
}

SelectField.displayName = "SelectField"
SelectField.baseType = Symbol.for(SelectField.displayName)
