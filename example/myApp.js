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

angular.module('myApp.modules', []).
factory('_', function() {
    return window._; // assumes underscore has already been loaded on the page
});



var myApp = angular.module('myApp', ['myApp.services', 'myApp.modules']);

myApp.directive('donutChart', function() {
    function link(scope, el) {

        var dataset = {
          apples: [53245, 28479, 19697, 24037, 40245],
        };

        var el = el[0]

        var width = el.clientWidth;
        var height = el.clientHeight;
        var radius = (width, height) / 2;

        var color = d3.scale.category20();

        var pie = d3.layout.pie()
            .sort(null);

        var arc = d3.svg.arc()
            .innerRadius(radius - 100)
            .outerRadius(radius - 50);

        var svg = d3.select(el).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var path = svg.selectAll("path")
            .data(pie(dataset.apples))
          .enter().append("path")
            .attr("fill", function(d, i) { return color(i); })
            .attr("d", arc);

    }
    return {
        link: link,
        restrict: 'E'
    }
})

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


}]).controller('appController', function ($scope, $http, $q, $log, $timeout, Mine, _) {

    // $scope.commonItems = {commonitems: []};

    $scope.imObjects = [];
    

    $scope.$on('LOAD',function(){$scope.loading=true});
    $scope.$on('UNLOAD',function(){$scope.loading=false});

    var flymine = Mine
    // oids = [19071979, 19071980, 19071987];
      , oids = [19012567, 19071979, 19071980, 19071987, 19072022, 86000919, 35000020, 35000003, 86000156, 86000153, 86000160, 86000157, 86000178, 86000161, 86000268, 86000190, 86000271, 86000269, 86000272, 86000273, 86000275, 86000277, 86000278, 86000407, 86000409, 86000414, 86000557, 86000575, 86000659, 86000890, 86000902, 86000906, 86000907, 86000916, 86000505, 86000191];

    convertObjs = function(ids, scopeVariable) {

        var types = ['ProteinDomain', 'Pathway'];
        // var promises = new Array();

        //////////////////
        var deferred = $q.defer();

        var arrPromise = [];

        for (type in types) {
            var q = getQuery(types[type], ids);
            var nextPromise = convertOneSet(ids, types[type]);
            arrPromise.push(nextPromise);

        }

        $q.all(arrPromise).then(function(all) {

            var emptyArray = [];

            for (var i = 0; i < all.length; i++) {
                emptyArray = emptyArray.concat(all[i]);

            }

            deferred.resolve(emptyArray);

        });

       // // if (!$scope.commonItems) return;
       //  $log.info("Making request in convertOjbs");
       //  //var q = getQuery('ProteinDomain', $scope.commonItems.commonitems),
       //  var q = getQuery('Pathway', ids);
       //  flymine.records(q).then(function (rs) {

       //      console.log("RS: ", rs);
       //     // $scope.imObjects = rs;
       //     deferred.resolve(rs);
       //      $scope.$apply();
       //      return rs;
       //  });

        return deferred.promise;

    };






    buildMap = function(results, scopeVariable) {

   //      {
   // "1025450":{
   //    "score:":25,
   //    "commonitems":{
   //       "1005555":[
   //          35000010
   //       ],
   //       "1010602":[
   //          19001462,
   //          19001463,
   //          19001464,
   //          35000011,
   //          35000010
   //       ],
   //       "1025450":[
   //          19001464,
   //          19001463,
   //          19001462,
   //          35000011,
   //          35000010
   //       ]

        var allObjIds = [];
      

        console.log("buildMap called with", results);

        for (var key in results) {

            console.log("working on key", key);

            // First push our key
            allObjIds.push(parseInt(key));

            // Now walk through the key(similar gene)'s common items and get those ids
            var nextSimilarGene = results[key];
            console.log("nextSimilarGene", nextSimilarGene);

            for (var commonKey in nextSimilarGene.commonitems) {

                console.log("working on commonKey", commonKey);

                allObjIds.push(parseInt(commonKey));

                arrValue = nextSimilarGene.commonitems[commonKey];
                for (var x = 0; x < arrValue.length; x++) {
                    allObjIds.push(arrValue[x]);
                }
                

                // Now loop through the similar items

            }
            
        }

        console.log("final results", allObjIds);

        var uniqueObjIds = _.uniq(allObjIds);

        console.log("unique", uniqueObjIds);





        var types = ['ProteinDomain', 'Pathway'];
        // var promises = new Array();

        //////////////////
        var deferred = $q.defer();

        var arrPromise = [];

        for (type in types) {
            var q = getQuery(types[type], results);
            var nextPromise = convertOneSet(results, types[type]);
            arrPromise.push(nextPromise);

        }

        $q.all(arrPromise).then(function(all) {

            var emptyArray = [];

            for (var i = 0; i < all.length; i++) {
                emptyArray = emptyArray.concat(all[i]);

            }

            deferred.resolve(emptyArray);

        });

       // // if (!$scope.commonItems) return;
       //  $log.info("Making request in convertOjbs");
       //  //var q = getQuery('ProteinDomain', $scope.commonItems.commonitems),
       //  var q = getQuery('Pathway', ids);
       //  flymine.records(q).then(function (rs) {

       //      console.log("RS: ", rs);
       //     // $scope.imObjects = rs;
       //     deferred.resolve(rs);
       //      $scope.$apply();
       //      return rs;
       //  });

        return deferred.promise;

    };


    $scope.talk = function(test) {
        $scope.filterItem = test;
    };

    $scope.clearFilter = function() {
        $scope.filterItem = "";
    };

    convertOneSet = function(ids, scopeVariable) {

        var deferred = $q.defer();

        var q = getQuery(scopeVariable, ids);
        flymine.records(q).then(function (rs) {

            console.log("RS: ", rs);
           // $scope.imObjects = rs;
           deferred.resolve(rs);
            $scope.$apply();
            return rs;
        });

        return deferred.promise;

    };

    // convertObjs = function(ids, scopeVariable) {

    //     var types = ['ProteinDomain'];
    //     // var promises = new Array();

    //     //////////////////
    //     var deferred = $q.defer();

    //    // if (!$scope.commonItems) return;
    //     $log.info("Making request in convertOjbs");
    //     //var q = getQuery('ProteinDomain', $scope.commonItems.commonitems),
    //     var q = getQuery('Pathway', ids);
    //     flymine.records(q).then(function (rs) {

    //         console.log("RS: ", rs);
    //        // $scope.imObjects = rs;
    //        deferred.resolve(rs);
    //         $scope.$apply();
    //         return rs;
    //     });

    //     return deferred.promise;

    // };

    getGeneInfo = function(ids, scopeVariable) {

        // var types = ['ProteinDomain'];
        // var promises = new Array();

        //////////////////
        var deferred = $q.defer();

        // if (!$scope.commonItems) return;
        $log.info("Making request");
        //var q = getQuery('ProteinDomain', $scope.commonItems.commonitems),
        var q = getQuery('Gene', ids);
        flymine.records(q).then(function (rs) {
            $scope[scopeVariable] = rs;
            deferred.resolve(rs);
            $scope.$apply();

        });

        return deferred.promise;

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

        //gene = gene.replace(/^\s+|\s+$/g,"").split(/\s*,\s*/);
        var gene =["abd-A", "ade3", "Anp"];


        $scope.$emit("LOAD");

        $scope.searchTerms = gene;

        var config = {
            params: {
                'callback': "json_callback"
            }
        }

        $http.get("testdata/mostsimilar.json", config, {}).success(function (data) {

            console.log("found data", data);

            ids = [];

            for (item in data) {
               ids.push(data[item].name);
            }

            console.log("using gene list ", ids);

            // Get a promise to resolve our genes as InterMine Objects
            var rs = getGeneInfo(ids, "commonGenes");

            // Resolve the promise and reattach the scores to the objects
            $q.when(rs).then(
                function(values){
                    // Re attach the score to the objects
                    for (nextResult in values) {

                        var originalMatch = _.findWhere(data, {"name": values[nextResult].objectId.toString()});
                        _.extend(values[nextResult], {score: originalMatch.score});

                    }

                    $scope.commonGenes = values;
                }


            );

            $scope.testData = data
            $scope.$emit("UNLOAD");
        });

    };

    $scope.getCommonItems = function(value) {

        $scope.$emit("LOAD");

        console.log("value", value);

        var config = {
            params: {
                'callback': "json_callback"
            }
        }


        $http.get("testdata/commonitems.json", config, {}).success(function (data) {

            // Now convert out list of IDs to items:

            // {
            // "1025450": {
            //     "1005555": [35000010],
            //     "1010602": [19001462, 19001463, 19001464, 35000011, 35000010],
            //     "1025450": [19001464, 19001463, 19001462, 35000011, 35000010]
            //     }
            // }

            // var commmonItems2 = data[value];

            // console.log("commonitems", commmonItems2);

            // if(!commmonItems2) {

            //     $scope.selectedCommonGene = _.findWhere($scope.commonGenes, {"objectId": parseInt(value)});
            //     console.log("selectedCommonGene", $scope.selectedCommonGene);


            //     $scope.commonItems = null;
            //     $scope.$emit("UNLOAD");
            //     return;
            // }

            // ids = [];


            // for (item in commmonItems2.commonitems) {
            //     var nextItem = commmonItems2.commonitems[item];
            //     ids.push(nextItem);
            // }

            // console.log("DATA", data);
            

            var rs = buildMap(data, "testiong");

            $q.when(rs).then(
                function(values){

                    console.log("VALUES: ", values);
                    // Re attach the score to the objects
                    // for (nextResult in values) {

                    //     var originalMatch = _.findWhere(data, {"name": values[nextResult].objectId.toString()});
                    //     _.extend(values[nextResult], {score: originalMatch.score});

                    // }

                    // Pluck our classes:
                    var classes = _.pluck(values, 'class');
                    var uniqueClasses = _.uniq(classes);

                    $scope.countBy = _.countBy(values, function(item) {
                        return item.class;
                    });


                    $scope.filterItem = "";
                    $scope.commonItems = values;

                    console.log("similar genes", $scope.commonGenes)

                    $scope.selectedCommonGene = _.findWhere($scope.commonGenes, {"objectId": parseInt(value)});
                    console.log("selectedCommonGene", $scope.selectedCommonGene);

                }


            );

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


