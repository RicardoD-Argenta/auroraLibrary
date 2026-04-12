const mongoose = require("mongoose")
const { Schema } = mongoose

const LibraryParams = mongoose.model(
    'LibraryParams',
    new Schema({
        libraryId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        params: {
            loanDelay: {
                active: {
                    type: Boolean,
                    required: true,
                    default: false
                },
                dailyRate: {
                    type: Number,
                    default: null,
                },
                fineValue: {
                    type: Number,
                    default: null,
                },
            }
        }
    },
    { timestamps: true }
    ),
)

module.exports = LibraryParams