import "@testing-library/jest-dom"
import { render } from "../../test/utils"

import {
  CheckboxField,
  SelectField,
  TextField,
} from "./InputField"

describe("InputField.tsx", () => {
  test("<SelectField /> renders an input field", () => {
    const options = [
      { value: "bar", label: "Bar" },
      { value: "baz", label: "Baz" },
    ]
    const result = render(
      <SelectField name="foo" selectParams={{ options }} />,
    )

    const field = result.baseElement.querySelector<HTMLInputElement>("input[type=\"text\"][name=\"foo\"]")
    expect(field).toBeInstanceOf(HTMLInputElement)
  })

  test("<SelectField /> shows the option matching `value`", () => {
    const options = [
      { value: "bar", label: "Bar" },
      { value: "baz", label: "Baz" },
    ]
    const result = render(
      <SelectField name="foo" selectParams={{ options }} value="baz" />,
    )

    const field = result.baseElement.querySelector<HTMLInputElement>("input[type=\"text\"][name=\"foo\"]")
    expect(field?.value).toEqual("Baz")
  })

  test("<TextField /> renders an input field", () => {
    const result = render(
      <TextField name="foo" />,
    )

    const field = result.baseElement.querySelector<HTMLInputElement>("input[type=\"text\"][name=\"foo\"]")
    expect(field).toBeInstanceOf(HTMLInputElement)
  })

  test("<TextField /> renders an input field with a value", () => {
    const result = render(
      <TextField name="foo" value="bar" />,
    )

    const field = result.baseElement.querySelector<HTMLInputElement>("input[type=\"text\"][name=\"foo\"]")
    expect(field?.value).toEqual("bar")
  })

  test("<CheckboxField /> reflects its `value` as the checked state", () => {
    const result = render(
      <CheckboxField label="Foo" value={true} />,
    )

    const field = result.baseElement.querySelector<HTMLInputElement>("input[type=\"checkbox\"]")
    expect(field?.checked).toBe(true)
  })
})
