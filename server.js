var express = require("express");
var exphbs = require('express-handlebars')
var cheerio = require("cheerio");
var request = require("request");
var PORT = process.env.PORT || 3000;
var path = require('path');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get('/', function(req, res) {
 
  res.render('index');

});



// First, tell the console what server.js is doing
console.log("\n***********************************\n" +
            "Grabbing what i need\n" +
            "from digg's news site:" +
            "\n***********************************\n");

// Making a request for diggs website html. 
request("http://digg.com", function(error, response, html) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(html);
 
  // An empty array to save the data that we'll scrape
  var results = [];

  // With cheerio, find each p-tag with the "title" class
  // (i: iterator. element: the current element)
  $("a.digg-story__title-link").each(function(i, element) {
    // Save the text of the element in a "title" variable
    if(i > 15){
      return false;
    }
    var title = $(element).text();
      
    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have
    var link = $(element).attr("href");

    var summary = $(element).parent().parent().parent().find("div.entry-content").text();

    // Save these results in an object that we'll push into the results array we defined earlier
      title = title.replace(/(\r\n|\n|\r)/gm," ");
      summary = summary.replace(/(\r\n|\n|\r)/gm," ");

    results.push({
      title: title,
      link: link,
      summary: summary
    });
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});

app.listen(PORT, function() {
  console.log("News is being broadcasted on " + PORT);
});