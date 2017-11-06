var express = require('express');
var app = express();
var bodyPareser = require('body-parser');
var mongoose = require('mongoose');
//var db = mongoose.connect('mongo://localhost/swing-shop');
var db = mongoose.connect('mongodb://localhost/swing-shop', {
    useMongoClient: true,
});

var Product = require('./model/product');
var WishList = require('./model/wishList');

app.use(bodyPareser.json());
app.use(bodyPareser.urlencoded({
    extended: false
}));

app.post('/product', function (request, response) {
    var product = new Product();
    product.title = request.body.title;
    product.price = request.body.price;
    product.save(function (err, savedPro) {
        if (err) {
            response.status(500).send('Couldn\'t save the product');
        } else {
            response.status(200).send(savedPro);
        }
    });
});

app.get('/product', function (request, response) {
    Product.find({}, function (err, products) {
        if (err) {
            response.status(500).send('Couldn\'t find the products');
        } else {
            response.status(200).send(products);
        }
    });
});


app.get('/wishList', function(request, response){
    WishList.find({}).populate({path: 'products', model: 'Product'}).exec(function(err, wishList){
        if(err){
            response.status(500).send('Couldn\'t find the wishlists');
        } else{
            response.send(wishList)
        }
    });
});

app.post('/wishList', function(request, response){
    var wishlist = new WishList();
    wishlist.title = request.body.title;
    wishlist.save(function(err, newWishList){
        if(err){
            response.status(500).send('Couldn\'t save the wishlists');
        } else{
            response.status(200).send(newWishList);
        }
    })
});

app.put('/wishlist/product/add', function(request, response){
    Product.findOne({_id: request.body.productId}, function(err, product){
        if(err){
            response.status(500).send('Couldn\'t find the product');
        } else{
            WishList.update({_id: request.body.wishlistId}, {$addToSet: {products: product._id}}, function(err, wishList){
                if(err){
                    response.status(500).send('Couldn\'t add the product');
                } else{
                    response.send("Successfully added to wishlist");
                }
            });
        }
    });
});

app.listen(3000, function () {
    console.log('Swing Shop API listen on port 3000...');
});