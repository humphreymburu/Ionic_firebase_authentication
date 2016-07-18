angular.module('starter.auth', ['firebase'])
.factory('Auth', ['$firebaseAuth', function($firebaseAuth) {		 
  return $firebaseAuth();
}]);

