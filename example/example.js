/*
Install new version for this example
npm i --save puppeteer@next
*/

var crawler = require('../index.js')

var config = {
    start_urls: ["https://edition.cnn.com/travel/destinations"],
    allow_urls: function(url){ return url.indexOf("destinations")>-1; },
    run_spider: true,
    delay :100,
    oncomplete:function(){
        console.log("completed")
    },
    data_extract:  async function (page) {
                var title = await page.$eval('.Destination__title', tag => tag.innerText);
                var desc = await page.$eval('.Destination__description', tag => tag.innerText);
                //console.log(title,desc);
                page.write_text_to_file(desc, "./" + title + ".txt")
            }
}

crawler(config)