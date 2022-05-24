const getRequiredValidationMessage = (field) =>
  `${field.charAt(0).toUpperCase()}${field.slice(1)} is required`;

const RESPONSE = {
  MALFORMED_SYNTAX: {
    status: 400,
    success: false,
    message: `The request could not be understood by the server due to malformed syntax.`,
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    success: false,
  },
  CONFLICTING_RESOURCE: {
    status: 409,
    success: false,
    message: `user with same email id already exists`,
  },
  UNAUTHENTICATED_USER: {
    status: 401,
    success: false,
    message: `user not authenticated. Invalid token`,
  },
};

module.exports = { getRequiredValidationMessage, RESPONSE };
