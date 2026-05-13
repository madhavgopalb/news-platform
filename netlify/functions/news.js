const Parser = require('rss-parser');
const parser = new Parser();

const CACHE = {};
const TTL = 60 * 1000;

const FEEDS = {
 telangana:'https://news.google.com/rss/search?q=Telangana+Telugu&hl=en-IN&gl=IN&ceid=IN:en',
 ap:'https://news.google.com/rss/search?q=Andhra+Pradesh+Telugu&hl=en-IN&gl=IN&ceid=IN:en',
 sports:'https://news.google.com/rss/search?q=Sports+Telugu&hl=en-IN&gl=IN&ceid=IN:en',
 cinema:'https://news.google.com/rss/search?q=Tollywood&hl=en-IN&gl=IN&ceid=IN:en'
};

exports.handler = async function(event){

 try{

  const cat = event.queryStringParameters.cat || 'telangana';

  if(
   CACHE[cat] &&
   Date.now() - CACHE[cat].time < TTL
  ){
   return {
    statusCode:200,
    headers:{
     'Access-Control-Allow-Origin':'*',
     'Cache-Control':'no-store',
     'Content-Type':'application/json'
    },
    body:JSON.stringify(CACHE[cat].data)
   };
  }

  const feed = await parser.parseURL(FEEDS[cat]);

  const items = feed.items.map(x=>({
   title:x.title,
   link:x.link,
   pubDate:x.pubDate,
   img:''
  }));

  const data = {
   status:'ok',
   cat,
   items
  };

  CACHE[cat] = {
   time:Date.now(),
   data
  };

  return {
   statusCode:200,
   headers:{
    'Access-Control-Allow-Origin':'*',
    'Cache-Control':'no-store',
    'Content-Type':'application/json'
   },
   body:JSON.stringify(data)
  };

 }catch(err){

  return {
   statusCode:500,
   body:JSON.stringify({
    error:String(err)
   })
  };
 }
};