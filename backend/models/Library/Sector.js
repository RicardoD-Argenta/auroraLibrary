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
        libraryId: {
            type: Schema.Types.ObjectId,
            ref: 'Library',
            required: true
        }
    },
    { timestamps: true }
    )
)

module.exports = Sector