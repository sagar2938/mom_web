app.service('Data', function($http, $localStorage, $cookies, $q){

    this.signUp = function(json_data){
        return $http({
            method:'POST',
            'data':json_data,
            'url':'https://mom-apicalls.appspot.com/customer/add/user/'
        });
    }

    this.signIn = function(json_data){
        return $http({
            method:'POST',
            'data':json_data,
            'url':'https://mom-apicalls.appspot.com/customer/user/login/'
        });
    }

    this.updateAddress = function(json_data){
        return $http({
            method:'POST',
            'data':json_data,
            'url':'https://mom-apicalls.appspot.com/customer/update/user/address/'
        });
    }

    this.deliveryPrice = function(json_data){
        return $http({
            method:'POST',
            'data':json_data,
            'url':'https://mom-apicalls.appspot.com/customer/get/delivery/charge/cal/'
        });
    }

    this.update_profile = function(json_data){
        return $http({
            method:'POST',
            'data':json_data,
            'url':'https://mom-apicalls.appspot.com/customer/update/user/profile/'
        });
    }
    this.getProfilePic = function(json_data){
        return $http({
            method:'POST',
            'data':json_data,
            'url':'https://mom-apicalls.appspot.com/api/get/profile/pics/'
        });
    }
    this.resendOtp = function(json_data){
        return $http({
            method:'POST',
            'data':json_data,
            'url':'https://mom-apicalls.appspot.com/customer/resend/otp/'
        });
    }

    this.getMomStatus = function(json_data){
        return $http({
            method:'POST',
            'data':json_data,
            'url':'https://mom-apicalls.appspot.com/api/get/online/status/'
        });
    }

    // this.checkSums = function(json_data){
    //     // var myJSON = JSON.stringify(json_data);
    //     var url = "https://mom-apicalls.appspot.com/api/genrate/checksum/?mobile="+ json_data.mobile+"&orderId="+json_data.orderId+"&TXN_AMOUNT="+json_data.TXN_AMOUNT
    //     return $http({
    //         method:'GET',
    //         'url': url
    //     });
    // }

    this.checkSums = function(json_data){
        // var url = "https://mom-apicalls.appspot.com/api/genrate/checksum/web/"
        return $http({
            method:'POST',
            'data': json_data,
            'url': 'https://mom-apicalls.appspot.com/api/genrate/checksum/web/'
        });
    }

     this.pagination = function(json_data){
        var url = "https://mom-apicalls.appspot.com/customer/get/vendor/list/paginated/"+ json_data.num+'/'
        return $http({
            method:'POST',
            'data': json_data,
            'url': url
        });
    }

    

    this.orderIdGenerate = function(json_data){
        var url = "https://mom-apicalls.appspot.com/customer/generate/orderid/online/"
        return $http({
            method:'POST',
            'data': json_data,
            'url': url
        });
    }
    
    this.uploadImage = function(files){
        var form_data = new FormData();
        form_data.append('file', files[0]);        
        return $http({
            method:'POST',
            data:form_data,
            headers:{
                'Content-Type': undefined
            },
            transformRequest:angular.identity, 
            url:'https://mom-apicalls.appspot.com/api/mtrack/file/upload/'
        });
    }

    this.getOfferList = function(){
        return $http({
            method:'POST',
            'url':'https://mom-apicalls.appspot.com/api/get/offer/section/'
        });
    }
    this.applyPromoCode = function(json_data){
        return $http({
            method:'POST',
            'data':json_data,
            'url':'https://mom-apicalls.appspot.com/customer/apply/promocode/'
        });
    }
    this.placed_order = function(json_data){
        return $http({
            method:'POST',
            'data':json_data,
            'url':'https://mom-apicalls.appspot.com/customer/add/order/list/updated/web/'
        });
    }

    this.placed_order_online = function(json_data){
        return $http({
            method:'POST',
            'data':json_data,
            'url':'https://mom-apicalls.appspot.com/customer/add/order/list/updated/web/online/'
        });
    }

    this.getFavouriteList = function(json_data){
        return $http({
            method:'POST',
            'data':json_data,
            'url':'https://mom-apicalls.appspot.com/customer/get/favourate/mom/'
        });
    }

     this.getVendorList = function(json_data){
            return $http({
                method:'POST',
                'data':json_data,
                'url':'https://mom-apicalls.appspot.com/customer/get/vendor/list/'
            });
        }
        this.getVendorMenu = function(json_data){
            return $http({
                method:'POST',
                'data':json_data,
                'url':'https://mom-apicalls.appspot.com/api/get/menu/web/updated/'
            }).then(function(response){
            return response.data.menu_data;
        }).catch(function(response){
            console.log("Error in getting employee list");
        });
        }
        this.getFavourate = function(json_data){
            return $http({
                method:'POST',
                'data':json_data,
                'url':'https://mom-apicalls.appspot.com/customer/get/favourate/mom/'
            });
        }
         this.makeFavourite = function(json_data){
            return $http({
                method:'POST',
                'data':json_data,
                'url':'https://mom-apicalls.appspot.com/customer/favourate/mom/'
            });
        }
         this.makeNoneFavourite = function(json_data){
            return $http({
                method:'POST',
                'data':json_data,
                'url':'https://mom-apicalls.appspot.com/customer/favourate/mom/'
            });
        }
        this.addAddressMethod = function(json_data){
            return $http({
                method:'POST',
                'data':json_data,
                'url':'https://mom-apicalls.appspot.com/customer/add/user/address/'
            });
        }
        this.getAddress = function(json_data){
            return $http({
                method:'POST',
                'data':json_data,
                'url':'https://mom-apicalls.appspot.com/customer/get/address/'
            });
        }
        this.orderedList = function(json_data){
            return $http({
                method:'POST',
                'data':json_data,
                'url':'https://mom-apicalls.appspot.com/customer/get/new/order/list/'
            });
        }
        this.onGoing = function(json_data){
            return $http({
                method:'POST',
                'data':json_data,
                'url':'https://mom-apicalls.appspot.com/customer/get/customer/running/order/'
            });
        }
        this.historyList = function(json_data){
            return $http({
                method:'POST',
                'data':json_data,
                'url':'https://mom-apicalls.appspot.com/customer/get/complete/order/list/datewise/'
            });
        }
        this.cancleOrder = function(json_data){
            return $http({
                method:'POST',
                'data':json_data,
                'url':'https://mom-apicalls.appspot.com/customer/cancel/order/'
            });
        }
        this.textAppLink = function(json_data){
            return $http({
                method:'POST',
                'data':json_data,
                'url':'https://mom-apicalls.appspot.com/api/send/link/'
            });
        }
        this.emailAppLink = function(json_data){
            return $http({
                method:'POST',
                'data':json_data,
                'url':'https://mom-apicalls.appspot.com/api/send/email/'
            });
        }
        this.sendMessage = function(json_data){
            // alert("hello");
            return $http({
                method:'POST',
                'data':json_data,
                'url':'https://mom-apicalls.appspot.com/api/add/contact/us/'
            });
        }
        this.momChefRegister = function(json_data){
            return $http({
                method:'POST',
                'data':json_data,
                'url':'https://mom-apicalls.appspot.com/api/add/vendor/web/'
            });
        }
        
        
        
});
(function () {
    'use strict';
 
    angular
        .module('coreuiApp')
        .factory('AuthenticationService', AuthenticationService);
 
    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$timeout'];
    function AuthenticationService($http, $cookies, $rootScope, $timeout) {
        var service = {};
 
        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
 
        return service;
 
        function Login(username, password,callback) {
 
             var json_data = {
                'username':username,
                'password' : password,
            }

            $http.post('https://serv-partner.appspot.com/api/amc/admin/login/', { json_data })
               .then(function (response) {
                   callback(response);
                   

               });
 
        }
 
        function SetCredentials(username, password, id, datasets) {
            var authdata = Base64.encode(username + ':' + password);
 
            $rootScope.globals = {
                currentUser: {
                    username: username.toUpperCase(),
                    id: id,
                    authdata: authdata,
                    resp_datasets: datasets,



                },
                loggedIn : 1
            };
 
            // set default auth header for http requests
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
 
            // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 365);
            $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });
        }
 
        function ClearCredentials() {
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 1);
            $rootScope.globals = {loggedIn : 0};
            $cookies.remove('globals');
            $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });
            // $cookies.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic';
        }
    }
 
    // Base64 encoding service used by AuthenticationService
    var Base64 = {
 
        keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
 
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
 
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
 
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
 
                output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
 
            return output;
        },
 
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
            do {
                enc1 = this.keyStr.indexOf(input.charAt(i++));
                enc2 = this.keyStr.indexOf(input.charAt(i++));
                enc3 = this.keyStr.indexOf(input.charAt(i++));
                enc4 = this.keyStr.indexOf(input.charAt(i++));
 
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
 
                output = output + String.fromCharCode(chr1);
 
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
 
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
 
            } while (i < input.length);
 
            return output;
        }
    };
 
})();
app.factory('User', function($rootScope, $cookies) {
    // var user = JSON.parse(JSON.stringify($window.user))

    $rootScope.globals = $cookies.getObject('globals') || {};
    if ($rootScope.globals.currentSession) {
        var user_obj = $rootScope.globals.currentSession;
    }else{
        var user_obj = {}; 
    }

        
    var userInfo = function(){
        return user_obj;
    }

    return {
        isLoggedIn: function(){
            if ("userId" in user_obj) {
                return true;
            }else{
                return false;
            }
            return false;
        },
        getUser: function() {
            return user_obj;
        },
        getFirstName: function() {
            if ("name" in user_obj)
                return user_obj["name"].split(" ")[0];
            else
                return "";
        },
        getUserId : function(){
            if ("userId" in user_obj)
                return user_obj["userId"]
            else
                return "";
        }
    }
});
