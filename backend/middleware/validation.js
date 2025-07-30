const { body, param, query, validationResult } = require('express-validator');

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// User registration validation
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('role')
    .isIn(['donor', 'volunteer', 'agency'])
    .withMessage('Role must be donor, volunteer, or agency'),
  
  handleValidationErrors
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Profile update validation
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('phone')
    .optional()
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Please provide a valid phone number'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Location must be between 5 and 200 characters'),
  
  handleValidationErrors
];

// Donation creation validation
const validateDonation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  
  body('quantity')
    .trim()
    .notEmpty()
    .withMessage('Quantity is required'),
  
  body('expiryDate')
    .isISO8601()
    .withMessage('Please provide a valid expiry date')
    .custom((value) => {
      const expiryDate = new Date(value);
      const now = new Date();
      if (expiryDate <= now) {
        throw new Error('Expiry date must be in the future');
      }
      return true;
    }),
  
  body('pickupTime')
    .isISO8601()
    .withMessage('Please provide a valid pickup time')
    .custom((value) => {
      const pickupTime = new Date(value);
      const now = new Date();
      if (pickupTime <= now) {
        throw new Error('Pickup time must be in the future');
      }
      return true;
    }),
  
  body('location')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Location must be between 5 and 200 characters'),
  
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  
  handleValidationErrors
];

// Request creation validation
const validateRequest = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  
  body('quantity')
    .trim()
    .notEmpty()
    .withMessage('Quantity is required'),
  
  body('deadline')
    .isISO8601()
    .withMessage('Please provide a valid deadline')
    .custom((value) => {
      const deadline = new Date(value);
      const now = new Date();
      if (deadline <= now) {
        throw new Error('Deadline must be in the future');
      }
      return true;
    }),
  
  body('urgency')
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Urgency must be low, medium, high, or critical'),
  
  body('location')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Location must be between 5 and 200 characters'),
  
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  
  handleValidationErrors
];

// ID parameter validation
const validateId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  
  handleValidationErrors
];

// Location query validation
const validateLocationQuery = [
  query('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  
  query('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  
  query('radius')
    .optional()
    .isFloat({ min: 0.1, max: 100 })
    .withMessage('Radius must be between 0.1 and 100 kilometers'),
  
  handleValidationErrors
];

// Volunteer availability validation
const validateVolunteerAvailability = [
  body('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('isAvailable must be a boolean'),
  
  body('availability')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Availability description must be between 5 and 200 characters'),
  
  body('phone')
    .optional()
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Please provide a valid phone number'),
  
  handleValidationErrors
];

// Claim donation validation
const validateClaimDonation = [
  body('pickupTime')
    .isISO8601()
    .withMessage('Please provide a valid pickup time')
    .custom((value) => {
      const pickupTime = new Date(value);
      const now = new Date();
      if (pickupTime <= now) {
        throw new Error('Pickup time must be in the future');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Complete pickup validation
const validateCompletePickup = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('feedback')
    .optional()
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Feedback must be between 5 and 500 characters'),
  
  handleValidationErrors
];

// Fulfill request validation
const validateFulfillRequest = [
  body('fulfillmentDate')
    .isISO8601()
    .withMessage('Please provide a valid fulfillment date')
    .custom((value) => {
      const fulfillmentDate = new Date(value);
      const now = new Date();
      if (fulfillmentDate <= now) {
        throw new Error('Fulfillment date must be in the future');
      }
      return true;
    }),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Notes must be between 5 and 500 characters'),
  
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validateDonation,
  validateRequest,
  validateId,
  validateLocationQuery,
  validateVolunteerAvailability,
  validateClaimDonation,
  validateCompletePickup,
  validateFulfillRequest,
  handleValidationErrors
}; 