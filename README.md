# ads-eng-react-components

React component library for various ads-eng products, consumed as
`@mozilla-services/ads-eng-react-components`. There's no registry — consumers install
directly from a public git tag, so no tokens or `.npmrc` setup are involved:

```sh
npm install github:mozilla-services/ads-eng-react-components#v0.3.0
```

Components here originate in
[`consvc-shepherd/ad-ops-dashboard`](https://github.com/mozilla-services/consvc-shepherd);
the ESLint, TypeScript and Jest setup is deliberately a copy of that repo's so components
can be relocated with as few edits as possible.

## Local development

```sh
npm install
npm run storybook      # http://localhost:6006
```

| Script | What it does |
| --- | --- |
| `npm run storybook` | Storybook dev server on port 6006 |
| `npm run build-storybook` | Static Storybook into `storybook-static/` |
| `npm run build` | Builds `dist/` (ESM + CJS + `.d.ts`) via Vite library mode |
| `npm run lint` | ESLint, then `check:types` |
| `npm run lint:fix` | ESLint `--fix`, then `check:types` |
| `npm run check:types` | `tsc --noEmit` over `src/` and `.storybook/` |
| `npm test` | Jest with coverage |
| `npm run test:watch` | Jest in watch mode |

Requires Node >= 24 and npm >= 11 (`engine-strict=true`).

> npm blocks install scripts by default here. If `npm install` warns about
> `@swc/core` or `esbuild`, run `npm approve-scripts --allow-scripts-pending` — both need
> their postinstall to fetch native binaries.

## Repo layout

```
.storybook/          Storybook config; preview.tsx mirrors the test provider stack
src/index.ts         The public API — nothing is exported to consumers unless it's listed here
src/components/      One directory per component: Foo.tsx, Foo.test.tsx, Foo.stories.tsx
src/hooks/           usePage, useTheme — the contexts the providers below fill
src/providers/       PageProvider, ThemeProvider
src/theme/           createAdsEngTheme() — the shared theme definition
src/types/           Global helper types and the MUI theme augmentation
src/utils/           Only what components here need — see "What stayed behind"
src/test/            Shared test helpers (render wrapper, storage mocks)
```

## What's here

`Alert`, `AppLoader`, `Badge`, `Button` (`Button`, `AsyncButton`, `RemoteButton`,
`ClipboardButton`, `DialogButton`, `PopoverButton`, `ToggleButton`, `ToggleButtonGroup`),
`Chip`/`ActionChip`, `DashboardCard`, `Dialog`, `InputField` (`TextField`, `DateField`,
`EmailField`, `NumberField`, `CheckboxField`, `SelectField`), `Layout` (`Box`, `Grid`,
`Stack`, `Table*`, `Typography`, …), `SplitLayout`, `TabLayout`/`Tab`, `Link`
(`BackLink`, `ExternalLink`, `ExternalLinkOrNone`), `List`/`ListItem`,
`DescriptionList`/`DescriptionListItem`, `Page`/`EmbeddedPage`, `Popover`, `Progress`,
`ToastContainer`, `Tooltip`; the `usePage`/`useTheme` hooks and `PageProvider`/`ThemeProvider`.

### What stayed behind, and why

These are deliberately still in ad-ops-dashboard — each one needs app-owned data the library
can't reach. Build them there on top of the primitives this package exports:

| Left behind | Depends on | Build it on |
| --- | --- | --- |
| `DialogDataFormButton`, `PopoverDataFormButton` | `DataForm` → `DataGrid` → ag-grid | `DialogButton` / `PopoverButton` + the app's `DataForm` |
| `RemoteTaskButton` | `apiRoutes.taskStatus` | `AsyncButton` + app-local polling |
| `RemoteSelectField` | `api/fetch` (cache + de-dupe layer) | `SelectField` + the app's `fetchData` |
| `SearchField` | `useSearch` / `SearchProvider` | `TextField` + the app's search state |
| `AppLayout`, `DrawerLayout` | app shell, routes, `SearchField` | — (app shell, not a library concern) |

Some supporting code was narrowed rather than copied wholesale:

- **`utils/urls.ts`** — dropped `getShepherdOrigin()` (reads `process.env.SENTRY_ENV`) and
  `formatUrlWithPathParams()` (needs `DataGrid/DataGridUtils.getNestedValue()`). Everything
  else came over, including `downloadBlob()`, `downloadUrl()` and `getUrlForEmailAddress()`
  — no component here uses them, but they're generic and app-side callers can now import
  them from the package.
- **`utils/storage.ts`** — rewritten as a generic, untyped-key primitive. The app's
  exhaustive `StorageValueTypeMap` (`columnState`, `fetchState`, `invalidateApiRoutes`,
  `notificationSettings`) would have pulled in `config/routes.config`, `useNotifications`
  and ag-grid. Keys and JSON shapes are unchanged, so a `themeSettings` value written by
  either implementation is readable by the other.
- **`SelectFieldParams`** is `{ options }` only. The app's version also carries `apiRoute`,
  `queryParams`, `keyField`, `labelField` and `suppressAppendingKeyFieldInFormData`, all of
  which exist solely for `RemoteSelectField` — so they stayed with it. `MultiSelectFieldParams`
  stayed too (it's only read by `DataGrid`), which is why there's no `APIRoute` or
  `Identifiable` type in this package: nothing here needs them. If you relocate
  `RemoteSelectField` or `DataGrid` later, bring those fields and types along then.

`ThemeProvider` did move, and it now builds its theme from `createAdsEngTheme()` instead of
inlining the palette — so Storybook, the Jest render wrapper and the real app all share one
theme definition.

## Stories

Every component module has a `.stories.tsx` beside it — 143 stories across 20 components,
with an autodocs page generated per component from its props and the JSDoc on its `meta`.

Conventions, if you're adding one:

- `title: "Components/<Name>"`, `tags: ["autodocs"]`, and `satisfies Meta<typeof Component>`.
- Put the *why* in a JSDoc block above `meta` — autodocs renders it as the component's
  description, so that's where non-obvious behavior belongs.
- Cover the states that are hard to reach by clicking around: pending, failure, empty,
  loading, overflow/ellipsis.
- Components opened imperatively through a ref (`Dialog`, `Popover`) have no visible surface
  on their own, so those stories render a local `Trigger` wrapper that owns the ref.

`.storybook/preview.tsx` wraps every story in the same provider stack as
`src/test/utils.tsx` — `HelmetProvider`, the MUI theme from `createAdsEngTheme()`, and a
`MemoryRouter` — plus a light/dark toggle in the toolbar. Keep the two in sync.

### Stories are tested

`build-storybook` bundles stories but never renders them, so a story that throws would only
surface when someone opened Storybook. `src/test/stories.test.tsx` renders all of them,
discovering story files from disk (no list to maintain) and applying the preview's decorators
via `setProjectAnnotations`. It also fails if a component module has no story file at all.

This is why `jest.config.mjs` allows `@storybook/*` through `transformIgnorePatterns` — those
packages ship ESM only.

A few things Storybook can't fully show, and why:

- **`RemoteButton`** issues a real request. Nothing serves an API behind Storybook, so its
  story lands in the failure state deliberately; `AsyncButton` covers the success path.
- **`EmbeddedPage`** frames a remote URL, which most sites refuse via `X-Frame-Options`.
- **`ToastContainer`** needs `react-toastify/dist/ReactToastify.css`, which this package does
  **not** bundle — that would force a stylesheet on every consumer and break
  `sideEffects: false`. The story imports it; your app must too (ad-ops-dashboard does, in
  `App.tsx`).

### `src/types/` is load-bearing

`src/types/global.ts` and `src/types/mui.ts` are `.ts` files (not `.d.ts`) whose types are
re-exported from `src/index.ts`. Both details matter:

- As `.ts` files they're compiled into `dist/`, so they ship.
- TypeScript **elides side-effect-only imports** from declaration output, so a plain
  `import "./types/mui"` in `index.ts` would vanish from `dist/index.d.ts` and consumers
  would silently lose `theme.palette.flags` and the `ExtendableComponent*` globals. The
  named re-export is what keeps them reachable.

If you add another module augmentation, follow the same pattern and give it at least one
named export.

## Relocating a component from ad-ops-dashboard

1. Copy the component directory into `src/components/`, along with its test.
2. Fix up relative imports. `modulePaths`/`moduleResolution` are configured the same way in
   both repos, so most paths carry over unchanged.
3. Resolve anything app-specific it drags in. The usual suspects:
   - **App-owned providers** (`GlobalEventTargetProvider`, `PreferencesProvider`,
     `SearchProvider`, `NotificationsProvider`) and **app-owned config**
     (`config/routes.config`, `api/fetch`). These are app state, not library concerns — take
     them as props, or a context the app supplies, rather than importing the app's copy. If
     that isn't practical, leave the component in the app and build it on a primitive from
     here — see the table above.
   - **`axios`** is a peer dependency on purpose: the app installs auth interceptors on the
     shared instance, so the library must not bundle its own.
4. **Check for module-scope browser access.** Anything at the top level of a file runs on
   *any* `import` of this package once it's re-exported from `src/index.ts`. A bare
   `window.matchMedia(...)`/`document...` at module scope is safe in a browser-only app but
   throws `window is not defined` here under Node, SSR prerender or a non-jsdom Jest
   environment. Resolve it lazily inside the component — `ThemeProvider` shows the pattern.
   To catch it: `node -e "require('./dist/index.cjs')"` after a build.
5. Add a `Foo.stories.tsx` next to it — see [Stories](#stories) for the conventions.
   `src/test/stories.test.tsx` fails if a component module has no story file.
6. Export it from `src/index.ts` — including its prop types. Prop interfaces that were
   file-private in the app need an `export` to be usable by consumers.
7. If it needs a provider at test time, add that provider to **both**
   `src/test/utils.tsx` and `.storybook/preview.tsx` so Storybook and Jest agree.
8. `npm run lint && npm test && npm run build`.

Components that use ag-grid or ag-charts additionally need module registration and the
license key wired into `jest.setup.ts` — there's a commented block at the bottom of that
file showing what to add — plus `ag-grid-enterprise`/`ag-grid-react` added back as peer
dependencies and to the `externalPackages` list in `vite.config.mts`.

If a component needs a browser API jsdom lacks, stub it in `jest.setup.ts` rather than
per-test. `ResizeObserver` and `IntersectionObserver` are already stubbed there (the former
because `react-resizable-panels` constructs one in a layout effect).

## Releasing

Consumers install straight from a **public git tag**, so the tag *is* the artifact — nothing
is published to a registry.

```sh
npm version minor          # or patch / major — creates the commit and the vX.Y.Z tag
git push --follow-tags
gh release create v0.3.0 --generate-notes
```

On release, [`.github/workflows/release.yml`](.github/workflows/release.yml) verifies the tag
matches `version` in `package.json`, runs lint and tests, then **installs the tag exactly as a
consumer would** and asserts the built entrypoints exist. That last check matters: a git
install builds the package from source via `prepare`, and if `prepare` is missing or broken
npm installs a package with an empty `dist/` and *no error* — consumers just get a module with
no exports.

CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs lint, tests, the package
build, the Storybook build, and `npm pack --dry-run` on every PR and push to `main`.

> The repo must stay **public**. A git install of a private repo needs SSH keys or a token in
> every consumer and CI job, which is the plumbing this model exists to avoid.

### `prepare`, not `prepublishOnly`

`dist/` is gitignored, so it doesn't exist in a tag. npm builds it at install time by running
the **`prepare`** script — the only lifecycle hook it runs for git dependencies.
`prepublishOnly` does *not* run for git installs, which is why it was replaced. Don't remove
`prepare` or rename it without changing the consumption model.

### Versioning

Peer dependency ranges are pinned to what ad-ops-dashboard currently uses (React 18, MUI 7).
Bumping a peer's major is a **major** version bump here, since consumers have to move in
lockstep.

Git dependencies don't resolve semver ranges: a consumer pins one tag and moves deliberately.
`npm install` records the tag's exact commit SHA in the lockfile, so `npm ci` stays
reproducible even if the tag is later moved.

## Consuming the package

### 1. Install

No registry, no `.npmrc`, no token:

```sh
npm install github:mozilla-services/ads-eng-react-components#v0.3.0
```

Bumping later means changing the tag in `package.json` and re-running `npm install`.

### 2. Use it

```tsx
import { Badge, createAdsEngTheme } from "@mozilla-services/ads-eng-react-components"
```

`theme.palette.env` and `theme.palette.flags` are typed automatically — delete the local
`src/mui.d.ts` and `src/global.d.ts` from the consumer once you're importing from here, or
the duplicate declarations will conflict.

The package ships ESM and CJS. The ESM entry assumes a **bundler** (Vite, webpack) because
`react-helmet-async` is CJS-only and exposes no named ESM exports that Node's loader can
detect — `import { ToastContainer } from "@mozilla-services/ads-eng-react-components"` in a
plain Node ESM script fails on that, while the same import through Vite is fine. Node
`require()` of the CJS entry works unconditionally, which is what the consumer's Jest uses.

### What a git install needs

Two things the registry didn't require:

- **A git client.** `npm install` shells out to `git` to clone the tag. Full `node:*` images
  have it; **`node:*-slim` and `alpine` do not** and will fail on install
  (ad-ops-dashboard's dev Dockerfile installs it explicitly).
- **Install scripts enabled.** `prepare` is what builds `dist/`. Under `ignore-scripts=true`
  the install silently yields a package with no `dist/`, so don't harden that flag on in a
  consumer without vendoring the build another way.

Installs are also slower than a registry fetch — npm clones the repo, installs the library's
devDependencies and runs a build (~15–20s) rather than unpacking a prebuilt tarball.

### If the consumer's Jest chokes on the import

ad-ops-dashboard's `transformIgnorePatterns` excludes all of `node_modules` from
transformation. This package ships CJS alongside ESM specifically so that keeps working. If
you do hit a parse error, allow-list the package:

```js
transformIgnorePatterns: [
  "[/\\\\]node_modules[/\\\\](?!@mozilla-services[/\\\\]ads-eng-react-components).+\\.(js|jsx|mjs|cjs|ts|tsx)$",
],
```
