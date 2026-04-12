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
        libraryId: {
            type: Schema.Types.ObjectId,
            ref: 'Library',
            required: true
        }
    },
    { timestamps: true }
    )
)

module.exports = Shelf