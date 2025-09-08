import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
    id: String,
    title: String,
    labels: [String],
    date: String,
    tasks: [Object]
});

const boardSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    boards: [{
        id: String,
        title: String,
        cards: [cardSchema]
    }]
});

export default mongoose.model('Board', boardSchema);