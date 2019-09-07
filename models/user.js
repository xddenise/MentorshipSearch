const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
      email: String,
      password: String,
      name: String,
      status:{
        type: String,
        default: 'active'
      },
      skills: [String]
    });

const User = mongoose.model('employees', userSchema);

module.exports = User;
