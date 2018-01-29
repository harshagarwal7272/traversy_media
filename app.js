var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost/nodekb');
var db = mongoose.connection;

//check for db connection
db.once('open',function(){
	console.log('Connected to MongoDB');
});

//check for db errors
db.on('error',function(err){
	console.log(err);
});

var app = express();

//Bring in models
var Article = require('./models/article');

app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')));

app.get('/',function(req,res){
	Article.find({},function(err,articles){
		if(err){
			console.log(err);
		}else{
			res.render('index',{
				title:'wow',
				articles: articles
			});		
		}
	});
});

app.get('/articles/add',function(req,res){
	res.render('add_article',{
		title:"Add wow"
	});
});

//get single article
app.get('/article/:id',function(req,res){
	Article.findById(req.params.id,function(err,article){
		res.render('article',{
			article:article
		});
	});
});


app.post('/articles/add',function(req,res){
	var article = new Article();
	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.body;

	article.save(function(err){
		if(err){
			console.log(err);
			return;
		}else{
			res.redirect('/');
		}
	});
});

app.get('/article/edit/:id',function(req,res){
	Article.findById(req.params.id,function(err,article){
		res.render('edit_article',{
			title: 'Edit article',
			article:article
		});
	});
});


app.post('/articles/edit/:id',function(req,res){
	var article = {};
	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.body;

	var query = {_id:req.params.id}

	Article.update(query, article, function(err){
		if(err){
			console.log(err);
			return;
		}else{
			res.redirect('/');
		}
	});
});


app.delete('/article/:id',function(req,res){
	var query = {_id:req.params.id}
	Article.remove(query,function(err){
		if(err){
			console.log(err);
		}
		res.send('success');
	});
});

app.listen(3000,function(){
	console.log('Server running on port 3000');
});