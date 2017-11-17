var mongoose = require('mongoose');

var animalSchema = new mongoose.Schema({
  name: String,
  health: {type: Number, default: 100},
  happiness: {type: Number, default: 100},
});

animalSchema.methods.feed = function(cb) {
  this.health += 33;
  if(this.health > 100) {
    this.health = 100;
  }
  this.save(cb);
};

animalSchema.methods.play = function(cb) {
  this.happiness += 33;
  if(this.happiness > 100) {
    this.happiness = 100;
  }
  this.save(cb);
};

animalSchema.methods.decrease = function(cb) {
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
  this.save(cb);
};

mongoose.model('animal', animalSchema);