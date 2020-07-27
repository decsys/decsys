# ✅ DECSYS Ellipse Scale Component

This is a component that allows a Survey Participant to provide a ranged answer on an Ellipse Scale.

# 🎉 Installation

- Acquire a distributable version:
  - Download a distributable version from Github Releases
  - Build from source (see below)
- Copy the `.js` file in into the Survey Platform's `components/` folder

# 🏗 Building

## Pre-requisites

- Node `10.x` or newer
  - comes with an appropriate version of npm

## Build steps

In the **root** of the repo:

- `npm i`
- `npm run discrete-scale:build`

The build outputs to the local `./dist` directory.

### Troubleshooting

At this time, it may be necessary to ensure `packages/rating-scales` is built locally before trying to build / storybook this project.
