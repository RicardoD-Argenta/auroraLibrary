const mongoose = require("mongoose")
const { Schema } = mongoose

const LoanDelay = mongoose.model(
    'LoanDelay',
    new Schema(
        {
        loanId: {
            type: Schema.Types.ObjectId,
        },
        overdueDays: {
            type: Number
        },
        overdueFee: {
            type: Number
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
)

module.exports = LoanDelay