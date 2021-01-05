const Fanfiction = require('../models/Fanfiction');
const Favorites = require('../models/Favorites');
const FicsService = require('../lib/FicsService')
const scraperjs = require('scraperjs');

class FicsController {

    //Scrape all the fics for the selected fanfiction
    static getFics(req, res) {
        let favorite = false;
        let finalArray = [];
        let finalObject = new Object();
        let count = 20;
        let noUpdate = false;
        let noReview = false;
        //Select what the medium is by doing a find
        Fanfiction.findOne({ "fanfiction": req.query.f }, (err, fm) => {
            if (err) {
                reject(err);
            } else {
                var link = FicsService.linkGeneration(fm, req)
                Favorites.find({ "fanfiction": req.query.f }, (err, favorites) => {
                    if (err) {
                        reject(err);
                    } else {
                        scraperjs.StaticScraper.create(link)
                            .scrape(($) => {
                                return $(".z-list.zhover.zpointer *").map(function () {
                                    let scrapeArray = [];
                                    var text = $(this).text();
                                    var href = $(this).attr("href");
                                    scrapeArray.push(text);
                                    scrapeArray.push(href);
                                    return scrapeArray;
                                }).get();
                            })
                            .then((info) => {
                                for (let i in info) {
                                    for (let j in favorites) {
                                        if (info[i] == favorites[j].title && count % 20 == 0) {
                                            favorite = true;
                                        }
                                    }
                                    if (favorite == true) {
                                        if (count % 20 == 19) {
                                            favorite = false;
                                        } else {
                                            favorite = true;
                                        }
                                    }
                                    //Fixes if the fic doesn't have an update
                                    else if ((count % 20 == 4 && info[i] != "") || noUpdate == true) {
                                        noUpdate = true;
                                        //0 - already done

                                        //1 - already done

                                        //8 - now 4
                                        if (count % 20 == 4) {
                                            finalObject.author = info[i];
                                        }
                                        //9 - now 5
                                        if (count % 20 == 5) {
                                            finalObject.authorUrl = info[i];
                                        }
                                        //12 - now 8
                                        if (count % 20 == 8) {
                                            finalObject.description = info[i];
                                            finalArray.push(finalObject);
                                            finalObject = new Object();
                                        }
                                        if (count % 20 == 13) {
                                            noUpdate = false;
                                            count = 19;
                                            favorite = false;
                                        }
                                    }
                                    //Fixes if the fic doesnt have a review
                                    else if ((count % 20 == 10 && info[i] != "reviews") || noReview == true) {
                                        noReview = true;
                                        //0 - already done
                                        //1 - already done
                                        //8 - already done
                                        //9 - already done
                                        //12 - now 10
                                        if (count % 20 == 10) {
                                            finalObject.description = info[i];
                                            finalArray.push(finalObject);
                                            finalObject = new Object();
                                        }
                                        if (count % 20 == 17) {
                                            noReview = false;
                                            count = 19;
                                            favorite = false;
                                        }
                                    }
                                    else if (noUpdate == false && noReview == false && (count % 20 == 0 || count % 20 == 1 || count % 20 == 8 || count % 20 == 9 || count % 20 == 12)) {
                                        if (count % 20 == 0) {
                                            finalObject.title = info[i];
                                        }
                                        if (count % 20 == 1) {
                                            finalObject.titleUrl = info[i];
                                        }
                                        if (count % 20 == 8) {
                                            finalObject.author = info[i];
                                        }
                                        if (count % 20 == 9) {
                                            finalObject.authorUrl = info[i];
                                        }
                                        if (count % 20 == 12) {
                                            finalObject.description = info[i];
                                            finalArray.push(finalObject);
                                            finalObject = new Object();
                                        }
                                    }
                                    count++;
                                }
                                res.status(200).set({ headers: { 'Access-Control-Allow-Origin': '*' } }).send({
                                    success: finalArray,
                                })
                            });
                    }
                });
            }
        });
    }
}

module.exports = FicsController;