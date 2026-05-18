const mongoose = require("mongoose")
const { Schema } = mongoose

const Genre = mongoose.model(
    'Genre',
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