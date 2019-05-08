![GitHub release](https://img.shields.io/github/release/decsys/decsys.svg?label=stable)
![GitHub release](https://img.shields.io/github/release-pre/decsys/decsys.svg?label=latest)
[![Build Status](https://dev.azure.com/UniversityOfNottingham/DECSYS/_apis/build/status/decsys.decsys?branchName=master)](https://dev.azure.com/UniversityOfNottingham/DECSYS/_build/latest?definitionId=155&branchName=master)

# DECSYS Survey Platform

The DECSYS Survey Platform aims to be a flexible cross-platform web-based survey platform that particularly makes it easy to load custom question response components.

It is used to showcase the DECSYS Ellipse Rating Scale.

# Getting Started

## Running the Survey Platform

- For Windows 7+ (64-bit)
  1. Download a `win-x64` asset from **Releases**
  1. Extract it to a folder
  1. Double-click `Run Decsys`
  1. Open a web browser and navigate to `localhost`
- For other OSes
  1. Have the .NET Core runtime for your OS. (version `2.2` or newer)
  1. Download a `dotnet-2.2` asset from **Releases**
  1. Extract it to a folder
  1. Run the application as follows:
     - Use the provided `run-decsys` or `Run Decsys (Windows)` script
     - Use the `dotnet` CLI
       - Navigate inside the `Decsys/` folder
       - run `dotnet decsys.dll`
       - Optionally pass server urls argument to specify a port, otherwise `5000` will be used.
         - e.g. `dotnet decsys.dll --server.urls http://0.0.0.0:80`
  1. Open a web browser and navigate to `localhost`

### Troubleshooting

- Mostly just ensure nothing else is bound to port `80` on your network interfaces.
  - Or edit the launch script to change the port / specify a port when using the `dotnet` CLI

## Building the Survey Platform

1. Meet the prerequisites:
   - `dotnet` SDK `2.2` or newer
     - either independently or part of Visual Studio 2017 or newer
   - node.js `10.x` or newer (including `npm`)
   - Optionally get some [Response Components](https://github.com/search?q=org%3Adecsys+component+in%3Aname+archived%3Afalse) and put them in `Decsys/components/`
1. Clone this repository
1. Inside `Decsys/ClientApp/`
   - run `npm i`
1. Inside `Decsys/`
   - Open `Decsys.sln` in Visual Studio
   - `dotnet build`

# Licensing

At this time, this software has no license, and therefore all rights are reserved as per author copyright, with the exception of rights waived under the GitHub Terms of Service.

Please don't modify, distribute or use this software until a license is in place.
