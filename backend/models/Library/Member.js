const mongoose = require("mongoose")
const { Schema } = mongoose

const Member = mongoose.model(
    'Member',
    new Schema({
        name: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 255
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            sparse: true,
            maxlength: 255
        },
        phone: {
            type: String,
            sparse: true,
            maxlength: 20
        },
        student: {
            isStudent: {
                type: Boolean,
                required: true,
                default: false
            },
            studentClass: {
                type: String,
                sparse: true,
                maxlength: 255
            }
        },
        member: {
            isMember: {
                type: Boolean,
                required: true,
                default: false
            },
            memberSince: {
                type: Date,
                sparse: true
            }
        },
        observations: {
            type: String,
            sparse: true,
            maxlength: 255
        },
    },
    { timestamps: true }
    ),
)

module.exports = Member