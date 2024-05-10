function propertyIsValidInteger(propertyName) {
    return function (req, res, next) {
        const { data = {} } = req.body;
        if (data[propertyName] <= 0 || !Number.isInteger(data[propertyName])) {
            return next({ status: 400, message: `${propertyName} requires a valid number!`});
        }
        next();
    };
}


module.exports = propertyIsValidInteger