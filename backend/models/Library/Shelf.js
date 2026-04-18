const mongoose = require("mongoose")
const { Schema } = mongoose

const Shelf = mongoose.model(
    'Shelf',
    new Schema(
        {
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