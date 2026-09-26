# Spec Delta

## Purpose

This capability provides robust and reliable validation of JSON/YAML request payloads against AWS API Gateway OpenAPI 3.0 schema definitions, supporting both direct model-based matching and URL path/method-based routing.

## ADDED Requirements

### Requirement: Validation by OpenAPI Component Model
The system SHALL support validating a JSON or YAML payload file against a specific OpenAPI schema component model specified using the `--model` flag.

#### Scenario: Successful model-based validation
- **WHEN** the CLI is executed with a valid schema file, a valid model name, and a matching payload file
- **THEN** the CLI SHALL log 'Payload passed validation' and exit with status code 0

#### Scenario: Unsuccessful model-based validation
- **WHEN** the CLI is executed with a valid schema file, a valid model name, and a payload file that violates the schema constraints
- **THEN** the CLI SHALL log the detailed AJV validation errors and exit with status code 0

### Requirement: Validation by API Path and Method
The system SHALL support validating a payload file by looking up the request schema associated with a specific API path and request method using the `--path` and `--requestMethod` flags.

#### Scenario: Successful path-based validation
- **WHEN** the CLI is executed with a valid schema file, an existing API path, a matching request method, and a payload file matching that endpoint's requestBody schema
- **THEN** the CLI SHALL log 'Payload passed validation' and exit with status code 0

#### Scenario: Incorrect path or method flag usage
- **WHEN** the CLI is executed with both `--model` and `--path` flags provided simultaneously
- **THEN** the CLI SHALL exit with status code 1 and show an error message explaining that only one of path or model may be provided

### Requirement: Missing schema or payload handling
The system SHALL validate that both the OpenAPI schema definition file and the payload file exist before performing any validation.

#### Scenario: Missing schema file
- **WHEN** the CLI is executed with a schema path that does not exist on disk
- **THEN** the CLI SHALL exit with status code 1 and show an error message indicating that the OpenAPI file does not exist

#### Scenario: Missing payload file
- **WHEN** the CLI is executed with a payload path that does not exist on disk
- **THEN** the CLI SHALL exit with status code 1 and show an error message indicating that the payload file does not exist
