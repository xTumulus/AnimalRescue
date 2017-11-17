angular.module('animalRescue', [])
.controller('MainCtrl', [
  '$scope', '$http',
  function($scope, $http){
    $scope.animalList = [];

    $scope.addAnimal = function() {
      if($scope.formContent === '') { return; }
      console.log("In addanimal with "+$scope.formContent);
      $scope.create({
        name: $scope.formContent,
        health: 100,
        happiness: 100,
        days: 0,
      });
      $scope.formContent = '';
    };

    $scope.getAnimalList = function() {
      return $http.get('/animals/')
      .success(function(data) {
        console.log(data);
        var everything = "<ul>";
        for(var animal in data) {
          nml = data[animal];
          everything += "<li> Name: " + nml.name + "</li>";
        }
        everything += "</ul>";
        $("#animals").html(everything);
      })
    };

    $scope.feed = function(animal) {
      return $http.put('/animals/' + animal._id + '/feed')
      .success(function(data){
         console.log("animal fed");
         animal.health += 33;
         console.log(animal.health);
         if(animal.health > 100) {
           animal.health = 100;
         }
      });
    };


    $scope.play = function(animal) {
      return $http.put('/animals/' + animal._id + '/play')
      .success(function(data){
         console.log("animal played with");
         animal.happiness += 33;
         console.log(animal.happiness);
         if(animal.happiness > 100) {
           animal.happiness = 100;
         }
      });
    };

    $scope.decreaseAnimal = setInterval(function(animal) {
      return $http.put('/animals/' + animal._id + '/decrease')
      .success(function(data){
         console.log("animal dying");
         animal.happiness -= 33;
         if(animal.happiness < 1) {
           console.log('animal died');
           //call some dead animal function
         }
         animal.health -= 33;
         if(animal.health < 1) {
           console.log('animal died');
           //call some dead animal function
         }
         animal.days += 1;
         if(animal.days >= 30) {
           console.log('animal saved');
           //some function to delete and add to the number saved
         }
      });
    }, 10000);

    // $scope.getAll = function() {
    //   return $http.get('/animals').success(function(data){
    //     angular.copy(data, $scope.animals);
    //   });
    // };
    //
    // $scope.getAll();

    $scope.create = function(animal) {
      return $http.post('/animals', animal)
      .success(function(data){
        $scope.animalList.push(data);
      });
    };

    $scope.delete = function(animal) {
     $http.delete('/animals/' + animal._id )
      .success(function(data){
        console.log("delete worked");
      });
    };
  }
]);