const Parser = require('rss-parser');
const parser = new Parser();

const CACHE = {};
const TTL = 5 * 60 * 1000;

const FEEDS = {
 telangana:'https://news.google.com/rss/search?q=Telangana+Telugu',
 ap:'https://news.google.com/rss/search?q=Andhra+Pradesh+Telugu',
 sports:'https://news.google.com/rss/search?q=Sports+Telugu'
};

exports.handler = function(event, context, callback){

 const cat = event.queryStringParameters.cat || 'telangana';

 if(CACHE[cat] && Date.now() - CACHE[cat].time < TTL){
  return callback(null,{
   statusCode:200,
   headers:{
    'Access-Control-Allow-Origin':'*',
    'Content-Type':'application/json'
   },
   body:JSON.stringify(CACHE[cat].data)
  });
 }

 parser.parseURL(FEEDS[cat])
 .then(feed=>{

  const data = {
   status:'ok',
   items: feed.items.map(x=>({
    title:x.title,
    link:x.link,
    pubDate:x.pubDate
   }))
  };

  CACHE[cat] = {
   time:Date.now(),
   data
  };

  callback(null,{
   statusCode:200,
   headers:{
    'Access-Control-Allow-Origin':'*',
    'Content-Type':'application/json'
   },
   body:JSON.stringify(data)
  });

 })
 .catch(err=>{
  callback(null,{
   statusCode:500,
   body:JSON.stringify({error:String(err)})
  });
 });

};
