var Scraper = require('../index1.js')

async function main() {

    var scraper = new Scraper();
    scraper.startWithURLs("https://edition.cnn.com/travel/destinations")
    scraper.allowIfMatches(function (url) { return url.indexOf("destinations") > -1; })
    scraper.enableAutoCrawler(true)
    scraper.saveProgressInFile("hello.db")
    scraper.waitBetweenPageLoad(0)
    scraper.callbackOnPageLoad(async function (page) {
        var title = await page.$eval('.Destination__title', tag => tag.innerText);
        var desc = await page.$eval('.Destination__description', tag => tag.innerText);
        page.saveResult(desc)
    });
    scraper.callbackOnFinish(function (result) {
        console.log(JSON.stringify(result,null,4))
    })
    await scraper.start()
}

main()
