let express = require("express");
let app  = express();
let path = require("path");
let fs = require("fs");
app.use(express.urlencoded({ extended: true }));

app.use("/",express.static(path.join(__dirname, 'client')));
app.use('/lib',express.static('client/lib')); 
console.log(path.join(__dirname, 'client', 'lib'))

app.get("/mug",function(req,res){
	fs.readFile(path.join(__dirname, 'Models', 'mug.obj'),function(err,data){
		res.send(data);
	})
});
app.get("/cube",function(req,res){
	fs.readFile(path.join(__dirname, 'Models', 'cube.obj'),function(err,data){
		res.send(data);
	})
});
app.get("/quad",function(req,res){
	fs.readFile(path.join(__dirname, 'Models', 'quad.obj'),function(err,data){
		res.send(data);
	})
});
app.get("/sofa1",function(req,res){
	fs.readFile(path.join(__dirname, 'Models', 'sofa1.obj'),function(err,data){
		res.send(data);
	})
});

app.listen(8000);