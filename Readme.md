# Getting Started with the Vending Machine API

Import the collection "Vending Machine.postman_collection.json" into postman

1. Copy all the contents of the zip folder vending_machine_api into your pc

2. CD into that folder

3. Run `npm install` to install all required packages.

### RUN  `npm run dev`

Runs the app on localhost:3000

Usage:

1. GET Request - `localhost:3000/maintenance/slot/items` - Get all available items


2. PUT Request - `localhost:3000/maintenance/slot/items` - Add an item to list of available items
 `Params Example - {
   "itemName":"Sprite ",
   "quantity":190,
   "price":450
   }`


3. POST Request - `localhost:3000/services/buy` - Buy an item. Output will be appropriate messages to say if purchase was successful or not. A breakdown of change distribution will also be in the response.

    `Params Example - {
   "itemName":"Sprite ",
   "units":1,
   "amountCollected": 5
   }`


4. PUT Request - `localhost:3000/maintenance/coins` - Add coins

   `Params Example - {
   "denomination":"550P",
   "quantity":250
   }`


5. GET Request - `localhost:3000/maintenance/coins` - Get the Coins available
