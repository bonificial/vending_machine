var express = require('express');
const {setItemsNumber, getAllItems, getObject, setCoins} = require("../utils/storage");
const {denominations} = require("../utils/denominations");
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Welcome to XYZ Vending Machine', subtitle: 'Please run requests from an API Client'});
});
router.put('/slot/items', async (req, res) => {
    //   let {itemName,  quantity,price } = req.body;
    console.log(req.body)
    if(!req.body.itemName || !req.body.quantity || !req.body.price){
       return res.status(200).json({ status: 'error',
            message: "Please provide the itemName,  quantity and price "})
    }
    setItemsNumber(req.body);
    let items = await getObject('items');
    res.status(200).json(items)
})
router.get('/slot/items', async (req, res) => {
    let items = await getObject('items');
   return res.status(200).json(items)
})
router.put('/coins', async (req, res) => {
    if(!req.body.denomination || !req.body.quantity  ){
       return res.status(200).json({ status: 'error',
            message: "Please provide the denomination and quantity  "})
    }

    if (Object.keys(denominations).indexOf(req.body.denomination) > -1) {
        setCoins(req.body);
        let coins = await getObject('coins');
        res.status(200).json(coins)
    } else {
        let coins = await getObject('coins');
        res.status(200).json({
            status: 'error',
            message: "An invalid Denomination was set. See valid denominations in list.",
            data: coins
        })
    }
})
router.get('/coins', async (req, res) => {
    let coins = await getObject('coins');
    res.status(200).json(coins)
})

module.exports = router;
