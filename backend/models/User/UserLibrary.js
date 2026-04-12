const mongoose = require("mongoose")
const { Schema } = mongoose

const UserLibrary = mongoose.model(
    'UserLibrary',
    new Schema({
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        libraryId: {
            type: Schema.Types.ObjectId,
            ref: 'Library',
            required: true
        },
        role: {
            type: String,
            enum: ['admin', 'librarian', 'member'],
            required: true
        }
    },
    { timestamps: true }
    ),
)

module.exports = UserLibrary