const mongoose = require("mongoose")
const { Schema } = mongoose

const BookCopy = mongoose.model(
    'BookCopy',
    new Schema(
        {
        BookId: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },    
        sectorId: {
            type: Schema.Types.ObjectId,
            ref: 'Sector',
            required: true
        },
        shelfId: {
            type: Schema.Types.ObjectId,
            ref: 'Shelf',
            required: true
        },
        copycode: {
            type: String,
            maxlength: 20,
            required: true
        },
        status: {
            type: String,
            enum: ['available', 'borrowed', 'reserved', 'lost', 'maintenance'],
            required: true
        },
        condition: {
            type: String,
            enum: ['new', 'good', 'worn', 'damaged'],
            required: true
        },
        acquireAt: {
            type: Date,
            required: true
        },
        notes: {
            type: String,
            maxlength: 300,
            sparse: true
        }
        },
    { timestamps: true }
    )
)

module.exports = BookCopy