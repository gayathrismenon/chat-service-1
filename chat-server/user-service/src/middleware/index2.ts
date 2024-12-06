import { ErrorRequestHandler } from "express";
import { ApiError } from "../utils";

export const errorConverter: ErrorRequestHandler = (err, req, res, next) => {
    let error = err;
    
    // Convert known error types to ApiError
    if (!(error instanceof ApiError)) {
        // Handle different types of errors
        const statusCode = determineStatusCode(error);
        const message = determineErrorMessage(error, statusCode);
        
        error = new ApiError(
            statusCode, 
            message, 
            false, 
            error.stack ? error.stack.toString() : undefined
        );
    }
    
    next(error);
};

// Helper function to determine status code
const determineStatusCode = (error: any): number => {
    // Check for specific error types and map to appropriate status codes
    if (error.name === 'ValidationError') return 400; // Mongoose validation error
    if (error.name === 'MongoError' && error.code === 11000) return 409; // Duplicate key error
    if (error.name === 'CastError') return 400; // Invalid ID format
    
    return error.statusCode || 
           (error instanceof Error 
            ? 400 // Bad Request 
            : 500); // Internal Server Error
};

// Helper function to determine error message
const determineErrorMessage = (error: any, statusCode: number): string => {
    // Provide more specific error messages based on error type
    if (error.name === 'ValidationError') {
        return Object.values(error.errors)
            .map((err: any) => err.message)
            .join(', ');
    }
    
    if (error.name === 'MongoError' && error.code === 11000) {
        return 'Duplicate key error: Resource already exists';
    }
    
    return error.message || 
           (statusCode === 400 ? "Bad Request" : "Internal Server Error");
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    
    // In production, hide detailed error information
    if (process.env.NODE_ENV === "production" && !err.isOperational) {
        statusCode = 500; // Internal Server Error
        message = "Internal Server Error";
    }

    // Store error message for potential logging
    res.locals.errorMessage = err.message;

    // Prepare response
    const response = {
        code: statusCode,
        message,
        // Include stack trace only in development
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    };

    // Log errors in development
    if (process.env.NODE_ENV === "development") {
        console.error(err);
    }

    // Send error response
    res.status(statusCode).json(response);
    
    // Call next middleware (though this is typically the end of the error handling chain)
    next();
};