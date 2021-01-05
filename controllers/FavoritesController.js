const Favorites = require('../models/Favorites');
const Fanfiction = require('../models/Fanfiction')

class FavoritesController {
    //Load the favorites page
    static getAddToFavorites(req, res) {
        Favorites.find({}, (err, favorites) => {
            if (err) {
                reject(err);
            } else {
                Fanfiction.find({}, (err, fanfiction) => {
                    if (err) {
                        reject(err);
                    } else {
                        res.status(200).set({ headers: { 'Access-Control-Allow-Origin': '*' } }).send({
                            favorites: favorites,
                            fanfiction: fanfiction,
                        });
                    }
                });
            }
        })
    }
    //Activate when the add to favorites button is pressed
    static addToFavorites(req, res) {
        Favorites.findOne({ "title": req.body.title }, (err, findFavorites) => {
            if (err) {
                res.status(400).send(err.message);
            } else {
                if (findFavorites == null && req.body.title != "") {
                    //if the fic is not found then add it to the database
                    Favorites.create(req.body, (err, createFavorites) => {
                        if (err) {
                            res.status(400).send(err.message);
                        } else {
                            Favorites.find({}, (err, favorites) => {
                                if (err) {
                                    res.status(400).send(err.message);
                                } else {
                                    Fanfiction.find({}, (err, fanfiction) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            res.status(200).set({ headers: { 'Access-Control-Allow-Origin': '*' } }).send({
                                                favorites: favorites,
                                                fanfiction: fanfiction,
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else {
                    res.status(400).send({
                        error: "This fic is already in you favorites"
                    });
                }
            }
        });
    }
}

module.exports = FavoritesController;