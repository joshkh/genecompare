var myApp = angular.module('myApp', []);

myApp.filter('orderObjectBy', function(){
 return function(input, attribute) {
    if (!angular.isObject(input)) return input;

    var array = [];
    for(var objectKey in input) {
        array.push(input[objectKey]);
    }

    array.sort(function(a, b){
        a = parseFloat(a[attribute]);
        b = parseFloat(b[attribute]);
        return a - b;
    });
    return array;
 }
});





myApp.controller('controller', ['$scope', '$http', function ($scope, $http) {

    



    $scope.orderByAttribute = '';


    $scope.stringifiedData = "hello"
    
    

    $scope.loadPeople = function() {

      //   console.log("TEST");

      //   $.ajax({
      //     type: "GET",
      //     url: "testdata.json",
      //   })
      // .then(function( data ) {

      //   $scope.$apply(function () {
      //       $scope.testData = data;
      //       $scope.stringed = "";

      //       for (each in data) {
      //           $scope.stringed += (JSON.stringify(data[each]));
      //       }

      //   });
    $scope.$emit("LOAD");
    $http.jsonp("http://www.filltext.com/?callback=JSON_CALLBACK&rows=5&name={firstName}&score={randomNumber|100}&delay=2").
    success(function (data) {
        $scope.testData = data
        $scope.$emit("UNLOAD");
    })

        
      // });

    };

    $scope.hideLoading = function() {
        console.log("CLICKLED");
        $scope.$emit("UNLOAD");
    };


}]).controller('appController', ['$scope', function ($scope) {
    $scope.$on('LOAD',function(){$scope.loading=true});
    $scope.$on('UNLOAD',function(){$scope.loading=false});
}]).
controller('urlController', function ($scope, $http) {
    /*this controller uses the url as a single string*/
    // $http.jsonp("http://www.filltext.com/?callback=JSON_CALLBACK&rows=5&name={firstName}&score={randomNumber|100}").
    // success(function (data) {
    //     $scope.users = data
    // })
}).
controller('objController', function ($scope, $http) {
    /*this controller uses the config.params object as the request payload*/
    var config = {
        params: {
            'rows': 5,
            'fname': '{name}',
            'lname': '{score}',
            'tel': '{phone|format}',
        }
    }
    $http.jsonp("http://www.filltext.com", config, {}).success(function (data) {
        $scope.users = data
    });

});