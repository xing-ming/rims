module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    // add item
    this.add = function (item, id) {
        let stored_item = this.items[id];
        if(!stored_item) {
            stored_item = this.items[id] = { item: item, qty: 0, item_price: 0 };
        }
        stored_item.qty++;
        stored_item.item_price = stored_item.item.item_price * stored_item.qty;
        this.totalQty++;
        this.totalPrice += stored_item.item.item_price;
    };

    // reduce item by one
    this.reduceByOne = function (id) {
        this.items[id].qty--;
        this.items[id].item_price -= this.items[id].item.item_price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.item_price;

        if(this.items[id].qty === 0) {
            delete this.items[id];
        }
    };

    // remove all item in cart
    this.removeAll = function (id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].item_price;
        delete this.items[id];
    };

    // store item as array
    this.generateArray = function() {
        let arr = [];
        for(let id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    }
};