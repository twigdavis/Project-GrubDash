const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
function list(req, res) {
    res.json({ data: dishes });
}

function bodyDataHas(propertyName) {
    return function (req, res, next) {
        const { data = {} } = req.body;
        if(data[propertyName]) {
            return next();
        }
        next({ status: 400, message: `Must include a ${propertyName}`});
    };
}

function propertyIsValidString(propertyName) {
    return function (req, res, next) {
        const { data = {} } = req.body;
        if (typeof data[propertyName] === 'string' && data[propertyName] != "" ) {
            return next();
        }
        next({ status: 400, message: `${propertyName} must be a string!`});
    };
}

function propertyIsValidInteger(propertyName) {
    return function (req, res, next) {
        const { data = {} } = req.body;
        if (data[propertyName] <= 0 || !Number.isInteger(data[propertyName])) {
            return next({ status: 400, message: `${propertyName} requires a valid number!`});
        }
        next();
    };
}

function create(req, res) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newDish = {
        id: nextId,
        name,
        description,
        price,
        image_url
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
}



module.exports = {
    list,
    create: [
        bodyDataHas("name"),
        propertyIsValidString("name"),
        bodyDataHas("description"),
        propertyIsValidString("description"),
        bodyDataHas("price"),
        propertyIsValidInteger("price"),
        bodyDataHas("image_url"),
        propertyIsValidString("image_url"),
        create
    ]
}