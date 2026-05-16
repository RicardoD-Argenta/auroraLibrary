const mongoose = require('mongoose')
const { Schema } = mongoose

const Counter = mongoose.model(
    'Counter',
    new Schema({
        _id: { type: String, required: true },
        seq: { type: Number, default: 0 }
    })
)

Counter.nextSequence = async function (name) {
    const counter = await Counter.findByIdAndUpdate(
        name,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    )
    return String(counter.seq)
}

module.exports = Counter
