const mongoose = require("mongoose")
const { Schema } = mongoose

const Library = mongoose.model(
    'Library',
    new Schema({
        name: {
            type: String,
            maxlength: 255,
            required: true
        },
    },
    { timestamps: true }
    ),
)

module.exports = Library