import React from "react"

export function filterChildrenByBaseComponent<P>(
  BaseComponent: ExtendableComponent<P> | ExtendableComponentWithForwardedRef<P>,
  children: React.ReactNode | undefined,
): React.ReactElement<P, string | React.JSXElementConstructor<any>>[] { // eslint-disable-line @typescript-eslint/no-explicit-any
  return React.Children.toArray(children).filter(child => (
    React.isValidElement(child) && (child.type as ExtendableComponent | ExtendableComponentWithForwardedRef)?.baseType === BaseComponent.baseType
  )) as React.ReactElement<P>[]
}

export function getTextContentFromNode(node: React.ReactNode | undefined, delimiter: string = ""): string {
  return React.Children.toArray(node).filter(child => React.isValidElement(child) || typeof child === "string" || typeof child === "number")
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return `${child}`
      }
      return getTextContentFromNode(child.props?.children, delimiter)
    })
    .join(delimiter)
}
