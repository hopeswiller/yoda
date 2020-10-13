const { Schema,model } = require("mongoose");

const BookSchema = new Schema({
    name: {
        type:String,
        required:true
    },
    genre: {
        type:String,
        required: true
    },
    author_id: {
        type:String,
    }
});

module.exports = model('Book',BookSchema);
