const Comment = require('../models/comment');
const response = require('../helpers/response');
const News = require('../models/news');
const User = require('../models/user');

class CommentsController {
    static async createComment(req, res) {
        try {
            if (!mongoose.isValidObjectId(req.params.id)) {
                res.status(400).send(response('Invalid news id', {}, false));
            }

            // find out which post you are commenting
            const id = req.params.id;

            const postComments = await News.findById(id)
                .populate({
                    path: 'comments',
                    model: 'Comment',
                })
                .select('comments');

            const userCommented =
                postComments.comments.lenght < 1
                    ? false
                    : postComments.comments.find(
                          (comment) => comment.user == req.body.user
                      );

            if (userCommented) {
                return res
                    .status(400)
                    .send(response('User already commented', {}, false));
            }

            // get the comment text and record post id
            const comment = new Comment({
                comment: req.body.comment,
                news: id,
                user: req.body.user,
            });
            // save comment
            await comment.save();
            // get this particular post
            const postRelated = await News.findById(id);
            // push the comment into the post.comments array
            postRelated.comments.push(comment);
            // save and redirect...
            await postRelated.save();
            res.status(200).send(postRelated);
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = CommentsController;
