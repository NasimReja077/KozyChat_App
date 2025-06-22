// src/ utils/ ApiResponse.js
class ApiResponse {
     constructor(statusCode, data, message = "Success"){

          this.statusCode = statusCode; // HTTP status code
          this.data = data; // Actual data to return
          this.message = message; // Optional success message

          // If the status code is below 400, then success true — otherwise false
          this.success = statusCode < 400;
     }
}

export { ApiResponse };