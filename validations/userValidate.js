const userSchema = {
  firstName: {
    isLength: {
      options: {
        min: 3,
      },
      errorMessage: 'First Name must have at least 3 characters',
    },
    isString: {
      errorMessage: 'First Name should be a string',
    },
    trim: true,
  },
  lastName: {
    isLength: {
      options: {
        min: 3,
      },
      errorMessage: 'Last Name must have at least 3 characters',
    },
    isString: {
      errorMessage: 'Last Name should be a string',
    },
    trim: true,
  },
  email: {
    notEmpty: true,
    isEmail: true,
    trim: true,
  },
  password: {
    isLength: {
      options: {
        min: 6,
      },
      errorMessage: 'Password must have at least 6 characters',
    },
    trim: true,
  },
  confirmPassword: {
    notEmpty: true,
    custom: {
      options: (value, { req }) => {
        if (req.body.password === value) {
          return true;
        }

        throw new Error(`Password don't match`);
      },
    },
    trim: true,
  },
};

module.exports = { userSchema };
