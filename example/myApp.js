angular.module('myApp.services', []).
    factory('Mine', function ($q) {
        return new intermine.Service({root: 'www.flymine.org/query'});        
    }).
    service('Activities', function($http, $q) {
        this.get = function(from, to){
            var deferred = $q.defer();
            var url = 'user/activities?from='+from+'&to='+to;
            $http.get(url).success(function(data, status) {
                // Some extra manipulation on data if you want...
                deferred.resolve(data);
            }).error(function(data, status) {
                deferred.reject(data);
            });

            return deferred.promise;
        }
    }
);

var myApp = angular.module('myApp', ['myApp.services']);

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


}]).controller('appController', function ($scope, $http, $q, $log, $timeout, Mine) {

    $scope.commonItems = {commonitems: []};
    $scope.imObjects = [];

    $scope.$on('LOAD',function(){$scope.loading=true});
    $scope.$on('UNLOAD',function(){$scope.loading=false});

    var flymine = Mine
    // oids = [19071979, 19071980, 19071987];
      , oids = [19012567, 19071979, 19071980, 19071987, 19072022, 86000919, 35000020, 35000003, 86000156, 86000153, 86000160, 86000157, 86000178, 86000161, 86000268, 86000190, 86000271, 86000269, 86000272, 86000273, 86000275, 86000277, 86000278, 86000407, 86000409, 86000414, 86000557, 86000575, 86000659, 86000890, 86000902, 86000906, 86000907, 86000916, 86000505, 86000191];

    $scope.convertObjs = function() {

        // var types = ['ProteinDomain'];
        // var promises = new Array();

        //////////////////

        if (!$scope.commonItems) return;
        $log.info("Making request");
        //var q = getQuery('ProteinDomain', $scope.commonItems.commonitems),
        var q = getQuery('ProteinDomain', oids);
        flymine.records(q).then(function (rs) {
            $scope.imObjects = rs;
            $scope.$apply();
        });

    };

    function success(data) {

       masterArray = new Array();
        for (var i = 0; i < data.length; i++) {
            var nextDataSet = data[i];
            for (x = 0; x < nextDataSet.length; x++) {
                masterArray.push(nextDataSet[x]);
            }
        }
        $scope.finalResults = masterArray;
        $scope.commonItems = masterArray;
    };
        

    // for (var i = 0; i < 5; i++) {
    //     $scope.imObjects.push("test");
    // }



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

            // Now convert out list of IDs to items:
            $scope.commonItems = data[value];

            //var all = convertObjs(data[value]);
           // all.then(success)

            // Show our array of promises:
            //console.log("everything", conversionPromise);



            // $q.when(conversionPromise).then(function(values){soundoff()});

            $scope.$emit("UNLOAD");

        });

    };


    




    $scope.hideLoading = function() {
        $scope.$emit("UNLOAD");
    };

    $scope.soundoff = function() {
        alert("soundoff");
    };



    
});


