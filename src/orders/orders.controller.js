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

function checkOrderQuantity(req, res, next) {
    const { data: { dishes } = {} } = req.body;
    for (let i = 0; i < dishes.length; i++) {
        let dish = dishes[i];
        let dishquantity = dish.quantity
        if (dishquantity <= 0 || !Number.isInteger(dishquantity)){
            return next({ status: 400, message: `Dish ${dishes[i].id} must have a quantity that is an integer greater than 0`});
        }
    }
    next();
}

function create(req, res) {
    const { data: { deliverTo, mobileNumber, dishes } = {} } = req.body;
    
    const newOrder = {
        id: nextId(),
        deliverTo,
        mobileNumber,
        dishes,
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

function orderIdMatch(req, res, next) {
    const { orderId } = req.params;
    const { data: { id } = {} } = req.body;
    if (id) {
        if (id != res.locals.order.id) {
            next({ status: 400, message: `Order id does not match route id. Order: ${id}, Route: ${orderId}` })
        };
    }
    next();
}

function orderStatusValidation(req, res, next) {
    const { data: { status } = {} } = req.body
    const validStatus = ["pending","preparing", "out-for-delivery", "delivered"]
    if (res.locals.order.status === "delivered") {
        return next({ status: 400, message: "A delivered order cannot be changed" })
    }
    if (validStatus.includes(status)) {
        return next();
    }
    next({ status: 400, message: `Order must have a status of pending, preparing, out-for-delivery, delivered`})
}

function orderStatusPending(req, res, next) {
    const order = res.locals.order
    if (order.status === 'pending') {
        next();
    }
    next({ status: 400, message: "An order cannot be deleted unless it is pending."})
}

function update(req, res) {
    const order = res.locals.order
    const { data: {deliverTo, mobileNumber, status, dishes} = {} } = req.body

    order.deliverTo = deliverTo
    order.mobileNumber = mobileNumber
    order.status = status
    order.dishes = dishes

    res.json({ data: order });
}

function destroy(req, res) {
    const { orderId } = req.params
    const index = orders.findIndex((order) => order.id === orderId);
    const deletedOrder = orders.splice(index,1);
    res.sendStatus(204);
}

module.exports = {
    list,
    create: [
        bodyDataHas("deliverTo"),
        propertyIsValidString("deliverTo"),
        bodyDataHas("mobileNumber"),
        propertyIsValidString("mobileNumber"),
        bodyDataHas("dishes"),
        propertyIsValidArray("dishes"),
        checkOrderQuantity,
        create
    ],
    read: [orderExists, read],
    update: [
        orderExists,
        orderIdMatch,
        bodyDataHas("deliverTo"),
        propertyIsValidString("deliverTo"),
        bodyDataHas("mobileNumber"),
        propertyIsValidString("mobileNumber"),
        bodyDataHas("dishes"),
        propertyIsValidArray("dishes"),
        checkOrderQuantity,
        orderStatusValidation,
        update
    ],
    delete: [orderExists, orderStatusPending, destroy]
}