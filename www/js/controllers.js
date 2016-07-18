'use strict'
angular.module('starter.controllers', ['starter.utils', 'starter.auth'])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})



.controller('socialCtrl', ['$scope', 'Auth', '$state', 'fbutil', '$firebaseAuth', function($scope, Auth, $state, fbutil, $firebaseAuth) {
	
  $scope.faceSign = function() {

	
	var provider = new firebase.auth.FacebookAuthProvider();
	   provider.addScope('email');
	
	  firebase.auth().signInWithRedirect(provider).then(function() {
		 
	    // Never called because of page redirect
	  }).catch(function(error) {
	    console.error("Authentication failed:", error);
	  });
	
	
	  firebase.auth().getRedirectResult().then(function(result) {
	 // Auth.$getRedirectResult().then(function(result) {
	    if (result.credential) {
	      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
	      var token = result.credential.accessToken;
	      // ...
	    }
	    // The signed-in user info.
	    var user = result.user;
	  }).catch(function(error) {
	    // Handle Errors here.
	    var errorCode = error.code;
	    var errorMessage = error.message;
	    // The email of the user's account used.
	    var email = error.email;
	    // The firebase.auth.AuthCredential type that was used.
	    var credential = error.credential;
		if (errorCode === 'auth/account-exists-with-different-credential') {
		          alert('You have already signed up with a different auth provider for that email.');
		          // If you are using multiple auth providers on your app you should handle linking
		          // the user's accounts here.
		        } else {
		          console.error(error);
		        }
	    // ...
	  });
	
	
	 $state.go('tab.account');
	
  }
  
  
  
  
   $scope.twitterSign = function() {
	   
	    var provider = new firebase.auth.TwitterAuthProvider();
   	
	 firebase.auth().signInWithRedirect(provider).then(function() {
		 //$ionicLoading.hide(); 

	    // Never called because of page redirect
	  }).catch(function(error) {
	    console.error("Authentication failed:", error);
	  });
	
	
	  firebase.auth().getRedirectResult().then(function(result) {
	    if (result.credential) {
	      // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
	      // You can use these server side with your app's credentials to access the Twitter API.
	      var token = result.credential.accessToken;
	      var secret = result.credential.secret;
	      // ...
	    }
	    // The signed-in user info.
	    var user = result.user;
	  }).catch(function(error) {
	    // Handle Errors here.
	    var errorCode = error.code;
	    var errorMessage = error.message;
	    // The email of the user's account used.
	    var email = error.email;
	    // The firebase.auth.AuthCredential type that was used.
	    var credential = error.credential;
	    // ...
	  });
	
	  $state.go('tab.account');
	
	
   }
  
  
	
	
	
}])




.controller('LoginCtrl', ['$scope', 'Auth', '$state', 'fbutil', function($scope, Auth, $state, fbutil) {
    
	$scope.data = {
		"email" : null,
		"pass"  : null,
		"confirm" : null,
		"createMode" : false
	}
	

    $scope.login = function(email, pass) {
      $scope.err = null;
    
	
     var email = $scope.data.email;
     var pass = $scope.data.pass;
	  
  	    Auth.$signInWithEmailAndPassword(email,pass)
  	   .then(function(firebaseUser) {
  	       console.log("Signed in as:", firebaseUser.uid);
  	     $state.go('tab.account');
  	    }).catch(function(error) {
  	       console.error("Authentication failed:", error);
  	    });
	
	
	

		
	  
    };

    $scope.createAccount = function(email,pass) {
      $scope.err = null;
      if( assertValidAccountProps() ) {
        var email = $scope.data.email;
        var pass = $scope.data.pass;
        // create user credentials in Firebase auth system
		Auth.$createUserWithEmailAndPassword(email,pass)        
		.then(function() {
            // authenticate so we have permission to write to Firebase
            return Auth.$signInWithEmailAndPassword(email,pass);
          })
          .then(function(user) {
            // create a user profile in our data store
			  var ref = firebase.database().ref('users/' + user.uid);
			              return fbutil.handler(function(cb) {
			                ref.set({email: email, name: name||firstPartOfEmail(email)}, cb);
			              });
			            }) 
          .then(function(/* user */) {
            // redirect to the account page
            $state.go('tab.account');
          }, function(err) {
            $scope.err = errMessage(err);
          });
      }
    };

    function assertValidAccountProps() {
      if( !$scope.data.email ) {
        $scope.err = 'Please enter an email address';
      }
      else if( !$scope.data.pass || !$scope.data.confirm ) {
        $scope.err = 'Please enter a password';
      }
      else if( $scope.data.createMode && $scope.data.pass !== $scope.data.confirm ) {
        $scope.err = 'Passwords do not match';
      }
      return !$scope.err;
    }

    function errMessage(err) {
      return angular.isObject(err) && err.code? err.code : err + '';
    }

    function firstPartOfEmail(email) {
      return ucfirst(email.substr(0, email.indexOf('@'))||'');
    }

    function ucfirst (str) {
      // inspired by: http://kevin.vanzonneveld.net
      str += '';
      var f = str.charAt(0).toUpperCase();
      return f + str.substr(1);
    }
  }]);