const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  memberStatus: {
    type: Boolean,
    default: false,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

userSchema.virtual('nickname').get(function () {
  return `${this.firstName.toLocaleLowerCase()}${this.lastName.toLocaleLowerCase()}`;
});

module.exports = new model('User', userSchema);
