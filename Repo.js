var fs = require('fs');
var _ = require('lodash');
var Database = require('better-sqlite3');

class RepoInterface {
    addURLS(new_urls) { }
    finishURL(url, data) { }
    failURL(url, data) { }
    getNextURL() { }
    getAll() { }
}


class Repo extends RepoInterface {
    constructor(filename) {
        super()
        if (filename)
            this._db = new Database(filename)
        else
            this._db = new Database('memory', { memory: true })
        this._db.prepare('create table if not EXISTs SESSIONS (URL TEXT PRIMARY KEY,START_TIME INTEGER,END_TIME INTEGER,STATUS TEXT,RESULT TEXT)').run()
        this.selectAllstmt = this._db.prepare("SELECT * FROM SESSIONS");
        this.insertstmt = this._db.prepare("INSERT OR IGNORE INTO SESSIONS (URL,STATUS) VALUES (@url,'q')");
        this.selectstmt = this._db.prepare("SELECT URL FROM SESSIONS where status ='q' LIMIT 1");
        this.updatestatus_start = this._db.prepare("UPDATE SESSIONS SET STATUS = @status, START_TIME = @start_time WHERE URL=@url");
        this.updatestatus_end = this._db.prepare("UPDATE SESSIONS SET STATUS = @status, END_TIME = @end_time ,RESULT =@result WHERE URL=@url");

    }

    addURLS(new_urls) {
        var db = this._db;
        new_urls = _.uniq(_.concat(new_urls))
        for(var i=0;i<new_urls.length;i++){
            var data  = { url : new_urls[i]}
            //console.log("queue add ", new_urls[i])
            this.insertstmt.run(data)
        }
        
    }

   
    finishURL(url, data) {
        console.log("queue finish ", url)
        this.updatestatus_end.run({
            status :'f',end_time:new Date().getTime() ,url:url,result:data
        })
    }
    failURL(url, data) {
        console.log("queue fail ", url)
        this.updatestatus_end.run({
            status :'e',end_time:new Date().getTime() ,url:url,result:data
        })
    }
    getNextURL() {
        var url = this.selectstmt.get();

        if(url){
            url = url.URL
            this.updatestatus_start.run({
                status :'p',start_time:new Date().getTime() ,url:url
            })
        }
        return url
        
    }
    getAll() {
       return this.selectAllstmt.all()
    }

}

module.exports = Repo