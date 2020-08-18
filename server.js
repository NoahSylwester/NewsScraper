const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const moment = require('moment');
const sanitizeHtml = require('sanitize-html');

// var hbsObject = {
//   cats: data
// };
// console.log(hbsObject);
// res.render("index", hbsObject);

// Require all models
var db = require("./models");

const PORT = process.env.PORT || 8080;

// Initialize Express
const app = express();

// Set Handlebars.
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));


const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraperDatabase";

// // Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  let existingArticles;
  db.Article.find({})
    .then(function(dbArticle) {
      // make an array of article links
      existingArticles = dbArticle.map((article) => article.link);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
  // First, we grab the body of the html with axios
  axios.get("https://www.singularfortean.com/news/category/cryptid").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);


    // Now, we grab every h2 within an article tag, and do the following:
    $("article").each(function(i, element) {
      // Save an empty result object
      var result = {};
      if (!existingArticles.includes('https://www.singularfortean.com' + $(this).children("a").attr("href"))) {
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = 'https://www.singularfortean.com' + $(this)
        .children("a")
        .attr("href");
      result.datetime = moment($(this)
        .find(".BlogList-item-meta")
        .find('time')
        .attr('datetime')).format("YYYY-MM-DD");
      result.source = "Fortean News";

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
      }
    });

    // // Send a message to the client
    // res.send("Scrape Complete");
  }).then(function() {
    axios.get("https://www.disclose.tv/d/cryptozoology").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);


    // Now, we grab every h2 within an article tag, and do the following:
    $("div.teaser--masonry").each(function(i, element) {
      // Save an empty result object
      var result = {};
      if (!existingArticles.includes('https://www.disclose.tv' + $(this).find('.dont-break-out').children("a").attr("href"))) {
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .find('.dont-break-out')
        .children("a")
        .find('h3')
        .text();
      result.link = 'https://www.disclose.tv' + $(this)
        .find('.dont-break-out')
        .children("a")
        .attr("href");
      result.datetime = moment($(this)
        .find(".teaser-head")
        .find('.article-author__teaser-head')
        .find('.teaser-head-sub')
        .text()).format("YYYY-MM-DD");
      result.source = "Disclose.tv";

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
      }
    });

    // Send a message to the client
    // res.send("Scrape Complete");
  
  })
}).then(function() {
  axios.get("https://mysteriousuniverse.org/category/cryptozoology/").then(function(response) {
  // Then, we load that into cheerio and save it to $ for a shorthand selector
  var $ = cheerio.load(response.data);


  // Now, we grab every h2 within an article tag, and do the following:
  $("article").each(function(i, element) {
    // Save an empty result object
    var result = {};
    if (!existingArticles.includes($(this).find('.article-header').find('.entry-title').find('a').attr('href'))) {
    // Add the text and href of every link, and save them as properties of the result object
    result.title = $(this)
      .find('.article-header')
      .find('.entry-title')
      .find('a')
      .attr('title');
    result.link = $(this)
      .find('.article-header')
      .find('.entry-title')
      .find('a')
      .attr('href');
    result.datetime = moment($(this)
      .find('.article-header')
      .find('.byline')
      .find('time')
      .attr('datetime')).format("YYYY-MM-DD");
    result.source = "Mysterious Universe";

    // Create a new Article using the `result` object built from scraping
    db.Article.create(result)
      .then(function(dbArticle) {
        // View the added result in the console
        console.log(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, log it
        console.log(err);
      });
    }
  });

  // Send a message to the client
  // res.send("Scrape Complete");

})
}).then(function() {
  axios.get("http://bigfootevidence.blogspot.com/").then(function(response) {
  // Then, we load that into cheerio and save it to $ for a shorthand selector
  var $ = cheerio.load(response.data);


  // Now, we grab every h2 within an article tag, and do the following:
  $(".post-outer").each(function(i, element) {
    // Save an empty result object
    var result = {};
    if (!existingArticles.includes($(this).find('.post').find('.post-title').find('a').attr('href'))) {
    // Add the text and href of every link, and save them as properties of the result object
    result.title = $(this)
      .find('.post')
      .find('.post-title')
      .find('a')
      .text();
    result.link = $(this)
      .find('.post')
      .find('.post-title')
      .find('a')
      .attr('href');
    result.datetime = moment($(this)
      .find('.post')
      .find('.post-footer')
      .find('.post-footer-line')
      .find('.post-timestamp')
      .find('.timestamp-link')
      .find('abbr')
      .attr('title')).format("YYYY-MM-DD");
    result.source = "Bigfoot Evidence";
    result.summary = $(this)
    .find('.post')
    .find('.post-body')
    .find('div:nth-of-type(3)')
    .text();

    // Create a new Article using the `result` object built from scraping
    db.Article.create(result)
      .then(function(dbArticle) {
        // View the added result in the console
        console.log(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, log it
        console.log(err);
      });
    }
  });

  // Send a message to the client
  // res.send("Scrape Complete");

})
}).then(function() {
  axios.get("https://www.unexplained-mysteries.com/search.php").then(function(response) {
  // Then, we load that into cheerio and save it to $ for a shorthand selector
  var $ = cheerio.load(response.data);


  // Now, we grab every h2 within an article tag, and do the following:
  $(".fullwidthsubfull").each(function(i, element) {
    // Save an empty result object
    var result = {};
    if (!existingArticles.includes($(this).find('.bigheader').find('.blacklink').attr('href'))) {
    // Add the text and href of every link, and save them as properties of the result object
    result.title = $(this)
      .find('.bigheader')
      .find('.blacklink')
      .text()
    result.link = $(this)
      .find('.bigheader')
      .find('.blacklink')
      .attr('href');
    result.datetime = $(this)
      .find('span:nth-of-type(2)')
      .text();
    result.datetime = moment(result.datetime
      .slice(result.datetime.indexOf("|") + 12, result.datetime.lastIndexOf("|") - 1)).format("YYYY-MM-DD");
    result.source = "Unexplained Mysteries";
    let tempSummary = $(this)
      .text();
    result.summary = tempSummary.slice(tempSummary.indexOf("comments") + 13).trim();

    // Create a new Article using the `result` object built from scraping
    db.Article.create(result)
      .then(function(dbArticle) {
        // View the added result in the console
        console.log(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, log it
        console.log(err);
      });
    }
  });

  // Send a message to the client
  // res.send("Scrape Complete");

})
}).then(function() {
  axios.get("http://www.ghosttheory.com/").then(function(response) {
  // Then, we load that into cheerio and save it to $ for a shorthand selector
  var $ = cheerio.load(response.data);

  // Now, we grab every h2 within an article tag, and do the following:
  $("article").each(function(i, element) {
    // Save an empty result object
    var result = {};
    if (!existingArticles.includes($(this).find('.row').find('div:nth-of-type(2)').find('.newsmag-title').find('h3').find('a').attr('href'))) {
    // Add the text and href of every link, and save them as properties of the result object
    result.title = $(this)
      .find('.row')
      .find('div:nth-of-type(2)')
      .find('.newsmag-title')
      .find('h3')
      .find('a')
      .text()
    result.link = $(this)
      .find('.row')
      .find('div:nth-of-type(2)')
      .find('.newsmag-title')
      .find('h3')
      .find('a')
      .attr('href');
    result.datetime = moment($(this)
      .find('.row')
      .find('div:nth-of-type(2)')
      .find('.newsmag-title')
      .find('.meta')
      .text()).format("YYYY-MM-DD");
    result.source = "Ghost Theory";
    result.summary = $(this)
    .find('.row')
    .find('div:nth-of-type(2)')
    .find('.newsmag-content')
    .find('p')
    .text();

    // Create a new Article using the `result` object built from scraping
    db.Article.create(result)
      .then(function(dbArticle) {
        // View the added result in the console
        console.log(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, log it
        console.log(err);
      });
    }
  });

  // Send a message to the client
  res.send("Scrape Complete");

})
});
});

// Route for getting all Articles from the db
app.get("/", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({}).sort({ datetime: -1 })
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      console.log(dbArticle);
      let hbsObject = {
        articles: dbArticle,
      };
      // console.log(dbArticle);
      res.render("index", hbsObject);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for searching/filtering articles from the db
app.post("/:query", function(req, res) {
  let query;
  if (req.params.query === 'no query') {
    query = '';
  }
  else {
    query = sanitizeHtml(req.params.query);
  }
  const regex = new RegExp(query);
  // Grab every document that matches query term and source selections
  db.Article.find({ title: { $regex: regex, $options: 'i' }, source: { $in: req.body.sources }}).sort({ datetime: -1 })
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      // console.log('article', dbArticle);
      let hbsObject = {
        articles: dbArticle,
        layout: false, // stops the page from re-rendering against except articles
      };
      // send truncated version of page (just articles)
      res.render("search", hbsObject);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("notes")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      let hbsObject = {
        articles: dbArticle,
      };
      console.log(dbArticle);
      res.json(hbsObject);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  const clean = {...req.body, alias: sanitizeHtml(req.body.alias), body: sanitizeHtml(req.body.body)};
  db.Note.create(clean)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id }}, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
