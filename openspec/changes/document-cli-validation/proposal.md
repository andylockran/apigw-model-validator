# Proposal

## Why

This change introduces formal specification documentation for the `apigw-model-validator` CLI. Currently, the CLI's validation contracts and rules (including OpenAPI model-based, path-based, and request-method-based validation) lack explicit executable/formal specifications, making future enhancements difficult to test and maintain safely.

## What Changes

- Create a new capabilities specification under `specs/cli-validation/spec.md`.
- Formally document the requirements for validation by OpenAPI component models (`--model`).
- Formally document the requirements for validation by API paths and request methods (`--path` and `--requestMethod`).
- Outline current behavior on error paths, missing files, and incorrect flag combinations.

## Capabilities

### New Capabilities
- `cli-validation`: Formally specifies the CLI's core validation contracts against OpenAPI 3.0 schemas, including model-based and path-based routing.

### Modified Capabilities
*(None)*

## Impact

No code or API changes will be made. The impact is limited to adding formal specifications under `openspec/` to guide future improvements and preserve correctness.
