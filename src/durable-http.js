let Observable = require("rxjs").Observable;

angular.module("durableHttpMod",[])
.service("durableHttpService", ["$http", function($http) {
    let numTries = 3;
    this.config = function(configObject) {
        numTries = configObject.numTries;
    }
    this.get = function(url) {
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