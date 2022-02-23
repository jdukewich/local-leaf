# Local Leaf
Welcome to Local Leaf! This project aims to create a local version of the popular online LaTeX editor [Overleaf](https://www.overleaf.com/). 

Sometimes, it's just better to not have everything connected to the Internet, and this will allow you to work with the editor you know and love without requiring an Internet connection.

To use Local Leaf, you will need to download or install the Local Leaf app itself, but you will also need a LaTeX distribution on your machine. Local Leaf uses `latexmk` to compile PDFs, so you should be able to follow instructions [here](https://mg.readthedocs.io/latexmk.html) to get setup with that.

## Installation
### TeX Distribution
You can use other TeX distributions, but this installation guide will use MiKTeX.

Download [MiKTeX](https://miktex.org/download) for your operating system.

### Latexmk
Install Latexmk following the docs [here](https://mg.readthedocs.io/latexmk.html#installation).

If you need to install Perl, check it out [here](https://www.perl.org/get.html).

### Local Leaf
Download the corresponding installer/executable for your system.
- Linux: [local-leaf_0.1.0_amd64.AppImage](https://github.com/jdukewich/local-leaf/releases/download/app-v0.1.0/local-leaf_0.1.0_amd64.AppImage)
- Mac: [Local.Leaf_0.1.0_x64.dmg](https://github.com/jdukewich/local-leaf/releases/download/app-v0.1.0/Local.Leaf_0.1.0_x64.dmg)
- Windows: [Local.Leaf_0.1.0_x64_en-US.msi](https://github.com/jdukewich/local-leaf/releases/download/app-v0.1.0/Local.Leaf_0.1.0_x64_en-US.msi)

## Application Architecture

### Tauri
This was built using [Tauri](https://tauri.studio/) which allows you to build desktop applications with a web frontend. To me, Tauri is like Electron, but without Chromium :).

### React
React was used as the web frontend for this app. Some of vital libraries used in the frontend development are
* [react-pdf](https://www.npmjs.com/package/react-pdf)
* [react-resizable](https://www.npmjs.com/package/react-resizable)
* [react-ace](https://www.npmjs.com/package/react-ace)

## Contributing
Any contributions are welcome! If you think you can improve something, please submit a detailed pull request. A project roadmap will be created soon to track things that need to be added or fixed.

### Dev Setup

1. Follow the setup for Tauri [here](https://tauri.studio/docs/getting-started/prerequisites). This project uses yarn as an alternative to npm.

2. Clone the repo

`https://github.com/jdukewich/local-leaf.git && cd local-leaf`

3. Install dependencies

`yarn`

4. Run Tauri development mode

`yarn tauri dev`


