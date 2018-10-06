var Scraper = require('../index.js')
var isArrayEqual = function(x, y) {
    return _(x).xorWith(y, _.isEqual).isEmpty();
  };
  var _ = require('lodash');
async function main(searchfor) {
    var scraper = new Scraper();
    scraper.startWithURLs("https://www.youtube.com/results?search_query=" + searchfor)
    scraper.waitBetweenPageLoad(0)
    scraper.callbackOnPageLoad(async function (page) {
        var result = []
        var prev = []
        for (var j = 0; j < 150; j++) {
            var now = []
            await page.evaluate(x => {
                window.scrollBy(0, document.body.scrollHeight);
            }, 0);
            await page.waitFor(1000);
            try {
                var elems = await page.$$('ytd-video-renderer')
                for (var i = 0; i < elems.length; i++) {
                    var elem = elems[i]
                    var title = await elem.$('#video-title')
                    var img = await elem.$('#img')
                    title = await page.evaluate(body => body.innerHTML, title);
                    img = await page.evaluate(body => body.getAttribute("src"), img);
                    now.push({ title: title.trim(), img: img })
                }
            } catch (e) { }
            /* check if new items loaded */
            if (false && isArrayEqual(now, prev)) {
                break;
            } else {
                prev = now;
                result = result.concat(now)
            }
            console.log("loop " + j)
        }
        result = _.uniqBy(result,_.isEqual)
       // result = _.filter(result, function(o) { return !o.img==null; });;
        page.write_text_to_file(JSON.stringify(result), "./example/result.json")
    });
    scraper.callbackOnFinish(function (result) {
        ;
    })
    await scraper.start()
}

main('tamil songs')
