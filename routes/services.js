var express = require('express');
const { getObject, setCoins} = require("../utils/storage");
const {denominations} = require("../utils/denominations");
var router = express.Router();
let items = getObject('items');
const checkIfItemIsAvailable = async (itemName) => {
    let itemIndex = Object.keys(items).indexOf(itemName.trim());
    return itemIndex;
}
const checkIfPossibleToGiveExactChange = (changeExpected) => {
    let looseChange = [];
    let balanceNow = changeExpected * 100;
    let changeInCents = [];
    Object.values(denominations).map(({label}) => {
        changeInCents.push(parseInt(label.replace('cents', "")));
    })
    changeInCents.sort(function (a, b) {
        return b - a
    })
    while (balanceNow && !isNaN(balanceNow)) {
        for (let i = 0; i < changeInCents.length; i++) {
            if (balanceNow && !isNaN(balanceNow)) {
                let denominationChange = Math.floor((balanceNow) / changeInCents[i]);
                let changeValue = changeInCents[i] / 100;
                let changeValueNotation = changeValue < 1 ? changeInCents[i] + "C" : (changeInCents[i] / 100) + "P";
                denominationChange ? looseChange.push({
                    'denom': `${changeValueNotation}`, quantity: denominationChange
                }) : null;
                balanceNow = ((balanceNow) - (changeInCents[i] * denominationChange)) // Update the Balance
            }
        }
    }
    return looseChange;

}


router.post('/buy', async (req, res) => {
    let {itemName, units, amountCollected} = req.body;
    let itemIndex = await checkIfItemIsAvailable(itemName); // Check if Item is Available, returns i=-1 if not available, and i>=0 if item is available
    if (itemIndex < 0) {
        return res.status(200).json({status: 'error', message: 'The Item is not available'}) //Item is not available
    } else {
        let {quantity: quantityAvailableInStock, price} = Object.values(items)[itemIndex]; // Get the Item Details using the Returned Index above
        let totalPrice = units * price;
        if (units > quantityAvailableInStock) {
            return res.status(200).json({
                status: 'error',
                message: `Not enough quantity of ${itemName} available. Only ${quantityAvailableInStock} remaining.`
            })
        }
        if (amountCollected !== totalPrice && amountCollected % 1 != 0) { //Avoid taking in cash with additional cents, if provided money is not exact
            return res.status(200).json({
                status: 'error', message: `Please provide money in whole values or the exact cash.`
            })
        }
        if (totalPrice > amountCollected) { //If not enough money provided
            return res.status(200).json({
                status: 'error', message: `Not enough Money provided. ${units} units of ${itemName} cost ${totalPrice}.`
            })
        }
        if (amountCollected > totalPrice) {
            let change = (amountCollected - totalPrice).toFixed(2);
            let looseChange = checkIfPossibleToGiveExactChange(change) // Distribute change into various denominations available
            let looseChangeAllDenomsAvailable = true; //Do we have quantity > 1 for all denominations ?

            looseChange.map(({denom, quantity: changeQuantity}) => { // Check against required quantity and available ones
                if (looseChangeAllDenomsAvailable) {
                    let ky_idx = Object.keys(getObject('coins')).indexOf(denom);
                    let denomDetails = Object.values(getObject('coins'))[ky_idx];
                    if (ky_idx < 0) {
                        return looseChangeAllDenomsAvailable = false;
                    }
                    if (denomDetails.quantity < changeQuantity) {
                        return looseChangeAllDenomsAvailable = false;
                    }
                    //deduct this quantity of change from the available coins.
                    setCoins({"denomination": denom, "quantity": denomDetails.quantity - changeQuantity});

                }
            })
            if (!looseChangeAllDenomsAvailable) { //If 0 or not enough quantity of any denomination required
                return res.status(200).json({
                    status: 'error', message: 'Purchase Failed. Change not available', change, looseChange
                })
            }
            if (looseChange.length >= 1) { // If there is some change to give, after all checks for denomination availability have passed above
                return res.status(200).json({
                    status: 'success', message: 'Purchase Successful. Change Available', looseChange
                })
            }
        } else {
            return res.status(200).json({status: 'success', message: 'Purchase Successful. No change required'})
        }

    }
})


module.exports = router;