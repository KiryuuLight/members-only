const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
  title: String,
  timeStamp: {
    type: Date,
    default: Date.now(),
  },
  bodyMessage: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

messageSchema.virtual('dataFormat').get(function () {
  const year = this.timeStamp.getFullYear();
  const month = (this.timeStamp.getMonth() + 1).toString().padStart(2, '0');
  const day = this.timeStamp.getDate().toString().padStart(2, '0');

  return `${year}/${month}/${day}`;
});

module.exports = new model('Message', messageSchema);
