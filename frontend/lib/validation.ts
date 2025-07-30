// Form validation utilities
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateField = (value: any, rules: ValidationRule): ValidationResult => {
  const errors: string[] = [];

  // Required validation
  if (rules.required && (!value || value.toString().trim() === '')) {
    errors.push('This field is required');
  }

  // Skip other validations if value is empty and not required
  if (!value || value.toString().trim() === '') {
    return { isValid: errors.length === 0, errors };
  }

  // Min length validation
  if (rules.minLength && value.toString().length < rules.minLength) {
    errors.push(`Minimum length is ${rules.minLength} characters`);
  }

  // Max length validation
  if (rules.maxLength && value.toString().length > rules.maxLength) {
    errors.push(`Maximum length is ${rules.maxLength} characters`);
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value.toString())) {
    errors.push('Invalid format');
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      errors.push(customError);
    }
  }

  return { isValid: errors.length === 0, errors };
};

// Common validation rules
export const validationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    required: true,
    minLength: 6,
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  phone: {
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
  },
  quantity: {
    required: true,
    minLength: 1,
  },
  title: {
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  description: {
    maxLength: 500,
  },
  location: {
    required: true,
    minLength: 5,
  },
};

// Validate form object
export const validateForm = (formData: Record<string, any>, rules: Record<string, ValidationRule>): Record<string, ValidationResult> => {
  const results: Record<string, ValidationResult> = {};

  for (const [field, rule] of Object.entries(rules)) {
    results[field] = validateField(formData[field], rule);
  }

  return results;
};

// Check if form is valid
export const isFormValid = (validationResults: Record<string, ValidationResult>): boolean => {
  return Object.values(validationResults).every(result => result.isValid);
};

// Get all errors from form validation
export const getAllErrors = (validationResults: Record<string, ValidationResult>): string[] => {
  return Object.values(validationResults)
    .flatMap(result => result.errors);
}; 