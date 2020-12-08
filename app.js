//jshint esversion:6
const express= require("express");
const bodyParser= require("body-parser");
const ejs=require("ejs");
const mongoose = require("mongoose");
const app=express();



app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikidb",{useNewUrlParser: true,useUnifiedTopology :true });

const articleSchema={
  title: String,
  content:String
};
const Article=mongoose.model("Article",articleSchema);



app.route('/articles')

.get(function(req,res){
  Article.find({},function(err,foundArticles){
    if(!err){
    res.send(foundArticles);
    }
    else{
      res.send(err);
    }
  });
})

.post(function(req,res){
  const title=req.body.title;
  const content=req.body.content;
  const article= new Article({
    title: title,
    content: content
  });
  article.save(function(err){

    if(!err){
    res.send("Successfully added");
    }
    else{
      res.send(err);
    }
  });
})

.delete(function(req,res){
  Article.deleteMany({},function(err){

        if(!err){
        res.send("Deleted all articles");
        }
        else{
          res.send(err);
        }
  });
});

////////////////
//request targeting a specific article
app.route('/articles/:name')

.get(function(req,res){
  const name = req.params.name;
  Article.findOne({title:name},function(err,foundArticles){
    if(!err){
    res.send(foundArticles);
    }
    else{
      res.send(err);
    }
  });
})


///update an individual things
.put(function(req,res){
  const name = req.params.name;
  const body = req.body.content;
  Article.update(
    { title:name },
    { title:name,
      content:body },
      {overwrite: true},
    function(err,foundArticles){
    if(!err){
    res.send("Updated Successfully");
    }
    else{
      res.send(err);
    }
  });
})

.patch(function(req,res){
  const name = req.params.name;
  Article.update(
    { title:name },
    { $set: req.body},
    function(err){
    if(!err){
      res.send("Updated Successfully");
    }
    else{
      res.send(err);
    }
  });
})


.delete(function(req,res){
  const name = req.params.name;
  Article.deleteOne({title: name},function(err){
        if(!err){
        res.send("Deleted one articles");
        }
        else{
          res.send(err);
        }
  });
});


app.listen(3000,function(){
  console.log("listening to port 3000");
} );
