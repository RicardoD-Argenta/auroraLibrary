const mongoose = require("mongoose")
const { Schema } = mongoose

const Author = mongoose.model(
    'Author',
    new Schema(
        {
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