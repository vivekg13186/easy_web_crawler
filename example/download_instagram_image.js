var _ = require('lodash');
var Scraper = require('../index.js')


async function main(searchfor) {
    var scraper = new Scraper();
    scraper.startWithURLs("https://www.instagram.com/"+searchfor+"/?hl=en")
    scraper.callbackOnPageLoad(async function (page) {
        var result = []
        var prev=[]
        for (var j = 0; j < 10000; j++) {
            var now=[]
            await page.evaluate(x => {
                window.scrollBy(0, document.body.scrollHeight);
            }, 0);
            await page.waitFor(1000);
            try {
                var elems = await page.$$('img.FFVAD')
                for (var i = 0; i < elems.length; i++) {
                    var elem = elems[i]
                    img = await page.evaluate(body => body.getAttribute("src"), elem);
                    now.push(img)
                }
            } catch (e) { }
            /* check if new items loaded */
            if(_.isEqual(now.sort(), prev.sort())){
                break;
            }else{
                prev=now;
                result=result.concat(now)
            }
            console.log("loop "+j)
        }
        result = _.uniq(result);
        for(var i=0;i<result.length;i++){
            var url = result[i]
            var file_path = "/Users/vivek/Documents/GitHub/simple_web_crawler/example/download/danbilzerian/"+searchfor+i+".png"
            page.download_image(url,file_path);
            //console.log(url,file_path)
        }
        
        //page.write_text_to_file(JSON.stringify(result), "./example/result.json")
    });
    scraper.callbackOnFinish(function (result) {
        ;
    })
    await scraper.start()
}

main('')
