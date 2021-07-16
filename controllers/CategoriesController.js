const Category = require('../models/category');
const response = require('../helpers/response');

class CategoriesController {
    static async getCategories(req, res) {
        try {
            const categoryList = await Category.find();

            if (!categoryList) {
                return res
                    .status(500)
                    .send(response('Category not found', {}, false));
            }

            res.status(200).send(
                response('Fetched categories successfully', categoryList)
            );
        } catch (err) {
            console.log(err.message);
        }
    }

    static async getCategoryById(req, res) {
        try {
            const category = await Category.findById(req.params.id);

            if (!category) {
                return res
                    .status(500)
                    .send(
                        response(
                            'Category with the given ID was not found',
                            {},
                            false
                        )
                    );
            }

            res.status(200).send(
                response('Fetched category successfully', category)
            );
        } catch (err) {
            console.log(err.message);
        }
    }

    static async createCategory(req, res) {
        try {
            const categoryExist = await Category.findOne({
                name: req.body.name,
            });

            if (categoryExist) {
                return res
                    .status(400)
                    .send(response('Category already exist', {}, false));
            }

            let category = new Category({
                name: req.body.name,
            });
            category = await category.save();

            if (!category)
                return res
                    .status(404)
                    .send(
                        response('The category can not be created', {}, false)
                    );

            res.send(response('Category created successfully', category));
        } catch (err) {
            console.log(err.message);
        }
    }

    static async updateCategoryById(req, res) {
        try {
            const update = {
                ...req.body,
            };
            const filter = { _id: req.params.id };

            const category = await Category.findOneAndUpdate(filter, update, {
                new: true,
            });

            if (!category)
                return res
                    .status(404)
                    .send(
                        response('The category can not be updated', {}, false)
                    );

            res.send(response('Category was successfully updated', category));
        } catch (err) {
            console.log(err.message);
        }
    }

    static deleteCategoryById(req, res) {
        Category.findByIdAndDelete(req.params.id)
            .then((category) => {
                if (category) {
                    return res
                        .status(200)
                        .send(
                            response(
                                'The category was successfully deleted',
                                {}
                            )
                        );
                } else {
                    return res
                        .status(404)
                        .send(response('Category not found', {}, false));
                }
            })
            .catch((err) => {
                return res.status(400).send(response(err.message, {}, false));
            });
    }
}

module.exports = CategoriesController;
