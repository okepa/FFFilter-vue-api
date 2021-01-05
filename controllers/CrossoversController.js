const Fanfiction = require('../models/Fanfiction');
const Favorites = require('../models/Favorites');
const CrossoversService = require('../lib/CrossoversService')
const scraperjs = require('scraperjs');

class CrossoversController {
    //Scrape all the fics for the selected fanfiction
    static getCrossovers(req, res) {
        let fanfiction = req.query.f;
        let fanfiction1 = fanfiction.split("-and-")[0];
        let fanfiction2 = fanfiction.split("-and-")[1];
        let favorite = false;
        let finalArray = new Array();
        let finalObject = new Object();
        let count = 20;
        let noUpdate = false;
        let noReview = false;
        //get id of the first fanfiction
        Fanfiction.findOne({ "fanfiction": fanfiction1 }, (err, ff1) => {
            if (err) {
                reject(err);
            } else {
                //get id of the second fanfiction
                Fanfiction.findOne({ "fanfiction": fanfiction2 }, (err, ff2) => {
                    if (err) {
                        reject(err);
                    } else {
                        CrossoversService.linkGeneration(req, ff1, ff2, fanfiction1, fanfiction2)
                            .then((response) => {
                                scraperjs.StaticScraper.create(response.link)
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
                                            for (let j in response.favorites) {
                                                if (info[i] == response.favorites[j].title && count % 20 == 0) {
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
                                        });
                                    });
                            }).catch(err => {
                                res.status(400).send({
                                    error: err.message
                                });
                            })
                    }
                });
            }
        });
    }
}

module.exports = CrossoversController;