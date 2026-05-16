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
        },
        code: {
            type: String,
            required: true,
            unique: true,
            maxlength: 20
        }
        
    },
    { timestamps: true }
    )
)

module.exports = Publisher