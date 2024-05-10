const path = require("path");
const propertyIsValidString = require("../utils/propertyIsValidString")
const propertyIsValidInteger = require("../utils/propertyIsValidInteger")
const bodyDataHas = require("../utils/bodyDataHas")

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
function list(req, res) {
    res.json({ data: dishes });
}


function create(req, res) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newDish = {
        id: nextId(),
        name,
        description,
        price,
        image_url
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
}

function dishExists(req, res, next) {
    const { dishId } = req.params;
    const dishFound = dishes.find((dish) => dish.id === dishId);
    if (dishFound) {
        res.locals.dish = dishFound
        return next();
    }
    next({ status: 404, message: `Dish id not found ${dishId}`});
}

function read(req, res) {
    res.json({ data: res.locals.dish });
}

function update(req, res) {
    const dish = res.locals.dish
    const { data: {name, description, price, image_url } = {} } = req.body

    //Update the dish
    dish.name = name;
    dish.description = description;
    dish.price = price;
    dish.image_url = image_url;

    res.json({ data: dish });
}

module.exports = {
    list,
    read: [dishExists, read],
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
    ],
    update: [
        dishExists,
        bodyDataHas("name"),
        propertyIsValidString("name"),
        bodyDataHas("description"),
        propertyIsValidString("description"),
        bodyDataHas("price"),
        propertyIsValidInteger("price"),
        bodyDataHas("image_url"),
        propertyIsValidString("image_url"),
        update
    ]
}