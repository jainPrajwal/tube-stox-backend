const getRequiredValidationMessage = (field) =>
  `${field.charAt(0).toUpperCase()}${field.slice(1)} is required`;

module.exports = { getRequiredValidationMessage };
