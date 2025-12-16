export const STATUS = {
 
  OK: 200, // Standard success for GET/PUT
  CREATED: 201, // Successfully created something new (POST)
  NO_CONTENT: 204, // Success but no data to return

  // Client error responses - when users mess up
  BAD_REQUEST: 400, // Invalid input or missing required fields
  UNAUTHORIZED: 401, // Missing or invalid auth token
  FORBIDDEN: 403, // Authenticated but not authorized for this action
  NOT_FOUND: 404, // Requested resource doesn't exist
  METHOD_NOT_ALLOWED: 405, // Wrong HTTP method for this endpoint
  CONFLICT: 409, // Resource already exists or conflicts
  UNPROCESSABLE_ENTITY: 422, // Input validation failed

  TOO_MANY_REQUESTS: 429, // Rate limiting kicked in

  // Server error responses - when I mess up
  INTERNAL_ERROR: 500, // Something went wrong on my end
  NOT_IMPLEMENTED: 501, // Feature not built yet
  SERVICE_UNAVAILABLE: 503, // Server is down or under maintenance
};
