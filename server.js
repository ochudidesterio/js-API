var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Product = require('./model/products');
var WishList = require('./model/wishlist');

var db = mongoose.connect('mongodb://localhost/online-shop');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.post('/product', function (request, response) {
    var product = new Product(request.body);
    product.title = request.body.title;
    product.price = request.body.price;

    product.save(function (err, savedProduct) {
        if (err) {
            response.status(500).send({
                error: "could not save the product"
            });
        } else {
            response.status(200).send(savedProduct);
        }
    });
});


app.get('/product', function (request, response) {
    Product.find({}, function (err, products) {
        if (err) {
            response.status(500).send({
                error: "could not fetch products"
            });
        } else {
            response.status(200).send(products);
        }
    });
});

app.post('/wishlist', function (request, response) {
    var wishlist = new WishList();
    wishlist.title = request.body.title;
    wishlist.save(function (err, newWishlist) {
        if (err) {
            response.status(500).send({
                error: "could not creta wishlist"
            });
        } else {
            response.send(newWishlist);
        }
    });
});
app.put('/wishlist/product/add', function (request, response) {
    Product.findOne({
        _id: request.body.productId
    }, function (err, product) {
        if (err) {
            response.status(500).send({
                error: "could not add item to lists"
            });
        } else {
            WishList.update({
                _id: request.body.wishListId
            }, {
                $addToSet: {
                    products: product._id
                }
            }, function (err, wishList) {
                if (err) {
                    response.status(500).send({
                        error: "could not add item to lists"
                    });
                }else{
                    response.send(wishList)
                }
            })
        }
    })
})
app.get('/wishlist', function (request, response) {
    WishList.find({}, function (err, wishLists) {
        if (err) {
            response.status(500).send({
                error: "could notfetch lists"
            })
        }else{
            response.send(wishLists)
        }
    })
});
app.listen(3000, function () {
    console.log("online shop api running on port 3000");
});