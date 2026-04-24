const mongoose = require("mongoose")
const { Schema } = mongoose

const Loans = mongoose.model(
    'Loans',
    new Schema(
        {
        copyId: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },
        memberId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        operatorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        notes: {
            type: String,
            maxlength: 300,
            sparse: true
        },
        loanDate: {
            type: Date,
            required: true
        },
        dueDate: {
            type: Date,
            required: true
        },
        returnDate: {
            type: Date
        },
        status: {
            type: String,
            enum: ['active', 'returned', 'overdue', 'lost'],
            required: true
        },
        conditionOut: {
            type: String,
            enum: ['new', 'good', 'worn', 'damaged'],
            required: true
        },
        conditionIn: {
            type: String,
            enum: ['new', 'good', 'worn', 'damaged']
        }
    },
    { timestamps: true }
    )
)

module.exports = Loans