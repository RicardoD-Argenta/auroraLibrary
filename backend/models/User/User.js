const mongoose = require("mongoose")
const { Schema } = mongoose

const User = mongoose.model(
    'User',
    new Schema({
        code: {
            type: String,
            required: true,
            unique: true,
            maxlength: 20
        },
        name: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 255
        },
        login: {
            type: String,
            trim: true,
            lowercase: true,
            sparse: true,
            maxlength: 255
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            maxlength: 255
        },
        role: {
            type: String,
            enum: ['admin', 'librarian'],
        },
    },
    { timestamps: true }
    ),
)

module.exports = User