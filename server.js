let express = require("express");
let app  = express();
let path = require("path");
let fs = require("fs");
app.use(express.urlencoded({ extended: true }));

app.use("/",express.static(path.join(__dirname, 'client')));
app.use('/lib',express.static('client/lib')); 

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
app.get("/bulb",function(req,res){
	fs.readFile(path.join(__dirname, 'Models', 'bulb.obj'),function(err,data){
		res.send(data);
	})
});
app.get("/plate",function(req,res){
	fs.readFile(path.join(__dirname, 'Models', 'plate.obj'),function(err,data){
		res.send(data);
	})
});
app.get("/soundbar",function(req,res){
	fs.readFile(path.join(__dirname, 'Models', 'soundbar.obj'),function(err,data){
		res.send(data);
	})
});
app.get("/sofa2",function(req,res){
	fs.readFile(path.join(__dirname, 'Models', 'sofa2.obj'),function(err,data){
		res.send(data);
	})
});
app.get("/TV_Stand",function(req,res){
	fs.readFile(path.join(__dirname, 'Models', 'TV_Stand.obj'),function(err,data){
		res.send(data);
	})
});
app.get("/TV",function(req,res){
	fs.readFile(path.join(__dirname, 'Models', 'TV.obj'),function(err,data){
		res.send(data);
	})
});
app.listen(8000);