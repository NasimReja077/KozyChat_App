// src/utils/asyncHandler.js

// This is a higher-order function that wraps asynchronous route handlers

const asyncHandler = (requestHandler) => {
     return (req, res, next) => {
          // Executes the async function and catches any error
          Promise
               .resolve(requestHandler(req, res, next))
               .catch((err) => next(err)); // Errors automatically go to error middleware
     };
};

// Export the handler so you can use it in your route/controller functions
export { asyncHandler };
