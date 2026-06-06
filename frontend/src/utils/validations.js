/**
 * Phone number validation
 * Accepts 10-11 digits (with or without +94 prefix)
 */
export const validatePhoneNumber = (phone) => {
  if (!phone) return { valid: false, message: "Phone number is required" };

  // Remove spaces and special characters for validation
  const cleaned = phone.replace(/[\s\-()]/g, "");

  // Check if it's a valid format: 10-11 digits or +94 followed by 9-10 digits
  const phoneRegex = /^(\+94)?[0-9]{9,11}$/;

  if (!phoneRegex.test(cleaned)) {
    return {
      valid: false,
      message: "Invalid phone number. Use 10-11 digits or +94 format",
    };
  }

  return { valid: true };
};

/**
 * NIC number validation
 * Sri Lankan NIC: Either 9 digits with 'v' (old format) or 12 digits (new format)
 * Examples: 123456789v or 123456789012
 */
export const validateNICNumber = (nic) => {
  if (!nic) return { valid: false, message: "NIC number is required" };

  // Remove spaces
  const cleaned = nic.trim().toUpperCase();

  // Old format: 9 digits + V (e.g., 123456789v)
  const oldFormatRegex = /^[0-9]{9}V$/;

  // New format: 12 digits (e.g., 123456789012)
  const newFormatRegex = /^[0-9]{12}$/;

  if (!oldFormatRegex.test(cleaned) && !newFormatRegex.test(cleaned)) {
    return {
      valid: false,
      message: "Invalid NIC format. Use 9 digits with 'v' (123456789v) or 12 digits (123456789012)",
    };
  }

  return { valid: true };
};

/**
 * Validate all customer form fields
 */
export const validateCustomerForm = (form) => {
  const errors = {};

  // Name validation
  if (!form.name?.trim()) {
    errors.name = "Name is required";
  }

  // Email validation
  if (!form.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Invalid email format";
  }

  // Phone number validation
  const phoneValidation = validatePhoneNumber(form.phoneNumber);
  if (!phoneValidation.valid) {
    errors.phoneNumber = phoneValidation.message;
  }

  // NIC validation
  const nicValidation = validateNICNumber(form.nicNumber);
  if (!nicValidation.valid) {
    errors.nicNumber = nicValidation.message;
  }

  // WhatsApp validation (optional but if provided should be valid)
  if (form.whatsappNumber?.trim()) {
    const whatsappValidation = validatePhoneNumber(form.whatsappNumber);
    if (!whatsappValidation.valid) {
      errors.whatsappNumber = "Invalid WhatsApp number";
    }
  }

  // Room fee validation
  if (!form.roomFee || Number(form.roomFee) <= 0) {
    errors.roomFee = "Room fee must be greater than 0";
  }

  // Address validation
  if (!form.address?.trim()) {
    errors.address = "Address is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
