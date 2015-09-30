/**
*  Module
*
* Description
*/
angular.module('App', ['ngRoute'])

.run(function($rootScope, Service, $location){
    $rootScope.$on('$routeChangeStart', function(event, access){
        var access_private = access.$$route && access.$$route.access_private;
        var route_login = access.$$route && access.$$route.originalPath;
        var auth = Service.auth();
        if(access_private){
            if(!auth){
                $location.path('/login');
            }
        }else{
            if(route_login == '/login' && auth){
                $location.path('/');
            }
        }
    })
})

.config(['$routeProvider',function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/home',
        controller: 'Home',
        access_private: true
    })
    .when('/login', {
        templateUrl: 'views/login',
        controller: 'Login',
        access_private: false
    })
    .otherwise({redirectTo:'/login'});
}])

.controller('Home',function($scope, $window, Service, $location){
    $scope.logout = function(){
        Service.logout();
        $location.path('/login');
    }
})
.controller('Login', function($scope, Service, $window, $location){
    $scope.message = "";
    $scope.login = function(user){
        Service.post(user).then(function(data){
            $window.localStorage.setItem('token', data.token);
            $location.path('/');
        }, function(err){
            $scope.message = err;
        })
    }
})

.factory('Service', function($window, $q, $location){
    return {
        post: function(user){
            var defer = $q.defer();
            if(user.username == 'admin' && user.password == "123"){
                defer.resolve({token: "tokenmuitoloko12389d0asdn12nd81dndajsdn109d"});
            }else{
                defer.reject("Usuario ou senha errados!");
            }

            return defer.promise;
        },
        auth: function(){
            var token = $window.localStorage.getItem('token');
            if(token){
                return true;
            }else{
                return false;
            }

        },
        logout: function(){
            $window.localStorage.removeItem('token');
        }
    };
})