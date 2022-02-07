module.exports.setMessage = function (req, res, next) {
    res.locals.flash = {
        success: req.flash("successMessage"),
        failure: req.flash("failureMessage"),
        message: req.flash("normalMessage"),
    };
    next();
};
