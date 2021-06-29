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
            res.status(500).send(response(err.message, {}, false));
            console.log(err);
        }
    }

    static async getNewsById(req, res) {
        const news = await News.findById(res.params.id);

        if (!news) {
            res.status(500).send(
                response('Category with the given ID was not found', {}, false)
            );
        }

        res.status(200).send(response('Fetched news successfully', news));
    }
}

module.exports = NewsContoller;
