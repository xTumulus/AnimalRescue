angular.module('animalRescue', [])
.controller('MainCtrl', [
  '$scope', '$http',
  function($scope, $http){
    $scope.animalList = [];
    $scope.animalsSaved; 

    $scope.addAnimal = function() {
      if($scope.formContent === '') { return; };
      console.log("In addanimal with "+$scope.formContent);
      $scope.create({
        name: $scope.formContent,
        health: 100,
        happiness: 100,
        days: 0,
      });
      $scope.formContent = '';
      $scope.getAnimalList();
    };

    $scope.getAnimalList = function() {
      return $http.get('/animals/')
      .success(function(data) {
        console.log(data + 'from the controller');
        $scope.animalList = data;
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
         $scope.getAnimalList();
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
         $scope.getAnimalList();
      });
    };

    $scope.decreaseAnimal = setInterval(function() {
        return $http.put('/animals/decreaseAnimal')
        .success(function(data){
          $scope.animalList = data;
          $scope.getAnimalList();
        });
    }, 10000);

    $scope.create = function(animal) {
      return $http.post('/animals', animal)
      .success(function(data){
        // $scope.animalList.push(data);
      });
    };

    $scope.delete = function(animal) {
     $http.delete('/animals/' + animal._id )
      .success(function(data){
        console.log("delete worked");
      });
    };

    $scope.getAnimalList();
  }
]);