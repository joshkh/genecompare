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

myApp.service('Photo', ['$log', function ($log) {

    var flymine   = new intermine.Service({root: 'www.flymine.org/query'});

    oids = [19071979, 19071980, 19071987];




    function getQuery(root, ids) {
        var query = {
        "from": root,
        "select":["*"],
        "where":
                        [
                            {"path":root,"op":"IN","ids":ids.slice()}
                        ]
                }
        return query;
    }

    var types = ['Gene', 'ProteinDomain'];
    for (i in types) {
        var q = getQuery(types[i], oids);

        flymine.records(q).then(function(rows) {
            console.log("rows", rows);
          console.log("No. of exons: " + rows.length);
          rows.forEach(function printRow(row) {
            console.log("[" + row[0] + "] " + row[1] + ":" + row[2] + ".." + row[3]);
          });
        });
    }

    return {};

}]);




myApp.controller('controller', ['$scope', '$http', function ($scope, $http) {

    $scope.orderByAttribute = '';


}]).controller('appController', ['$scope', '$http', 'Photo', function ($scope, $http, Photo) {


    $scope.$on('LOAD',function(){$scope.loading=true});
    $scope.$on('UNLOAD',function(){$scope.loading=false});


    $scope.getSimilarGenes = function(gene) {

        gene = gene.replace(/^\s+|\s+$/g,"").split(/\s*,\s*/);


        $scope.$emit("LOAD");

        $scope.searchTerms = gene;

        var config = {
            params: {
                'callback': "json_callback"
            }
        }


        $http.get("testdata/mostsimilar.json", config, {}).success(function (data) {

            console.log("FINISHED", data);
            $scope.testData = data
            $scope.$emit("UNLOAD");
        });

    };

    $scope.getCommonItems = function(value) {

        $scope.$emit("LOAD");

        var config = {
            params: {
                'callback': "json_callback"
            }
        }


        $http.get("testdata/commonitems.json", config, {}).success(function (data) {

            console.log("FINISHED", value);
            $scope.$emit("UNLOAD");
            $scope.commonItems = data[value];
            console.log("CommonItems: " + JSON.stringify($scope.commonItems, null, 2));
        });

    };

    $scope.hideLoading = function() {
        console.log("CLICKLED");
        $scope.$emit("UNLOAD");
    };

    
}]);
