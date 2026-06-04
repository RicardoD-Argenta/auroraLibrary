const mongoose = require("mongoose")
const { Schema } = mongoose

const loanDelaySchema = new Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            maxlength: 20
        },
        loanId: {
            type: Schema.Types.ObjectId,
            ref: 'Loans',
            required: true
        },
        overdueDays: {
            type: Number,
            required: true
        },
        overdueFee: {
            type: Number,
            required: true
        },
        paid: {
            type: Boolean,
            required: true
        },
        paidAt: {
            type: Date
        }
    },
    { timestamps: true }
)

const LoanDelay = mongoose.models.LoanDelay || mongoose.model('LoanDelay', loanDelaySchema)

module.exports = LoanDelay