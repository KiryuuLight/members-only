const messageSchema = {
  title: {
    isLength: {
      options: {
        min: 3,
      },
      errorMessage: 'Title must have at least 3 characters',
    },
    isString: true,
    trim: true,
  },
  bodyMessage: {
    notEmpty: {
      errorMessage: 'The message must not be empty',
    },
    isString: true,
    trim: true,
  },
};

module.exports = { messageSchema };
