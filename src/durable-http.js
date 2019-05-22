angular.module("hackerNewsSearchApp")
.service("durableHttpService", ["$http", "$q", function($http, $q) {
    let numTries = 3;
    this.config = function(configObject) {
        numTries = configObject.numTries;
    }
    this.getVal = ()=>5;
    this.get = function(url) {
        let deferred = $q.defer();
        let iteration = 0
        let attempt = function() {
            console.log("attempt");
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
}])