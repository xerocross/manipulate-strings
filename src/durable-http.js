let Subject = require("rxjs").Subject;
let Observable = require("rxjs").Observable;

angular.module("durableHttpMod",[])
.service("durableHttpService", ["$http", "$q", "$timeout", function($http, $q, $timeout) {
    let numTries = 3;
    this.config = function(configObject) {
        numTries = configObject.numTries;
    }
    this.get = function(url) {
        let deferred = $q.defer();
        let iteration = 0
        let attempt = function() {
            if (iteration >= numTries) {
                deferred.resolve({
                    status: "FAIL"
                });
            } else {
                iteration++;
                $http.get(url)
                .then((response)=>{
                    if (response.status == 200) {
                        deferred.resolve({
                            status: "SUCCESS",
                            data : response.data
                        })
                    } else {
                        attempt();
                    }
                })
                .catch(() =>{
                    attempt();
                })
            }
        }
        attempt();
        return deferred.promise;
    }
    this._get = function(url) {
        let iteration = 0;
        let observable = new Observable((observer)=> {
            let attempt = function() {
                if (iteration >= numTries) {
                    observer.next({
                        status: "FAIL"
                    });
                } else {
                    observer.next({
                        status: "ATTEMPTING",
                        data : {
                            attemptNum : iteration
                        }
                    });
                    iteration++;
                    $http.get(url)
                    .then((response)=>{
                        if (response.status == 200) {
                            observer.next({
                                status: "SUCCESS",
                                data : response.data
                            })
                        } else {
                            attempt();
                        }
                    })
                    .catch((e) =>{
                        attempt();
                    })
                }
            }
            attempt();
        })
        return observable;
    }
}])