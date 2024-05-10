function propertyIsValidArray(propertyName) {
    return function (req, res, next) {
        const { data = {} } = req.body;
        if (Array.isArray(data[propertyName]) && data[propertyName].length != 0) {
            return next();
        }
        next({ status: 400, message: `${propertyName} must be an Array!`});
    };
}


module.exports = propertyIsValidArray