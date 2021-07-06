const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        trim: true,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    news: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'News',
    },
});

commentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

commentSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Comment', commentSchema);
