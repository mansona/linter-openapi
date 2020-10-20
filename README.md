# linter-openapi

This linter plugin for [Linter](https://github.com/AtomLinter/Linter) provides
an interface to [openapi-enforcer](https://byu-oit.github.io/openapi-enforcer/). It will be used with files that
have the "JavaScript" syntax.

## Installation

Install `linter-swagger` either in Atom's Preferences/Install Packages, or with
`apm` on the command-line:

```sh
apm install linter-swagger
```

## Usage

This package will automatically lint YAML and JSON files that have an `openapi` field
with a version number value, in accordance to the [OpenAPI spec](https://github.com/OAI/OpenAPI-Specification).