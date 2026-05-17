const mongoose = require("mongoose")
const { Schema } = mongoose

const Author = mongoose.model(
    'Author',
    new Schema(
        {
        code: {
            type: String,
            required: true,
            unique: true,
            maxlength: 20
        },
        name: {
            type: String,
            maxlength: 255,
            required: true
        }
    },
    { timestamps: true }
    )
)

module.exports = Author