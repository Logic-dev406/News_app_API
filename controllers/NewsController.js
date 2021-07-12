const News = require('../models/news');
const Category = require('../models/category');
const response = require('../helpers/response');
const mongoose = require('mongoose');

class NewsContoller {
    static async getNews(req, res) {
        try {
            let filter = {};
            if (req.query.categories) {
                filter = { category: req.query.categories.split(', ') };
            }
            console.log(filter);
            const newsList = await News.find(filter)
                .sort({ dateOdered: -1 })
                .populate({ path: 'category', model: 'Category' });

            if (!newsList) {
                res.status(500).send(
                    response('News list not available', {}, false)
                );
            }

            res.send(response('Featched news list successfully', newsList));
        } catch (err) {
            console.log(err);
        }
    }

    static async getNewsById(req, res) {
        try {
            const news = await News.findOne({ slug: req.params.slug })
                .populate({ path: 'category', model: 'Category' })
                .populate({ path: 'autor', model: 'User' });

            if (!news) {
                res.status(500).send(
                    response('News with the given ID was not found', {}, false)
                );
            }

            res.status(200).send(response('Fetched news successfully', news));
        } catch (err) {
            console.log(err);
        }
    }

    // static async filterNewsByCategory(req, res) {
    //     try {
    //         if (!mongoose.isValidObjectId(req.params.category)) {
    //             res.status(400).send(response('Invalid Category', {}, false));
    //         }

    //         const news = await News.find({ category: req.params.category });

    //         if (!news) {
    //             res.status(500).send(
    //                 response(
    //                     'News with the given category was not found',
    //                     {},
    //                     false
    //                 )
    //             );
    //         }

    //         res.status(200).send(response('Fetched news successfully', news));
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    static async getUsersNews(req, res) {
        try {
            const news = await News.find({ autor: req.params.id }).sort({
                dateOdered: -1,
            });

            if (!news) {
                res.status(500).send(
                    response(
                        'News with the given userID was not found',
                        {},
                        false
                    )
                );
            }

            res.status(200).send(
                response('Fetched user news successfully', news)
            );
        } catch (err) {
            console.log(err);
        }
    }

    static async createNews(req, res) {
        try {
            if (
                !mongoose.isValidObjectId(req.body.autor && req.body.category)
            ) {
                res.status(400).send(
                    response('invalid user id or category id', {}, false)
                );
            }

            const fileName = req.file.filename;
            const basePath = `${req.protocol}://${req.get(
                'host'
            )}/public/uploads/`;
            let news = new News({
                title: req.body.title,
                autor: req.body.autor,
                body: req.body.body,
                image: `${basePath}${fileName}`,
                category: req.body.category,
            });
            news = await news.save();

            if (!news) {
                res.status(500).send(
                    response('The news can not be created ', {}, false)
                );
            }

            res.status(200).send(response('News created successfully', news));
        } catch (err) {
            console.log(err);
        }
    }

    static async updateNewsById(req, res) {
        try {
            if (!mongoose.isValidObjectId(req.params.id)) {
                res.status(400).send(response('Invalid news id', {}, false));
            }

            const update = {
                ...req.body,
            };
            const filter = { _id: req.params.id };

            const news = await News.findOneAndUpdate(filter, update, {
                new: true,
            });

            if (!news)
                return res
                    .status(500)
                    .send(response('The news can not be updated', {}, false));

            res.send(response('News was updated successfully', news));
        } catch (err) {
            console.log(err.message);
        }
    }

    static deleteNewsById(req, res) {
        News.findByIdAndDelete(req.params.id)
            .then((news) => {
                if (news) {
                    return res
                        .status(200)
                        .send(response('News was deleted successfully', {}));
                } else {
                    return res
                        .status(404)
                        .send(
                            response(
                                'News with the giving id was not found',
                                {},
                                false
                            )
                        );
                }
            })
            .catch((error) => {
                return res.status(400).send(response(error.message, {}, false));
            });
    }
}

module.exports = NewsContoller;
