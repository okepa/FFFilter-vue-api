const mongoose = require('mongoose');

var FanfictionSchema = mongoose.Schema({
    fanfiction: String,
    medium: String,
    ffid: String
});

module.exports = mongoose.model('Fanfiction', FanfictionSchema);