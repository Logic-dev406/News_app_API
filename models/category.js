const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        default: '',
    },
    slug: { type: String, slug: 'name' },
});

const category = mongoose.model('Category', categorySchema);

module.exports = category;
