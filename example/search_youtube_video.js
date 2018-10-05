var Scraper = require('../index1.js')

function9=`
var result=[]
document.querySelectorAll('ytd-video-renderer').forEach(function (e) {
    var title = e.querySelector('#video-title').innerHTML
    var img = e.querySelector('#img').getAttribute('src')
    result.push({title :title,img :img})
  })
  result;
`


async function main(searchfor) {

    var scraper = new Scraper();
    scraper.startWithURLs("https://www.youtube.com/results?search_query="+searchfor)
    //scraper.saveProgressInFile("./example/video.db")
    scraper.waitBetweenPageLoad(0)
    scraper.callbackOnPageLoad(async function (page) {

        console.log("PAGI")
        var result=[]
        for(var i=0;i<100;i++){
            await page.waitFor(500);
            await page.evaluate(x => {
                window.scrollBy(0, x);
            },i*1000);
        }
       
        
            var elems = await page.$$('ytd-video-renderer')
            for(var i=0;i<elems.length;i++){
                var elem = elems[i]
                var title = await elem.$('#video-title')
                var img = await elem.$('#img')
                 title = await page.evaluate(body => body.innerHTML, title);
                 img = await page.evaluate(body => body.getAttribute("src"), img);
                 result.push({title:title.trim(),img:img})
            }
            console.log("((((((((((((((((( ",result.length)
            page.saveResult(result)

           
           /* for(var i=0;i<elem.length;i++){
                var e = elem[i];
                var title = e.querySelector('#video-title').innerHTML
                var img = e.querySelector('#img').getAttribute('src')
                console.log(title,img);
            }*/

          
    });
    scraper.callbackOnFinish(function (result) {
        console.log(JSON.stringify(result,null,4))
    })
    await scraper.start()
}

main('tamil songs')
