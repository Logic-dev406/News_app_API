const News = require('../models/news');
const response = require('../helpers/response');

class NewsContoller {
    static async getNews(req, res) {
        try {
            const newsList = await News.find();

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
            const news = await News.findById(res.params.id);

            if (!news) {
                res.status(500).send(
                    response(
                        'Category with the given ID was not found',
                        {},
                        false
                    )
                );
            }

            res.status(200).send(response('Fetched news successfully', news));
        } catch (err) {
            console.log(err);
        }
    }

    static async createNews(req, res) {
        try {
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
}

module.exports = NewsContoller;
