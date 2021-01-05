const Fanfiction = require('../models/Fanfiction');
const Favorites = require('../models/Favorites');

class FicsService {
    static linkGeneration(fm, req) {
        //Gets the medium for the database
        let medium = fm.medium;
        //Gets the fanfiction from the url
        let fanfiction = req.query.f;
        //get the sort of the fics from the url
        let sort;
        //get the time of the fics from the url
        let time;
        //Gets the page from the url
        let page;
        //select the sort or default 5
        if (req.query.s == null) {
            sort = 4;
        } else {
            sort = req.query.s;
        }

        //select the sort or default 5
        if (req.query.t == null) {
            time = 4;
        } else {
            time = req.query.t;
        }

        //Select the page or default to 1
        if (req.query.p == null) {
            page = 1;
        } else {
            page = req.query.p;
        }
        fanfiction = fanfiction.replace(/ /g, "-");
        fanfiction = fanfiction.replace("/", "-");
        fanfiction = fanfiction.replace("×", "-");
        fanfiction = fanfiction.replace("é", "e");
        if (fanfiction == "High-School-DxD-ハイスクールD-D") {
            fanfiction = "High-School-DxD-%E3%83%8F%E3%82%A4%E3%82%B9%E3%82%AF%E3%83%BC%E3%83%ABD-D";
        }
        if (fanfiction == "Akame-ga-Kiru-アカメが斬る") {
            fanfiction = "Akame-ga-Kiru-%E3%82%A2%E3%82%AB%E3%83%A1%E3%81%8C%E6%96%AC%E3%82%8B";
        }
        if (fanfiction == "Tokyo-Ghoul-東京喰種トーキョーグール") {
            fanfiction = "Tokyo-Ghoul-%E6%9D%B1%E4%BA%AC%E5%96%B0%E7%A8%AE%E3%83%88%E3%83%BC%E3%82%AD%E3%83%A7%E3%83%BC%E3%82%B0%E3%83%BC%E3%83%AB";
        }
        if (time == 99) {
            return `https://www.fanfiction.net/${medium}/${fanfiction}/?&srt=${sort}&lan=1&r=10&len=20&p=${page}`;
        } else {
            return `https://www.fanfiction.net/${medium}/${fanfiction}/?&srt=${sort}&lan=1&r=10&len=20&t=${time}&p=${page}`;
        }
    }
}

module.exports = FicsService;