var quotes = require("./quotes");

module.exports = {
    getPrice: function(location,items){
        items = items.split(",");
        totalPrice = 0;
        for (var i=0; i<items.length;i++){
            item = items[i];
            price = quotes[item][location];
            totalPrice+= price;
        }
        return totalPrice;
    }
}