const mongoose = require("mongoose")
const { Schema } = mongoose

const Sector = mongoose.model(
    'Sector',
    new Schema(
        {
        name: {
            type: String,
            maxlength: 255,
            required: true,
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

module.exports = Sector