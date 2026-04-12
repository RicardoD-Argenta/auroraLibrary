const mongoose = require("mongoose")
const { Schema } = mongoose

const Publisher = mongoose.model(
    'Publisher',
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

module.exports = Publisher