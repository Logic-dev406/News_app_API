const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
    title: {
        type: String,
        require: true,
        default: '',
    },
    body: {
        type: String,
        require: true,
        default: '',
    },
    image: {
        type: String,
        require: true,
        default: '',
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    },
    catgory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        require: true,
    },
    datePosted: {
        type: Date,
        require: true,
        default: Date.now,
    },
});

const news = mongoose.model('News', newsSchema);

module.exports = news;
