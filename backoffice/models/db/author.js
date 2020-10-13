const {
    Schema,
    model
} = require("mongoose");

const AuthorSchema = new Schema({
    name: {
        type: String,
        required: true,
        primaryKey: true,
    },
    age: {
        type: Number,
        required: true
    },
    books_authored: {
        type: Number
    }

});

module.exports = model('Author', AuthorSchema);