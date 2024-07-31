# Shipment Parser Module

The Shipment Parser Module is a standalone service designed to parse and standardize shipment data from various carriers and formats. It provides a unified interface for handling different shipment data structures and converting them into a consistent format for further processing.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [API Endpoints](#api-endpoints)
4. [Configuration](#configuration)
5. [Parsers](#parsers)
6. [Data Models](#data-models)
7. [Error Handling](#error-handling)

## Installation

To install the Shipment Parser Module, follow these steps:

1. Navigate to the module directory:

   ```
   cd src/services/external/shipment-parser
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Usage

To start the Shipment Parser service:

```
npm start
```

This will start the service on the port specified in your environment variables or default to port 3003.

## API Endpoints

The module exposes the following API endpoints:

1. Parse Shipment

   - URL: `/shipment-parser/parse`
   - Method: POST
   - Body: Raw shipment data
   - Response: Parsed shipment data in standardized format

2. Parse Known Shipment
   - URL: `/shipment-parser/parse_known`
   - Method: POST
   - Body: Shipment data in a known format
   - Response: Parsed shipment data in standardized format

## Configuration

Configuration settings can be found in `config/config.ts`. Make sure to set up your environment variables, especially the OpenAI API key if you're using AI-assisted parsing.

## Parsers

The module includes several parsers:

1. General Shipment Parser (`parsers/shipment-parser.ts`)
2. Known Format Parser (`parsers/known-parser.ts`)

These parsers handle different input formats and convert them to the standardized `ShipmentData` format.

## Data Models

The main data model used is `ShipmentData`, defined in `types/index.ts`. This model represents the standardized format for all parsed shipment data.

## Error Handling

The module uses a consistent error handling approach, returning structured error responses when parsing fails. Errors are logged for debugging purposes.

For more detailed information about each component, please refer to the individual files within the module.
