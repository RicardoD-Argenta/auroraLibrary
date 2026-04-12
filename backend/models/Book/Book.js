const mongoose = require("mongoose")
const { Schema } = mongoose

const Book = mongoose.model(
    'Book',
    new Schema(
        {
        title: {
            type: String,
            maxlength: 255,
            required: true
        },
        subtitle: {
            type: String,
            maxlength: 255
        },
        authors: [{
            type: Schema.Types.ObjectId,
            ref: 'Author',
            required:true
        }],
        publisherId: {
            type: Schema.Types.ObjectId,
            ref: 'Publisher',
            required: true
        },
        genreId: [{
            type: Schema.Types.ObjectId,
            ref: 'Genre',
            required:true
        }],
        language: {
            type: String,
            maxlength: 255,
            required: true
        },
        isbn: {
            type: String,
            maxlength: 20,
            required: true,
            unique: true
        },
        edition: {
            type: String,
            maxlength: 255
        },
        year: {
            type: String,
            maxlength: 5,
            required: true
        },
        pages: {
            type: Number,
            maxlength: 4,
            required: true
        },
        description: {
            type: String,
            maxlength: 10000
        },
        coverUrl: { // imagem/capa do livro
            type: String,
            maxlength: 3000
        },
        bookCopy: {
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
        }
    },
    { timestamps: true }
    )
)

module.exports = Book