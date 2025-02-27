const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

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
        ref: 'User',
        require: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        require: true,
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],
    datePosted: {
        type: Date,
        require: true,
        default: Date.now,
    },
    slug: { type: String, slug: 'title' },
});

const news = mongoose.model('News', newsSchema);

module.exports = news;
