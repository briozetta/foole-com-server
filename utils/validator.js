function validator({ firstName, lastName, email, password }) {
    // Field presence check
    if (!firstName) return 'First name is required';
    if (!lastName) return 'Last name is required';
    if (!email) return 'Email is required';
    if (!password) return 'Password is required';
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Invalid email format';
    }
  
    // Validate password requirements
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one capital letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
  
    // If all validations pass
    return null;
  }
   
  module.exports = validator;
  