const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
  title: String,
  content: String,
};
const article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get(function (req, res) {
    article.find(function (err, found) {
      res.send(found);
    });
  })
  .post(function (req, res) {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("successfully added new article");
      }
    });
  })
  .delete(function (req, res) {
    article.deleteMany(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Deleted all articles");
      }
    });
  });

app.route("/articles/:articleTitle").get(function(req, res){
  article.findOne({title:req.params.articleTitle},function(err,found){
    if(found){
      res.send(found);
    }
    else{
      res.send("no article found");
    }
  });
})
.put(function(req, res){
  article.update(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    {overwrite:true},
   function(err){
     if (err){
       res.send(err)
     }
     else{
       res.send("successfully updated")
     }
   }
  );
})
.patch(function(req, res){
  article.update(
    {title:req.params.articleTitle},
    {$set:req.body},
    function(err){
      if(err){
        res.send(err);
      }
      else{
        res.send("Updated")
      }
    }
  );
})
.delete(function(req, res){
  article.deleteOne({title:req.params.articleTitle},function(err){
    if (err){
      res.send(err);
    }
    else{
      res.send("Deleted");
    }
  });
})

app.listen(3000, function () {
  console.log("server started");
});
