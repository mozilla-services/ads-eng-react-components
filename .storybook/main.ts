import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  // Add "../src/**/*.mdx" here once there's a hand-written docs page; Storybook warns on
  // boot about glob patterns that match nothing.
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
  ],
  typescript: {
    // Prop tables are generated from the TS types, so `argTypes` only needs to cover
    // controls that can't be inferred (unions widened to `string`, callbacks, etc.).
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      // MUI prop types come from node_modules; without this every wrapper component's
      // table is empty because the inherited props are filtered out.
      propFilter: prop => !/node_modules\/(?!@mui)/.test(prop.parent?.fileName ?? ""),
    },
  },
}

export default config
