const Fanfiction = require('../models/Fanfiction');
const Favorites = require('../models/Favorites');

class CrossoversService {
    static linkGeneration(req, ff1, ff2, fanfiction1, fanfiction2) {
        return new Promise((resolve, reject) => {
            let ff1Id = parseInt(ff1.ffid);
            let ff2Id;
            if (fanfiction2 == "All") {
                ff2Id = 0;
            } else {
                ff2Id = parseInt(ff2.ffid);
                if (ff1Id < ff2Id) {
                    ff1Id = ff1.ffid;
                    if (fanfiction2 == "All") {
                        ff2Id = 0;
                    } else {
                        ff2Id = ff2.ffid;
                    }
                } else {
                    ff2Id = ff1.ffid;
                    if (fanfiction2 == "All") {
                        ff1Id = 0;
                    } else {
                        ff1Id = ff2.ffid;
                    }
                }
            }
            let sort;
            //select the sort or default 5
            if (req.query.s == null) {
                sort = 4;
            } else {
                sort = req.query.s;
            }
            //get the time of the fics from the url
            let time;
            //select the sort or default 5
            if (req.query.t == null) {
                time = 4;
            } else {
                time = req.query.t;
            }
            //Gets the page from the url
            let page;
            //Select the page or default to 1
            if (req.query.p == null) {
                page = 1;
            } else {
                page = req.query.p;
            }
            if (fanfiction2 == "All") {
                //get fanfiction1
                Favorites.find({}, (err, favorites1) => {
                    if (err) {
                        reject(err);
                    } else {
                        let favorites = favorites1;
                        CrossoversService.stringReplacement(fanfiction1, fanfiction2)
                        .then((response) => {
                            if (time == 99) {
                                resolve({ favorites: favorites, link: `https://www.fanfiction.net/${response.fanfiction1}-and-${response.fanfiction2}-Crossovers/${ff1Id}/${ff2Id}/?&srt=${sort}&lan=1&r=10&len=20&p=${page}` });
                            } else {
                                resolve({ favorites: favorites, link: `https://www.fanfiction.net/${response.fanfiction1}-and-${response.fanfiction2}-Crossovers/${ff1Id}/${ff2Id}/?&srt=${sort}&lan=1&r=10&len=20&t=${time}&p=${page}` });
                            }
                        }).catch(err => {
                            reject(err.message)
                        });
                    }
                }).catch(err => {
                    reject(err.message)
                });
            } else {
                //get fanfiction1
                Favorites.find({ "fanfiction": fanfiction1 }, (err, favorites1) => {
                    if (err) {
                        reject(err); 
                    } else {
                        //get fanfiction2
                        Favorites.find({ "fanfiction": fanfiction2 }, (err, favorites2) => {
                            if (err) {
                                reject(err);
                            } else {
                                //combine the two arrays together
                                let favorites = favorites1.concat(favorites2);
                                CrossoversService.stringReplacement(fanfiction1, fanfiction2)
                                    .then((response) => {
                                        if (time == 99) {
                                            resolve({ favorites: favorites, link: `https://www.fanfiction.net/${response.fanfiction1}-and-${response.fanfiction2}-Crossovers/${ff1Id}/${ff2Id}/?&srt=${sort}&lan=1&r=10&len=20&p=${page}` });
                                        } else {
                                            resolve({ favorites: favorites, link: `https://www.fanfiction.net/${response.fanfiction1}-and-${response.fanfiction2}-Crossovers/${ff1Id}/${ff2Id}/?&srt=${sort}&lan=1&r=10&len=20&t=${time}&p=${page}` });
                                        }
                                    }).catch(err => {
                                        reject(err.message)
                                    });
                            }
                        }).catch(err => {
                            reject(err.message)
                        });
                    }
                }).catch(err => {
                    reject(err.message)
                });
            }
        });
    }

    static stringReplacement(fanfiction1, fanfiction2) {
        return new Promise((resolve, reject) => {
            fanfiction1 = fanfiction1.replace(/ /g, "-");
            fanfiction1 = fanfiction1.replace("/", "-");
            fanfiction1 = fanfiction1.replace("×", "-");
            fanfiction1 = fanfiction1.replace("é", "e");
            if (fanfiction1 == "High-School-DxD-ハイスクールD-D") {
                fanfiction1 = "High-School-DxD-%E3%83%8F%E3%82%A4%E3%82%B9%E3%82%AF%E3%83%BC%E3%83%ABD-D";
            }
            if (fanfiction1 == "Akame-ga-Kiru-アカメが斬る") {
                fanfiction1 = "Akame-ga-Kiru-%E3%82%A2%E3%82%AB%E3%83%A1%E3%81%8C%E6%96%AC%E3%82%8B";
            }
            if (fanfiction1 == "Tokyo-Ghoul-東京喰種トーキョーグール") {
                fanfiction1 = "Tokyo-Ghoul-%E6%9D%B1%E4%BA%AC%E5%96%B0%E7%A8%AE%E3%83%88%E3%83%BC%E3%82%AD%E3%83%A7%E3%83%BC%E3%82%B0%E3%83%BC%E3%83%AB";
            }
            fanfiction2 = fanfiction2.replace(/ /g, "-");
            fanfiction2 = fanfiction2.replace("/", "-");
            fanfiction2 = fanfiction2.replace("×", "-");
            fanfiction2 = fanfiction2.replace("é", "e");
            if (fanfiction2 == "High-School-DxD-ハイスクールD-D") {
                fanfiction2 = "High-School-DxD-%E3%83%8F%E3%82%A4%E3%82%B9%E3%82%AF%E3%83%BC%E3%83%ABD-D";
            }
            if (fanfiction2 == "Akame-ga-Kiru-アカメが斬る") {
                fanfiction2 = "Akame-ga-Kiru-%E3%82%A2%E3%82%AB%E3%83%A1%E3%81%8C%E6%96%AC%E3%82%8B";
            }
            if (fanfiction2 == "Tokyo-Ghoul-東京喰種トーキョーグール") {
                fanfiction2 = "Tokyo-Ghoul-%E6%9D%B1%E4%BA%AC%E5%96%B0%E7%A8%AE%E3%83%88%E3%83%BC%E3%82%AD%E3%83%A7%E3%83%BC%E3%82%B0%E3%83%BC%E3%83%AB";
            }
            resolve({ fanfiction1: fanfiction1, fanfiction2: fanfiction2 });
        });
    }
}

module.exports = CrossoversService;