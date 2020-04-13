import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArianeService } from '../../service/ariane';

@Component({
  selector: 'app-validate-email',
  templateUrl: './validate-email.html',
  styleUrls: ['./validate-email.less']
})
export class ValidateEmailComponent implements OnInit {

	constructor(private route: ActivatedRoute,
	            private arianeService: ArianeService
	            ) {
		
	}

	ngOnInit() {
		this.arianeService.updateManual(this.route.snapshot.paramMap);
	}

	onSend() {
	}
	onCheck() {
	}
}
/*


app.controller("controlerValidateEmail", function($scope, $http, $rootScope, AuthService) {
	$scope.sendButtonDisabled = false;
	$scope.syncButtonDisabled = false;
	$scope.error = "";
	
	$scope.rememberMe = true;
	
	$rootScope.currentModalCanRemove = true;
	
	$scope.updateButtonVisibility = function() {
		if (    $scope.loginOK == true
		     && $scope.passOK == true
		     && $scope.emailOK == true) {
			$scope.signUpButtonDisabled = false;
		} else {
			$scope.signUpButtonDisabled = true;
		}
		$scope.error = "";
	}
	
	$scope.checkLogin = function() {
		if (    $scope.login == null
		     || $scope.login.length == 0) {
			$scope.loginOK = false;
			$scope.loginIcon = "";
			$scope.loginHelp = "";
			$scope.updateButtonVisibility();
			return;
		}
		if ($scope.login.length < 6) {
			$scope.loginOK = false;
			$scope.loginHelp = "Need 6 characters";
			$scope.loginIcon = "";
			$scope.updateButtonVisibility();
			return;
		}
		if (checkLoginValidity($scope.login) == true) {
			$scope.loginOK = false;
			//$scope.loginHelp = "check in progress...";
			$scope.loginIcon = signUp_iconWait;
			let data = {
				"login": $scope.login
			}
			let connectionAdresse = createRESTCall("user/check/login");
			let config = {
				params: data
			};
			let tmpLogin = "" + $scope.login;
			console.log("call " + connectionAdresse + " data=" + JSON.stringify(data, null, 2));
			$http.get(connectionAdresse, config)
				.then(function(response) {
					// check if the answer is correct with the question
					if (tmpLogin != $scope.login) {
						return;
					}
					console.log("Status " + response.status);
					console.log("data " + JSON.stringify(response.data, null, 2));
					if (response.status == 200) {
						// the login exist ... ==> it is found...
						$scope.loginOK = false;
						$scope.loginHelp = "Login already used ...";
						$scope.loginIcon = signUp_iconWrong;
						return;
					}
					$scope.loginOK = false;
					$scope.loginHelp = "Login already used ... (error 2)";
				}, function(response) {
					// check if the answer is correct with the question
					if (tmpLogin != $scope.login) {
						return;
					}
					if (response.status == 404) {
						$scope.loginOK = true;
						$scope.loginHelp = "";
						$scope.loginIcon = signUp_iconRight;
						return;
					}
					console.log("Status " + response.status);
					console.log("data " + JSON.stringify(response.data, null, 2));
					$scope.loginOK = false;
					$scope.loginHelp = "Login already used ...";
					$scope.loginIcon = signUp_iconWrong;
				});
		} else {
			$scope.loginOK = false;
			$scope.loginHelp = 'Not valid: characters, numbers and "_-."';
		}
		$scope.updateButtonVisibility();
	}
	
	$scope.checkEmail = function() {
		if (    $scope.email == null
		     || $scope.email.length == 0) {
			$scope.emailOK = false;
			$scope.updateButtonVisibility();
			$scope.emailIcon = "";
			$scope.emailHelp = "";
			return;
		}
		if ($scope.email.length < 6) {
			$scope.emailOK = false;
			$scope.emailHelp = "Need 6 characters";
			$scope.updateButtonVisibility();
			$scope.passIcon = "";
			return;
		}
		if (checkEmailValidity($scope.email) == true) {
			$scope.emailOK = true;
			$scope.emailHelp = "";
			//$scope.loginHelp = "check in progress...";
			$scope.emailIcon = signUp_iconWait;
			let data = {
				"e-mail": $scope.email
			}
			let connectionAdresse = createRESTCall("user/check/email");
			let config = {
				params: data
			};
			let tmpEmail = "" + $scope.email;
			console.log("call " + connectionAdresse + " data=" + JSON.stringify(data, null, 2));
			$http.get(connectionAdresse, config)
				.then(function(response) {
					// check if the answer is correct with the question
					if (tmpEmail != $scope.email) {
						return;
					}
					console.log("Status " + response.status);
					console.log("data " + JSON.stringify(response.data, null, 2));
					if (response.status == 200) {
						// the email exist ... ==> it is found...
						$scope.emailOK = false;
						$scope.emailHelp = "email already used ...";
						$scope.emailIcon = signUp_iconWrong;
						return;
					}
					$scope.emailOK = false;
					$scope.emailHelp = "email already used ... (error 2)";
				}, function(response) {
					// check if the answer is correct with the question
					if (tmpEmail != $scope.email) {
						return;
					}
					if (response.status == 404) {
						$scope.emailOK = true;
						$scope.emailHelp = "";
						$scope.emailIcon = signUp_iconRight;
						return;
					}
					console.log("Status " + response.status);
					console.log("data " + JSON.stringify(response.data, null, 2));
					$scope.emailOK = false;
					$scope.emailHelp = "email already used ...";
					$scope.emailIcon = signUp_iconWrong;
				});
		} else {
			$scope.emailOK = false;
			$scope.emailHelp = 'Not valid: characters, numbers, "_-." and email format: you@example.com';
		}
		$scope.updateButtonVisibility();
	}
	
	$scope.checkPassword = function() {
		if ($scope.password == null) {
			$scope.passOK = false;
			$scope.passHelp = "";
			$scope.updateButtonVisibility();
			return;
		}
		if ($scope.password.length < 6) {
			$scope.passOK = false;
			$scope.passHelp = "Need 6 characters";
		} else {
			if (checkPasswordValidity($scope.password) == true) {
				$scope.passOK = true;
				$scope.passHelp = "";
			} else {
				$scope.passOK = false;
				$scope.passHelp = 'Not valid: characters, numbers and "_-:;.,?!*+=}{([|)]% @&~#/\<>"';
			}
		}
		$scope.updateButtonVisibility();
	}
	$scope.onSignUp = function() {
		if ($scope.signUpButtonDisabled == true) {
			// TODO: ...  notify user ...
			console.log("Not permited action ... ==> control does not validate this action ...");
			return;
		}
		let data = {
			"methode": "v0",
			"login": $scope.login,
			"e-mail": $scope.email,
			"password": btoa(CryptoJS.SHA1($scope.password)) // btoa encode i base64
		}
		let connectionAdresse = createRESTCall("user/add");
		let config = {
			headers: {
				"Content-Type": "application/json"
			}
		};
		let tmpEmail = "" + $scope.email;
		console.log("call " + connectionAdresse + " data=" + JSON.stringify(data, null, 2));
		$http.post(connectionAdresse, data, config)
			.then(function(response) {
				console.log("Status " + response.status);
				console.log("data " + JSON.stringify(response.data, null, 2));
				if (response.status == 200) {
					
					return;
				}
				$scope.emailOK = false;
				$scope.emailHelp = "email already used ... (error 2)";
			}, function(response) {
				console.log("Status " + response.status);
				console.log("data " + JSON.stringify(response.data, null, 2));
			});
	}
	$scope.onCancel = function() {
		console.log("onCancel ... '" + $scope.login + "':'" + $scope.password + "'");
		$rootScope.currentModal = "";
	}
});





*/