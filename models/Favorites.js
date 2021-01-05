const mongoose = require('mongoose');

var FavoritesSchema = mongoose.Schema({
    title: {
        type: String,
        unique: true
    }  ,
    fanfiction: String 
});

module.exports = mongoose.model('Favorites', FavoritesSchema);