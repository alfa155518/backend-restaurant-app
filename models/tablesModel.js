const mongoose = require('mongoose')

const tablesSchema  =  new mongoose.Schema({
  name: {
    type: String,
    required: [true,"Please enter a table name"],
  },
  image: {
    type: String,
    required: [true,"Please enter a table image"],
  },
  people: {
    type: String,
    required: [true,"Please enter a table people"],
  },
  summary: {
    type: String,
    required: [true,"Please enter a table description"],
  },
  price: {
    type: String,
    required: [true,"Please enter a table price"],
  },
  image: {
    type: String,
    required: [true,"Please enter a table image"],
  },
  rating: {
    type: Number,
    default:4,
  },
  status: {
    type: Boolean,
    default:false,
  },
  images: [String]
})

const Tables = mongoose.model('Tables', tablesSchema);


module.exports = Tables;