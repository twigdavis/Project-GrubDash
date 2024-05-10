function propertyIsValidArray(propertyName) {
    return function (req, res, next) {
        const { data = {} } = req.body;
        if (typeof data[propertyName].constructor === Array && data[propertyName] != [] ) {
            return next();
        }
        next({ status: 400, message: `${propertyName} must be an Array!`});
    };
}


module.exports = propertyIsValidArray