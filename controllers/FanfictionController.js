const Fanfiction = require('../models/Fanfiction');
const Favorites = require('../models/Favorites');

class FanfictionController {
    //Load the fanfiction onto the page
    static getFanfiction(req, res) {
        Fanfiction.find({}, (err, fanfiction) => {
            if (err) {
                res.status(400).send({
                    success: err.message,
                    headers: {'Access-Control-Allow-Origin': '*'}
                });
            } else {
                 res.status(200).set({ headers: {'Access-Control-Allow-Origin': '*'}}).send({
                     success: fanfiction,
                 })
            }
        });
    }
}

module.exports = FanfictionController;