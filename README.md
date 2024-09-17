# Challenge Test API

Hello :) Welcome to the Challenge Test API project!

## Project Structure

### `cypress/e2e`

This folder contains end-to-end test files that validate various scenarios for the API.

- **`exBack_wanne_mocked.cy.js`**: Tests with mocked responses to simulate and validate specific API behaviors.
- **`exBanck_wanne_non_functional.cy.js`**: Non-functional tests, including performance and load testing.
- **`exBank_wanne.cy.js`**: General end-to-end tests covering various API endpoints and scenarios.

### `api`
This folder contains the API server setup and routing configurations.

- **`server.js`**: The main server file that initializes and configures the API server.

### `api/'api/controllers`
- **`/controllers`**: Includes files that define the business logic and handle requests for different API routes.

### `api/api/routers`
- **`/routers`**: Includes files that define the API routes and their corresponding handlers, linking routes to controllers.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/WanneToldova/chalenge_test.git
