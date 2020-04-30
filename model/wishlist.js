var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

var wishlist = new Schema({
    title:{type:String,default:"cool wish list"},
    products:[{type:ObjectId, ref:'Product'}]
});

module.exports = mongoose.model('WishList',wishlist);