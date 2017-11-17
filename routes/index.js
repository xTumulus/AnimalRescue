var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var animal = mongoose.model('animal');

// router.get('/animals', function(req, res, next) {
//   animal.find(function(err, comments){
//     if(err){ return next(err); }
//     res.json(comments);
//   });
// });

router.post('/animals', function(req, res, next) {
  console.log(req.body);
  var tempAnimal = new animal(req.body);
  console.log('tempAnimal');
  tempAnimal.save(function(err, tempAnimal){
    if(err){ return next(err); }
    res.json(tempAnimal);
    res.sendStatus(200);
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

router.put('/animals/:animal/decrease', function(req, res, next) {
  req.animal.decrease(function(err, animal){
    if (err) { return next(err); }
    res.json(animal);
  });
});

// router.delete('/comments/:comment', function(req, res) {
//   console.log("in Delete");
//   req.comment.remove();
//   res.sendStatus(200);
// });

module.exports = router;
