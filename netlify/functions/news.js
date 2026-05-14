const Parser = require('rss-parser');

const parser = new Parser();

exports.handler = async function(event){

 try{

  const cat =
   event.queryStringParameters.cat || 'telangana';

  const feeds = {

   telangana:
   'https://news.google.com/rss/search?q=Telangana+Telugu&hl=en-IN&gl=IN&ceid=IN:en',

   ap:
   'https://news.google.com/rss/search?q=Andhra+Pradesh+Telugu&hl=en-IN&gl=IN&ceid=IN:en',

   sports:
   'https://news.google.com/rss/search?q=Sports+Telugu&hl=en-IN&gl=IN&ceid=IN:en',

   cinema:
   'https://news.google.com/rss/search?q=Tollywood&hl=en-IN&gl=IN&ceid=IN:en'

  };

  const feed = await parser.parseURL(feeds[cat]);

  return {

   statusCode:200,

   headers:{
    'Access-Control-Allow-Origin':'*',
    'Content-Type':'application/json'
   },

   body:JSON.stringify({

    items: feed.items.map(x=>({

     title:x.title,
     link:x.link,
     pubDate:x.pubDate

    }))

   })

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