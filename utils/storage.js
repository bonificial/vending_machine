var JSONdb = require('simple-json-db');
var db = new JSONdb(__dirname + '/store.json');

const getObject = (object) => {
    return db.get(object);
}
const setItemsNumber = (data) => {
    let {itemName, quantity, price} = data;
    let currentItems = getObject('items');
    db.set("items", {...currentItems, [itemName.trim()]: {quantity, price, updated_at: new Date()}});
}
const setCoins = (data) => {
    let {denomination, quantity} = data;
    let coins = getObject('coins');
    db.set("coins", {...coins, [denomination]: {quantity, updated_at: new Date()}});
}
const getAllItems = () => {
    return db.JSON();
}

module.exports = {
    setItemsNumber, getAllItems, getObject, setCoins
}

