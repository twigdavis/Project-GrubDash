function propertyIsValidString(propertyName) {
    return function (req, res, next) {
        const { data = {} } = req.body;
        if (typeof data[propertyName] === 'string' && data[propertyName] != "" ) {
            return next();
        }
        next({ status: 400, message: `${propertyName} must be a string!`});
    };
}


module.exports = propertyIsValidString