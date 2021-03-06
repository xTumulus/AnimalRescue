angular.module('animalRescue', [])
.controller('MainCtrl', [
  '$scope', '$http',
  function($scope, $http){
    $scope.animalList = [];
    $scope.animalsSaved; 

    $scope.addAnimal = function() {
      if($scope.formContent === '') { return; };
      if($scope.animalList.length > 19) { 
        //do something to say "that is too many animals"
        console.log('that is too many animals');
        return; 
      }
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
      console.log('running decreaseAnimal');
      var count = 0;
      $scope.getAnimalList();
      $scope.animalList.forEach(function(animal){
        $http.put('/animals/' + animal._id + '/decreaseAnimal')
          .success(function(d){      
            if(count++ === $scope.animalList.length){
              console.log('Getting animals');
            }
          });
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