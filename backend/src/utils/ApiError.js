// src/ utils/ ApiError.js
// Create a custom error class for handling API errors
class ApiError extends Error{
     constructor(
          statusCode, // HTTP status code (e.g. 404, 500, 401)
          message = "Something went wrong.", // default error message
          error = [], // Optional: extra error info (e.g. array of validation errors)
          stack = "" // Optional: error stack trace
     ){
          super(message); // call the parent Error class

          this.statusCode = statusCode; // HTTP status
          this.data = null; // Optional: You can add actual data if needed
          this.message = message; // Error message
          this.success = false; // Set success false for API responses
          this.error = error; // Extra error details
          this.name = this.constructor.name
          
          // Stack trace helps in debugging
          if(stack){
               this.stack = stack
          }else{
               Error.captureStackTrace(this,this.constructor)
          }
     }
}

export { ApiError }
