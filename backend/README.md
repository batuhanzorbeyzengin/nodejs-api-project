# Product API Service

This project is a REST API service developed for product catalog and product eligibility check.

## Features

- Express.js based REST API
- Redis cache integration
- Bearer token authentication
- Joi validation
- Helmet security measures
- CORS configuration
- Detailed error handling and logging
- Docker and Docker Compose support
- Automatic restart and health checks

## Setup and Run

### Manual Setup
1. Clone the project
2. Copy the `.env.example` file to `.env`
3. Edit the variables in the `.env` file according to your environment
4. Run Redis in your local environment
5. Install dependencies:
   ```bash
   npm install
   ```
6. Start the application:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### Docker Setup
1. Clone the project
2. Copy the `.env.example` file to `.env`
3. Edit the variables in the `.env` file (Redis host value should be `redis`)
4. Start Docker containers:
   ```bash
   # Start containers
   docker-compose up -d
   
   # View logs
   docker-compose logs -f
   ```

## Docker Configuration

### Dockerfile
- Node.js 18 Alpine base image
- Production dependencies
- Multi-stage build with optimized image
- Non-root user for security

### Docker Compose
- API service and Redis containers
- Environment variable support
- Volume for Redis data persistency
- Source code mounting for hot-reload
- Network for inter-container communication
- Health check and dependency management
- Automatic restart policy

### Container Health Checks
- Health check for Redis container
- API service's dependency on Redis
- Automatic retry in case of connection loss
- Detailed status logging

### Network Configuration
- Isolated bridge network
- Secure communication between containers
- Only necessary ports are opened to the outside world

## Environment Variables

The following environment variables can be configured in the `.env` file:

### Server Configuration
- `PORT`: Port number the application will run on
- `NODE_ENV`: Application environment (development, production)

### API Configuration
- `API_BASE_URL`: Base URL of the external API

### Redis Configuration
- `REDIS_HOST`: Host address of the Redis server
- `REDIS_PORT`: Port number of the Redis server

### Cache Configuration
- `CACHE_TTL`: Cache duration for the product list (seconds)
- `PRODUCT_DETAIL_CACHE_TTL`: Cache duration for product details (seconds)

### CORS Configuration
- `CORS_ORIGIN`: Allowed origins (comma-separated list)
- `CORS_METHODS`: Allowed HTTP methods
- `CORS_ALLOWED_HEADERS`: Allowed HTTP headers
- `CORS_EXPOSED_HEADERS`: HTTP headers exposed to the client
- `CORS_CREDENTIALS`: Credentials support (true/false)
- `CORS_MAX_AGE`: Cache duration for CORS pre-flight results

## API Endpoints

### 1. Product List
- **GET** `/api/v1/product`
- **Query Parameters:**
  - `offset`: Number of products to skip (default: 0, maximum: 200)
  - `limit`: Number of products per page (default: 50, minimum: 10, maximum: 200)
- **Header:** `Authorization: Bearer <token>`
- **Cache:** 1 hour
- **Success Response:**
  ```json
  {
    "success": true,
    "message": "Data retrieved successfully",
    "data": [
      {
        "id": "string",
        "name": "string",
        "price": "number",
        // ... other product fields
      }
    ],
    "meta": {
      "pagination": {
        "page": 1,
        "limit": 50,
        "total": 100,
        "totalPages": 2,
        "hasNextPage": true,
        "hasPrevPage": false
      }
    },
    "timestamp": "2024-01-27T12:34:56.789Z"
  }
  ```

### 2. Product Detail
- **GET** `/api/v1/product/:id`
- **Path Parameter:** `id` (Product ID, required)
- **Header:** `Authorization: Bearer <token>`
- **Cache:** 15 minutes
- **Success Response:**
  ```json
  {
    "success": true,
    "message": "Product details retrieved successfully",
    "data": {
      "id": "string",
      "name": "string",
      "price": "number",
      "description": "string",
      // ... other product details
    },
    "timestamp": "2024-01-27T12:34:56.789Z"
  }
  ```
- **Error Response (404):**
  ```json
  {
    "success": false,
    "errors": [{
      "message": "Resource not found",
      "code": "RSC001",
      "traceID": "404001"
    }],
    "timestamp": "2024-01-27T12:34:56.789Z"
  }
  ```

### 3. Product Eligibility Check
- **POST** `/api/v1/product/:id/check`
- **Path Parameter:** `id` (Product ID, required)
- **Header:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "countryCode": "TR",     // Optional
    "currency": "EUR",       // Required
    "price": 1000           // Required, must be greater than 0
  }
  ```
- **Success Response:**
  ```json
  {
    "success": true,
    "message": "Product eligibility check completed successfully",
    "data": {
      "eligible": true,
      "reasons": [],
      "additionalInfo": {}
    },
    "timestamp": "2024-01-27T12:34:56.789Z"
  }
  ```
- **Error Responses:**
  - **400 Bad Request:**
    ```json
    {
      "success": false,
      "errors": [{
        "message": "Currency and price are required",
        "code": "REQ001",
        "traceID": "400001"
      }],
      "timestamp": "2024-01-27T12:34:56.789Z"
    }
    ```
  - **401 Unauthorized:**
    ```json
    {
      "success": false,
      "errors": [{
        "message": "Unauthorized access",
        "code": "AUTH001",
        "traceID": "401001"
      }],
      "timestamp": "2024-01-27T12:34:56.789Z"
    }
    ```

### Common Error Responses

All endpoints may return these common error responses:

- **401 Unauthorized** - Missing or invalid token
- **400 Bad Request** - Invalid parameters
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

Error response format:
```json
{
  "success": false,
  "errors": [{
    "message": "Error description",
    "code": "ERROR_CODE",
    "traceID": "TRACE_ID"
  }],
  "timestamp": "2024-01-27T12:34:56.789Z"
}
```