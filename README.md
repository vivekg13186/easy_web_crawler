# easy_web_crawler

[![Join the chat at https://gitter.im/easy_web_crawler/Lobby](https://badges.gitter.im/easy_web_crawler/Lobby.svg)](https://gitter.im/easy_web_crawler/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Web crawler around puppeteer to crawler ajax/java script enabled pages.Check out example folder for how to use

# Features!

  - Support crawling of javascript/ajax pages
  - url filter
  - avoid duplicate urls
  - delay before page load
  - custom data extraction
  - build in spider
  - custom pattern based data extraction
  - stop and resume the crawling
  - fast image download

### USAGE

```
var crawler = require("easy_web_crawler")

var config =
{
     start_urls: [], //list of url to start with
     allow_urls: [], //list of regular expession ,only the urls matching the pattern are opened and processed
     run_spider: false,// (default false)if the flag set to yes crawler automatically extract the links form the page and add it to the queue(only if it matches above rule)
     delay :100,//(default 0ms) wait before loading new page (in milliseconds),
     canResume :true,//true it will load from previous state false start again.Default value true
     data_extract:async function (page) {
                /*page   - puppeteer page object 
                additional  function
                    page.add_url_to_queue(url) - add url to queue for processing
                    page.download_image(url,filename) - download image files ...
                    page.write_text_to_file(content, filename) - write text content to file
                    */
        }
    ]
}

crawler(config);

```
License
----

MIT
