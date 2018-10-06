# easy_web_crawler [![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/easy_web_crawler/Lobby)

Web crawler around puppeteer to crawler ajax/java script enabled pages.Check out example folder for how to use

# Features!

  - Support crawling of javascript/ajax pages
  - url filter
  - avoid duplicate urls
  - delay before page load
  - custom data extraction
  - build in spider
  - stop and resume the crawling
  - fast image download

# Documentation
[Read full documentation here](https://vivekg13186.github.io/easy_web_crawler/)


   
    
### USAGE

```
var Scraper = require("easy_web_crawler")

async function main() {

    var scraper = new Scraper();
    scraper.startWithURLs("start_url")
    scraper.allowIfMatches(function (url) { <<some true false logic here>> })
    scraper.enableAutoCrawler(true)
    scraper.saveProgressInFile("hello.db")
    scraper.waitBetweenPageLoad(0)
    scraper.callbackOnPageLoad(async function (page) {
        <<logic here>>
    });
    scraper.callbackOnFinish(function (result) {
        console.log(JSON.stringify(result,null,4))
    })
    await scraper.start()
}

main()

```



License
----

MIT
