const Review = require('../../models/user/reviewModel');
const catchAsyncErrors = require('../../common-middleware/catchAsyncErrors');
const ErrorHander = require('../../utiles/errorhander');
const User = require('../../models/user/user');

exports.createReview = catchAsyncErrors(async (req, res, next) => {
    const {
        name,
        email,
        description,
    } = req.body;

    const order = await Review.create({
        name,
        email,
        description,
    }).then((data) => {

        return res.status(201).json({
            message: "Thanks for feedback"
        });
    }).catch((error) => {
        return res.status(400).json({
            error: error
        });
    });
});




exports.getReview = catchAsyncErrors(async (req, res, next) => {
    await Review.find({}).then((review) => {
        return res.status(200).json({
            review
        });
    }).catch((error) => {
        return res.status(400).json({
            error: error
        });
    });
});



exports.createAstrolgerReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, astrologerId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };
    try {

        const product = await User.findById(astrologerId);

        const isReviewed = product.reviews.find(
            (rev) => rev.user.toString() === req.user._id.toString()
        );

        if (isReviewed) {
            product.reviews.forEach((rev) => {
                if (rev.user.toString() === req.user._id.toString())
                    (rev.rating = rating), (rev.comment = comment);
            });
        } else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }

        let avg = 0;

        product.reviews.forEach((rev) => {
            avg += rev.rating;
        });

        product.ratings = avg / product.reviews.length;

        await product.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
        });
    } catch (err) {
        return res.status(400).json({
            error: err,
            success: false,
        });
    }
});