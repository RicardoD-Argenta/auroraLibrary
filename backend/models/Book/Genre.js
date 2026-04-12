const mongoose = require("mongoose")
const { Schema } = mongoose

const Genre = mongoose.model(
    'Genre',
    new Schema(
        {
        name: {
            type: String,
            maxlength: 255,
            required: true
        },
        parentId: {
            type: Schema.Types.ObjectId,
            ref: 'Genre',
            default: null
        }
    },
    { timestamps: true }
    )
)

module.exports = Genre