let express = require("express");
let app  = express();
let path = require("path");
let fs = require("fs");
app.use(express.urlencoded({ extended: true }));

app.use("/",express.static(path.join(__dirname, "client")));
app.use("/lib",express.static("client/lib"));


// Models:
app.get("/mug",function (req,res) {

	fs.readFile(path.join(__dirname, "Models", "mug.obj"),function (err,data) {

		res.send(data);

	});

});
app.get("/cube",function (req,res) {

	fs.readFile(path.join(__dirname, "Models", "cube.obj"),function (err,data) {

		res.send(data);

	});

});
app.get("/quad",function (req,res) {

	fs.readFile(path.join(__dirname, "Models", "quad.obj"),function (err,data) {

		res.send(data);

	});

});
app.get("/sofa1",function (req,res) {

	fs.readFile(path.join(__dirname, "Models", "sofa1.obj"),function (err,data) {

		res.send(data);

	});

});
app.get("/sofa2",function (req,res) {

	fs.readFile(path.join(__dirname, "Models", "sofa2.obj"),function (err,data) {

		res.send(data);

	});

});
app.get("/bulb",function (req,res) {

	fs.readFile(path.join(__dirname, "Models", "bulb.obj"),function (err,data) {

		res.send(data);

	});

});
app.get("/plate",function (req,res) {

	fs.readFile(path.join(__dirname, "Models", "plate.obj"),function (err,data) {

		res.send(data);

	});

});
app.get("/soundbar",function (req,res) {

	fs.readFile(path.join(__dirname, "Models", "soundbar.obj"),function (err,data) {

		res.send(data);

	});

});
app.get("/TV_Stand",function (req,res) {

	fs.readFile(path.join(__dirname, "Models", "TV_Stand.obj"),function (err,data) {

		res.send(data);

	});

});
app.get("/TV",function (req,res) {

	fs.readFile(path.join(__dirname, "Models", "TV.obj"),function (err,data) {

		res.send(data);

	});

});
app.get("/Wall",function (req,res) {

	fs.readFile(path.join(__dirname, "Models", "wall.obj"),function (err,data) {

		res.send(data);

	});

});
app.get("/Shade",function (req,res) {

	fs.readFile(path.join(__dirname, "Models", "lampShade.obj"),function (err,data) {

		res.send(data);

	});

});
app.get("/lightCable",function (req,res) {

	fs.readFile(path.join(__dirname, "Models", "lightCable.obj"),function (err,data) {

		res.send(data);

	});

});
app.get("/chairLeg",function (req,res) {

	fs.readFile(path.join(__dirname, "Models", "chairLeg.obj"),function (err,data) {

		res.send(data);

	});

});
app.get("/chairSeat",function (req,res) {

	fs.readFile(path.join(__dirname, "Models", "chairSeat.obj"),function (err,data) {

		res.send(data);

	});

});
app.get("/cushion",function (req,res) {

	fs.readFile(path.join(__dirname, "Models", "cushion.obj"),function (err,data) {

		res.send(data);

	});

});
app.get("/table",function (req,res) {

	fs.readFile(path.join(__dirname, "Models", "table.obj"),function (err,data) {

		res.send(data);

	});

});
app.get("/lampBase",function (req,res) {

	fs.readFile(path.join(__dirname, "Models", "lampBase.obj"),function (err,data) {

		res.send(data);

	});

});
app.get("/lampStand",function (req,res) {

	fs.readFile(path.join(__dirname, "Models", "lampStand.obj"),function (err,data) {

		res.send(data);

	});

});
app.get("/footRest",function (req,res) {

	fs.readFile(path.join(__dirname, "Models", "footRest.obj"),function (err,data) {

		res.send(data);

	});

});
app.get("/skybox",function (req,res) {

	fs.readFile(path.join(__dirname, "Models", "skybox.obj"),function (err,data) {

		res.send(data);

	});

});

// Textures
app.get("/Texture/floor",function (req,res) {

	res.sendFile(path.join(__dirname, "Textures", "floor.jpg"));

});
app.get("/Texture/sofa1",function (req,res) {

	res.sendFile(path.join(__dirname, "Textures", "sofa1.jpg"));

});
app.get("/Texture/sofa2",function (req,res) {

	res.sendFile(path.join(__dirname, "Textures", "sofa2.jpg"));

});
app.get("/Texture/sofa2Normal",function (req,res) {

	res.sendFile(path.join(__dirname, "Textures", "sofa2Normal.jpg"));

});
app.get("/Texture/wood",function (req,res) {

	res.sendFile(path.join(__dirname, "Textures", "wood.png"));

});
app.get("/Texture/ceramic",function (req,res) {

	res.sendFile(path.join(__dirname, "Textures", "ceramic.jpg"));

});
app.get("/Texture/shade",function (req,res) {

	res.sendFile(path.join(__dirname, "Textures", "Shade.jpg"));

});
app.get("/Texture/TV1",function (req,res) {

	res.sendFile(path.join(__dirname, "Textures", "TV1.png"));

});
app.get("/Texture/TV2",function (req,res) {

	res.sendFile(path.join(__dirname, "Textures", "TV2.png"));

});
app.get("/Texture/TV3",function (req,res) {

	res.sendFile(path.join(__dirname, "Textures", "TV3.png"));

});
app.get("/Texture/TV4",function (req,res) {

	res.sendFile(path.join(__dirname, "Textures", "TV4.png"));

});
app.get("/Texture/wall",function (req,res) {

	res.sendFile(path.join(__dirname, "Textures", "wall.jpg"));

});
app.get("/Texture/wallNormal",function (req,res) {

	res.sendFile(path.join(__dirname, "Textures", "wallNormal.jpg"));

});
app.get("/Texture/metal",function (req,res) {

	res.sendFile(path.join(__dirname, "Textures", "metal.png"));

});
app.get("/Texture/fabric",function (req,res) {

	res.sendFile(path.join(__dirname, "Textures", "fabric.jpg"));

});
app.get("/Texture/fabricNormal",function (req,res) {

	res.sendFile(path.join(__dirname, "Textures", "fabricNormal.jpg"));

});
app.get("/Texture/skybox",function (req,res) {

	res.sendFile(path.join(__dirname, "Textures", "skybox.png"));

});

app.listen(8000);