var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/animalDB', { useMongoClient: true});

var animalSchema = new mongoose.Schema({
  name: String,
  health: {type: Number, default: 100},
  happiness: {type: Number, default: 100},
  days: 0,
});

animalSchema.methods.feed = function(cb) {
  this.health += 33;
  console.log(this.health + 'in model');
  if(this.health > 100) {
    this.health = 100;
  }
  this.save(cb);
};

animalSchema.methods.play = function(cb) {
  this.happiness += 33;
  console.log(this.happiness + 'in model');
  if(this.happiness > 100) {
    this.happiness = 100;
  }
  this.save(cb);
};

animalSchema.methods.decreaseAnimal = function(cb) {
  this.happiness -= 33;
  if(this.happiness < 1) {
    console.log('animal died in model');
    //some function to kill it?
  }
  this.health -= 33;
  if(this.health < 1) {
    console.log('animal died in model');
    //some function to kill it?
  }
  this.days += 1;
  if(this.days >= 30) {
    console.log('animal rescued and returned to wild');
    //some function to log that it was saved
    //still call delete
  }
  this.save(cb);
};

var animal = mongoose.model('animal', animalSchema);

var db = mongoose.connection;

db.on('error', console.error.bind(console,'connection error:'));
db.once('open', function () {
  console.log('Connected to db');
});

router.get('/animals', function(req, res, next){
  console.log('In GET animals route');
  animal.find(function(err,animals) {
    if (err) return console.error(err);
    else {
      console.log(animals);
    }
    res.json(animals);
  })
});

router.post('/animals', function(req, res, next) {
  console.log(req.body);
  var tempAnimal = new animal(req.body);
  console.log('tempAnimal');
  tempAnimal.save(function(err, tempAnimal){
    if(err){ return next(err); }
    res.json(tempAnimal);
  });
});

router.param('animal', function(req, res, next, id) {
  var query = animal.findById(id);
  query.exec(function (err, animal){
    if (err) { return next(err); }
    if (!animal) { return next(new Error("can't find animal")); }
    req.animal = animal;
    return next();
  });
});

router.get('/animals/:animal', function(req, res) {
  res.json(req.animal);
});

router.put('/animals/:animal/feed', function(req, res, next) {
  req.animal.feed(function(err, animal){
    if (err) { return next(err); }
    res.json(animal);
  });
});

router.put('/animals/:animal/play', function(req, res, next) {
  req.animal.play(function(err, animal){
    if (err) { return next(err); }
    res.json(animal);
  });
});

router.put('/animals/:animal/decreaseAnimal', function(req, res, next) {
  req.animal.decreaseAnimal(function(err, animal){
    if (err) { return next(err); }
    res.json(animal);
  });
});

router.delete('/animals/:animal', function(req, res) {
  console.log("in Delete");
  req.animal.remove();
  res.sendStatus(200);
});

module.exports = router;
