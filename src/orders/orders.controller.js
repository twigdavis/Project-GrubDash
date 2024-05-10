const path = require("path");
const propertyIsValidArray = require("../utils/propertyIsValidArray");
const propertyIsValidString = require("../utils/propertyIsValidString");
const propertyIsValidInteger = require("../utils/propertyIsValidInteger");
const bodyDataHas = require("../utils/bodyDataHas");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
function list(req, res) {
    res.json({ data: orders })
}

function create(req, res) {
    const { data: { deliverTo, mobileNumber, dishes, quantity } = {} } = req.body;
    const newOrder = {
        id: nextId(),
        deliverTo,
        mobileNumber,
        dishes,
        quantity,
    };
    orders.push(newOrder)
    res.status(201).json({ data: newOrder })
}

function orderExists(req, res, next) {
    const { orderId } = req.params
    const foundOrder = orders.find((order) => order.id === orderId);
    if (foundOrder) {
        res.locals.order = foundOrder;
        return next();
    }
    next({ status: 404, message: `Order id not found: ${orderId}`});
}

function read(req, res) {
    res.json({ data: res.locals.order });
}


module.exports = {
    list,
    create: [
        bodyDataHas("deliverTo"),
        propertyIsValidString("deliverTo"),
        bodyDataHas("mobileNumber"),
        propertyIsValidInteger("mobileNumber"),
        bodyDataHas("dishes"),
        propertyIsValidArray("dishes"),
        bodyDataHas("quantity"),
        propertyIsValidArray("quantity"),
        create
    ],
    read: [orderExists, read],
}