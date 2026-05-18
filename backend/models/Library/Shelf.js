const mongoose = require("mongoose")
const { Schema } = mongoose

const Shelf = mongoose.model(
    'Shelf',
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
        },
        description: {
            type: String,
            maxlength: 255,
            sparse: true,
        },
    },
    { timestamps: true }
    )
)

module.exports = Shelf