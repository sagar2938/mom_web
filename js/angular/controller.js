app.run(function($rootScope, $location, $cookies, $http, $state, User, AuthenticationService, $timeout, $localStorage, $window, URI, $templateCache, $http, Data) {
  $rootScope.isViewLoading = true;
  console.log(User.isLoggedIn());
  // console.log($rootScope.globals);
  // if (User.isLoggedIn()) {
  //   $localStorage.username = $rootScope.globals.currentSession.name;
  //   if ($location.path() == '/login') {
  //     $location.path('/main/home');
  //   } else {
  //     $location.path($location.path());
  //   }
  // } else {
  //   $location.path('/');
  //   // $location.path($location.path());
  // }

  $rootScope.logout = function() {
    AuthenticationService.ClearCredentials();
    $timeout(function() {
      $location.path('/login');
    }, 1000);
    $localStorage.imgsrc = '';
  }
});
app.controller('AppController', ['$scope', '$route', function ($scope, $route) {
$scope.reloadRoute = function () {
$route.reload();
};
}]);


app.controller("loginCtrl", ['$scope', '$rootScope', '$location','$cookies','$localStorage', '$state','Data', '$base64','$timeout', 'AuthenticationService', 'notify', function($scope, $rootScope, $location,$cookies, $localStorage,$state, Data, $base64, $timeout, AuthenticationService, notify){
  $scope.signIn = function(){
      // var latitude = document.getElementById('lat').value;
      // var longitude = document.getElementById('lon').value;
      // console.log(latitude);
      // console.log(longitude)
      
      var mobile = document.getElementById('user_mobile').value;
      $localStorage.mobile = mobile;
      var otp = Math.floor(1000 + Math.random() * 9000);
      
      if(mobile !== ''){
       var json_data = {
          'mobile': mobile,
          'otp': otp,
        }
        console.log(json_data)
         Data.signIn(json_data)
        .then(function(response){ 
          console.log(response);
          if(response.data.response.confirmation == 1){
            $rootScope.globals = {
              currentSession: {
                name: response.data.response.name,
                userId: response.data.response.mobile,
                email: response.data.response.password,
              }
            };
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 7);
            $cookies.putObject('globals', $rootScope.globals, {
              expires: cookieExp
            });
            //Set Credentials Ends Here//
            $localStorage.username = response.data.response.name;
            $localStorage.userid = response.data.response.mobile;
            $localStorage.status = response.data.response.confirmation;
            $localStorage.user_email = response.data.response.email;
            // alert(JSON.stringify(response.data.response))
            // $localStorage.latitude = latitude;
            // $localStorage.longitude = longitude;
            $localStorage.image =response.data.response.profile_image;
            // $localStorage.latitude = response.data.response.latitude;
            // $localStorage.longitude = response.data.response.longitude;
            // console.log($localStorage.latitude)
            // console.log($localStorage.longitude)
            // $location.path('/snp/customer-list');
             window.location = "#!/otp-page";
            $localStorage.Otp = json_data.otp;
          }
          else{
            notify("User Not Exist!!");
             window.location = "#!/page-register";
          }
        }).catch(function(response){

        })
      }
      else{
        notify("Enter User Mobile No");
      }
  }
}]); 
 
app.controller("signUpCtrl", ['$scope', '$rootScope', '$location','$cookies','$localStorage', '$state','Data', '$base64','$timeout', 'notify', function($scope, $rootScope, $location,$cookies, $localStorage,$state, Data, $base64, $timeout, notify){
  $scope.signUp = function(){
    // alert("jkgj")
      var user_name = document.getElementById('user_name').value;     
      var user_email = document.getElementById('user_email').value;
      var user_mobile = document.getElementById('user_mobile').value;
      // var address = document.getElementById('demo').value;
      // var latitude = document.getElementById('lat').value;
      // var longitude = document.getElementById('lon').value;
      var otp = Math.floor(1000 + Math.random() * 9000);
      $localStorage.mobile = user_mobile;
      $localStorage.name = user_name;
      if(user_name != '' && user_email != '' && user_mobile != ''){
         var json_data = {
            'name': user_name,
            'email': user_email,
            'mobile': user_mobile,
            'address': '',
            'latitude': '',
            'longitude': '',
            'otp': otp,
          }
          console.log(json_data)
           Data.signUp(json_data)
          .then(function(response){
            console.log(response)
            if(response.data.response.confirmation == 1){
            $rootScope.globals = {
              currentSession: {
                name: response.data.response.name,
                userId: response.data.response.mobile,
                email: response.data.response.email,
              }
            };
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 7);
            $cookies.putObject('globals', $rootScope.globals, {
              expires: cookieExp
            });
            //Set Credentials Ends Here//
            // $localStorage.username = response.data.response.name;
            // $localStorage.userid = response.data.response.mobile;
            $localStorage.status = response.data.response.confirmation;
            // $localStorage.latitude = latitude;
            // $localStorage.longitude = longitude;

            $localStorage.Otp = response.data.response.otp;
            $localStorage.userid = response.data.response.mobile;
            $localStorage.latitude = response.data.response.latitude;
            $localStorage.longitude = response.data.response.longitude;
            $localStorage.name = response.data.response.name;
            console.log($localStorage.Otp)
            // $localStorage.image =response.data.response.profile_image;
            // $localStorage.latitude = response.data.response.latitude;
            // $localStorage.longitude = response.data.response.longitude;
            // console.log($localStorage.latitude)
            // console.log($localStorage.longitude)
            // $location.path('/snp/customer-list');
             window.location = "#!/otp-page";
            // $localStorage.Otp = json_data.otp;
          }
          
          }).catch(function(response){

          })
      }
      // else if(address == ''){
      //   notify("Enter Address")
      // }
      // else if(latitude == '' && longitude == ''){
      //   notify("Address not Found")
      // }
      else if(user_name == ''){
        notify("Enter Name")
      }
      else if(user_email == ''){
        notify("Enter Email")
      }
      else if(user_mobile == ''){
        notify("Enter Mobile")
      }
    }
}]);


app.controller("otpPageCtrl", ['$scope', '$rootScope', '$location', '$cookies', '$localStorage', '$state', 'Data', '$base64', '$timeout', 'AuthenticationService', 'notify', function($scope, $rootScope, $location, $cookies, $localStorage, $state, Data, $base64, $timeout, AuthenticationService, notify) {
  var Otp = $localStorage.Otp;
  $scope.resendOtp = function(){
    var json_data = {
      'mobile':$localStorage.mobile,
      'otp': $localStorage.Otp,
    }
    // alert(JSON.stringify(json_data))
    Data.resendOtp(json_data)
    .then(function(response){
      // alert(JSON.stringify(response))
    // console.log(response)
    }).catch(function(response){

    })
  }
  $scope.OTP = function(){
    n1= document.getElementById('n1').value;
    n2= document.getElementById('n2').value;
    n3= document.getElementById('n3').value;
    n4= document.getElementById('n4').value;

    var fileName = n1+n2+n3+n4
    console.log(fileName);
    if (fileName == Otp){
      // alert("hii")
          window.location = "#!/main-login/login-home";
          // window.location.reload();
    }
    else{
        $scope.wrongotp = true;
    }

    }
    
}]);

app.controller("mainCtrl", ['$scope', '$rootScope', '$location', '$cookies', '$localStorage', '$state', 'Data', '$base64', '$timeout', 'AuthenticationService', 'notify', function($scope, $rootScope, $location, $cookies, $localStorage, $state, Data, $base64, $timeout, AuthenticationService, notify) {
    document.getElementById("demo").disabled = true;     
    $scope.conf = $localStorage.status;
    console.log($localStorage.status)
    $scope.updateAddress = function(){
      window.location.href = "#!/main-login/login-home";
    }
    $scope.address_use = $localStorage.demo;
    // alert($localStorage.demo)
    // $scope.conf = $localStorage.status;
    $scope.image = $localStorage.image;
    $scope.user_name = $localStorage.username;
    $scope.txtphone = $localStorage.userid;
    $scope.txtmail = $localStorage.user_email;
    var image = $localStorage.image;
    // alert($localStorage.user_email)
    $("#user_email").val($scope.user_email);
    // document.getElementById('user_email').value = $scope.user_email;
    console.log($localStorage.status)
    $scope.updateAddress = function(){
      window.location.href = "#!/main-login/login-home";
    }
    $scope.address_use = $localStorage.demo;


    //================ image upload ===================
     $scope.uploadFile = function() {
        $rootScope.isViewLoading = true;
        // alert("hi")
        var filename = event.target.files[0].name;
        $localStorage.filename = filename;
        // return filename
        console.log(filename);
        Data.uploadImage(event.target.files).then(function(response) {
          console.log(response)
          // alert(JSON.stringify(response.data.image))
          $localStorage.image = response.data.image;
          // alert(image)
          $rootScope.isViewLoading = false;
        }).catch(function(response) {});
      }
    // alert($localStorage.demo)
    $scope.update_profile = function(){
      // var image = document.getElementById('blah').value;
      var user_name = document.getElementById('user_name').value;
      var user_mobile = document.getElementById('user_mobile').value;
      var user_email = document.getElementById('user_email').value;

      var json_data = {
        'mobile': user_mobile,
        'name': user_name,
        'email': user_email,
        'profileImage': $localStorage.image,
      }
      // alert(JSON.stringify(json_data))
      Data.update_profile(json_data).then(function(response) {
        console.log(response)
        window.location.reload();
        // alert(JSON.stringify(response))
        $scope.image = $localStorage.image;
        // alert($scope.image)
        $('#profile_update').modal('hide');  
      }).catch(function(response) {})
    }

      var json_data = {
        'mobile': $localStorage.userid,
      }
      Data.getProfilePic(json_data).then(function(response) {
        // alert(JSON.stringify(response.data.response.profile_image))
        // console.log(response)
        // // alert(JSON.stringify(response))
        $scope.image = response.data.response.profile_image;
        // // alert($scope.image)
        // $('#profile_update').modal('hide');  
      }).catch(function(response) {})
}]);

app.controller("mainLoginCtrl", ['$scope', '$rootScope', '$location', '$cookies', '$localStorage', '$state', 'Data', '$base64', '$timeout', 'AuthenticationService', 'notify', function($scope, $rootScope, $location, $cookies, $localStorage, $state, Data, $base64, $timeout, AuthenticationService, notify) {
    $scope.conf = $localStorage.status;
    $scope.status = $localStorage.status;
    $scope.image = $localStorage.image;
    $scope.user_name = $localStorage.username;
    $scope.txtphone = $localStorage.userid;
    $scope.txtmail = $localStorage.user_email;
    $scope.login_signUp = true;
    if($scope.status === 1){
      $scope.login_signUp = false;
    }

    //================ image upload ===================
     $scope.uploadFile = function() {
        $rootScope.isViewLoading = true;
        // alert("hi")
        var filename = event.target.files[0].name;
        $localStorage.filename = filename;
        // return filename
        console.log(filename);
        Data.uploadImage(event.target.files).then(function(response) {
          // alert(JSON.stringify(response))
          $localStorage.image = response.data.image;
          alert(image)
          $rootScope.isViewLoading = false;
        }).catch(function(response) {});
      }
    // alert($localStorage.demo)
    $scope.update_profile = function(){
      // var image = document.getElementById('blah').value;
      var user_name = document.getElementById('user_name').value;
      var user_mobile = document.getElementById('user_mobile').value;
      var user_email = document.getElementById('user_email').value;

      var json_data = {
        'mobile': user_mobile,
        'name': user_name,
        'email': user_email,
        'profileImage': $localStorage.image,
      }
      // alert(JSON.stringify(json_data))
      Data.update_profile(json_data).then(function(response) {
        console.log(response)
        window.location.reload();
        // alert(JSON.stringify(response))
        $scope.image = $localStorage.image;
        // alert($scope.image)
        $('#profile_update').modal('hide');  
      }).catch(function(response) {})
    }

     var json_data = {
        'mobile': $localStorage.userid,
      }
      Data.getProfilePic(json_data).then(function(response) {
        // alert(JSON.stringify(response.data.response.profile_image))
        // console.log(response)
        // // alert(JSON.stringify(response))
        $scope.image = response.data.response.profile_image;
        // // alert($scope.image)
        // $('#profile_update').modal('hide');  
      }).catch(function(response) {})
    // alert($scope.status)
}]);

app.controller("loginHomeCtrl", ['$scope', '$rootScope', '$location','$cookies','$localStorage', '$state','Data', '$base64','$timeout', 'AuthenticationService', 'notify', function($scope, $rootScope, $location,$cookies, $localStorage,$state, Data, $base64, $timeout, AuthenticationService, notify){
  $scope.locatedAddress = function(){
    var latitude = document.getElementById('lat').value;
    var longitude = document.getElementById('lon').value;
    var address = document.getElementById('location').value;
    if(address != "" && longitude != "" && longitude != ""){
      $localStorage.demo = address;
      $localStorage.latitude = latitude;
      $localStorage.longitude = longitude;
      window.location = "#!/main/home";
    }
    else{
      notify("Please Enter Your Address !!")
    }
    
  }
}]); 
app.controller("ongoingCtrl", ['$scope', '$rootScope', '$location','$cookies','$localStorage', '$state','Data', '$base64','$timeout', 'AuthenticationService', function($scope, $rootScope, $location,$cookies, $localStorage,$state, Data, $base64, $timeout, AuthenticationService){
      // var startdate = document.getElementById('from').value;
      // var enddate = document.getElementById('to').value;
      $scope.profileImage = $localStorage.image;
      var json_data = {
        "mobile": $localStorage.userid,
      }
      // alert(JSON.stringify(json_data))
      console.log(json_data)
      Data.orderedList(json_data).then(function(response) {
        console.log(response.data.order_data)
        // alert(JSON.stringify(response.data.order_data))
        $scope.order_list = response.data.order_data;
        console.log($scope.order_list)
      }).catch(function(response) {})
  
    var json_data = {
       "mobile": $localStorage.userid,
       // "start_date":startdate,
       //  "end_date":enddate,
    }
    // var startdate = document.getElementById('from1').value;
    // var enddate = document.getElementById('to1').value;
    console.log(json_data)
    Data.onGoing(json_data).then(function(response) {
      console.log(response)
      $scope.onging_list = response.data.order_data;
    }).catch(function(response) {})
    var from2 = document.getElementById('from2').value;
    var to2 = document.getElementById('to2').value;
    var json_data = {
       "mobile": $localStorage.userid,
       "start_date": from2,
        "end_date": to2,
    }
    console.log(json_data)
    Data.historyList(json_data).then(function(response) {
      $scope.history_list = response.data.order_data;
      console.log(response)
    }).catch(function(response) {})

    $scope.lead = function(){
      var startdate = document.getElementById('from').value;
      var enddate = document.getElementById('to').value;
      var json_data = {
        "mobile": $localStorage.userid,
        "start_date":startdate,
        "end_date":enddate,
      }
      Data.orderedList(json_data).then(function(response) {
        console.log(response)
        $scope.order_list = response.data.order_data;
        console.log($scope.order_list)
      }).catch(function(response) {})
    }

    // $scope.acceptedList = function(){
    //   var startdate = document.getElementById('from1').value;
    //   var enddate = document.getElementById('to1').value;
    //   var json_data = {
    //     "mobile": $localStorage.userid,
    //     "start_date":startdate,
    //     "end_date":enddate,
    //   }
    //    Data.onGoing(json_data).then(function(response) {
    //     console.log(response)
    //     $scope.onging_list = response.data.order_data;
    //   }).catch(function(response) {})
    // }
    $scope.reached = function(){
     var startdate = document.getElementById('from2').value;
      var enddate = document.getElementById('to2').value;
      var json_data = {
        "mobile": $localStorage.userid,
        "start_date":startdate,
        "end_date":enddate,
      }
      Data.historyList(json_data).then(function(response) {
        $scope.history_list = response.data.order_data;
        console.log(response)
      }).catch(function(response) {})
    }
    $scope.cancleOrder = function(orderId){
      var json_data = {
       "orderId": orderId,
      }
      console.log(json_data)
      Data.cancleOrder(json_data).then(function(response) {
        console.log(response)
        $('#cancleModal' + orderId).modal('hide');
        window.location.reload();
      }).catch(function(response) {})
    }
    $scope.repeatOrder = function(history){
      // alert(JSON.stringify(history))
      $localStorage.repeatAddress = history.location;
      var repeatProductList = [];
      window.location.href = "#!/reorder/reorderCheckout";
      angular.forEach(history.productList, function(value, key) {
        repeatProductList.push({id:parseInt(value.itemId),qty:parseInt(value.quantity),itemName:value.food_item,fullPrice:parseInt(value.itemActualPrice),halfPrice:"",quarter:"",item_image:value.image,quarterPrice:"",mobile:value.mobile,itemDescription:value.food_item,full:"",half:"",food_type:value.pType,itemGroup:""}); 
      });
      $rootScope.item_cart_dict = repeatProductList;
      $cookies.putObject('item_cart', $rootScope.item_cart_dict);
      $cookies.put('momId', $localStorage.mobile);
      // alert(JSON.stringify(history))
    }
}]);
app.controller("homeCtrl", ['$scope', '$rootScope', '$location','$cookies','$localStorage', '$state','Data', '$base64','$timeout', 'AuthenticationService','$http', function($scope, $rootScope, $location,$cookies, $localStorage,$state, Data, $base64, $timeout, AuthenticationService, $http){
        // alert("hii")
        $scope.no_momChef = false;
        console.log($localStorage.report)
         Data.getOfferList()
        .then(function(response){
          console.log(response)
          $scope.offerList = response.data.offer;
          console($scope.offerList)
        }).catch(function(response){

        })
        // $localStorage.latitude_m = latitude;
        // $localStorage.longitude_m = longitude;
        console.log($localStorage.userid)
        var mobile = $localStorage.userid;
        var latitude = $localStorage.latitude;
        var longitude = $localStorage.longitude;
        console.log(longitude)
        var json_data = {
          'mobile': mobile,
          'latitude': latitude,
          'longitude': longitude,
        }
        console.log(json_data)
         Data.getFavouriteList(json_data)
        .then(function(response){
          console.log(response)
          $scope.momList = response.data.mom_data;
          var length = response.data.mom_data.length;
          // angular.forEach($scope.momList, function(value, key) {
          //   // var flag = 1;
          //   // $scope.momList.push(flag + ":" + 1);
          //   alert(JSON.stringify(value))
          // });
          $scope.favourite_mom = true;
          $scope.no_momChef = false;
          if(length === 0){
            $scope.favourite_mom = false;
            $scope.no_momChef = true;

          }
        }).catch(function(response){

        })

        var latitude = $localStorage.latitude;
        var longitude = $localStorage.longitude;
        console.log(latitude)
        var mobile = $localStorage.userid;
        // pagination





        var json_data = {
          'latitude': $localStorage.latitude,
          'longitude': $localStorage.longitude,
          'mobile': mobile,
        }
        console.log(json_data)
         Data.getVendorList(json_data)
        .then(function(response){
          console.log(response)
          $scope.topratedList = response.data.toprated_list;
          $scope.vendorList = response.data.vendor_data;
          // $localStorage.vendorList = $scope.vendorList;
          $scope.currentPage = 1;
          $scope.pageSize = 4;
          $scope.meals = [];
          // var vendorList = $localStorage.vendorList;
            angular.forEach($scope.vendorList, function (value, key) { 
                $scope.meals.push(value);
            }); 
            // });
          
          $scope.pageChangeHandler = function(num) {
            // alert(num)
            // var json_data = {
            //     'latitude': $localStorage.latitude,
            //     'longitude': $localStorage.longitude,
            //     'mobile': $localStorage.userid,
            //   }
            //   console.log('meals page changed to ' + num);
            //   $scope.meals=[]
            //   var pageNo =  num - 1;
            //   $http({
            //         method:'POST',
            //         'data': json_data,
            //         'url': "https://mom-apicalls.appspot.com/customer/get/vendor/list/paginated/"+ pageNo +'/'
            //     }).then(function(response){ 
            //     //ajax request to fetch data into $scope.data
            //     alert(JSON.stringify(response.data.vendor_data.length))
            //     angular.forEach(response.data.vendor_data, function (value, key) { 
            //         $scope.meals.push(value); 
            //     }); 
            // });
          };
          console.log($scope.vendorList)
          $scope.top_rated_list = true;
            $scope.vendor_list = true;
            $scope.no_momChef = false;
          if(response.data.toprated_list.length == 0 || response.data.vendor_data.length == 0){
            $scope.top_rated_list = false;
            $scope.vendor_list = false;
            $scope.no_momChef = true;
          }
          // console($scope.offerList)
        }).catch(function(response){

        })
        $scope.getVenderData =function(id,mobile,firstName,mname,lname,description,rating,specialization,image,address,mobile,flag,lat,long){
          // alert("hii")
          $localStorage.mobile = mobile;
          // alert($localStorage.mom_lat)
          // alert($localStorage.mom_long)
          var json_data = {
            'mobile': $localStorage.mobile,
          }
          // alert(JSON.stringify(json_data))
           Data.getMomStatus(json_data)
          .then(function(response){
            // alert(JSON.stringify(response.data.response.status))
            if(response.data.response.statusInt == 1){
            window.location.href = "#!/main/get-vendor-list";
              $localStorage.flag = flag;
              $localStorage.id = id;
              
              if(mname !== null){           
                $localStorage.full_name = firstName + " "+mname +" "+lname;
              } 
              else{
                $localStorage.full_name = firstName+" "+lname;
              }         
              $localStorage.image = image;
              $localStorage.description = description;
              $localStorage.rating = rating;
              $localStorage.specialization = specialization;
              $localStorage.address = address;
              $localStorage.mom_mobile = mobile;
              $localStorage.mom_lat = lat;
              $localStorage.mom_long = long;
            // notify("Successfully Send !!")
          }
          else if(response.data.response.statusInt == 0){
            $('#myModal').modal('show');
          }
          }).catch(function(response){

          })
        }
        $scope.getFabData =function(id,mobile,firstName,mname,lname,description,rating,specialization,image,address,lat,long){
          
          $localStorage.mobile = mobile;
          var json_data = {
            'mobile': $localStorage.mobile,
          }
          // alert(JSON.stringify(json_data))
           Data.getMomStatus(json_data)
          .then(function(response){
            // alert(JSON.stringify(response.data))
            if(response.data.response.statusInt == 1){
              window.location.href = "#!/main/get-vendor-list";
              // $localStorage.status_fav = 1;
              var flag = 1;
              $localStorage.flag = flag;
              $localStorage.id = id;
              $localStorage.mobile = mobile;
              if(mname !== null){           
                $localStorage.full_name = firstName + " "+mname +" "+lname;
              } 
              else{
                $localStorage.full_name = firstName+" "+lname;
              }         
              $localStorage.image = image;
              $localStorage.description = description;
              $localStorage.rating = rating;
              $localStorage.specialization = specialization;
              $localStorage.address = address;
              $localStorage.mom_mobile = mobile;
              $localStorage.mom_lat = lat;
              $localStorage.mom_long = long;
            }
            else if(response.data.response.statusInt == 0){
            $('#myModal').modal('show');
          }
            // notify("Successfully Send !!")
          }).catch(function(response){

          })
          // alert(lat)
          // alert($localStorage.user_lat)
        }

        $scope.textAppLink = function(){
          var user_mobile = document.getElementById('Mobile').value;
          var json_data = {
          'mobile': user_mobile,
        }
        console.log(json_data)
         Data.textAppLink(json_data)
        .then(function(response){
          console.log(response)
          notify("Successfully Send !!")
        }).catch(function(response){

        })
        }
        $scope.emailAppLink = function(){
          var user_email = document.getElementById('Email').value;
          var json_data = {
          'email': user_email,
        }
        console.log(json_data)
         Data.emailAppLink(json_data)
        .then(function(response){
          console.log(response)
          notify("Successfully Send !!")
        }).catch(function(response){

        })
        }

        // $scope.currentPage = 1;
        //  $scope.limit= 10;


        //   $scope.tracks = [];
        //   getData();


        //   function getData() {
        //     $http.get("https://api.spotify.com/v1/search?query=iron+&offset="+($scope.currentPage-1)*$scope.limit+"&limit=20&type=artist")
        //       .then(function(response) {
        //         $scope.totalItems = response.data.artists.total
        //         angular.copy(response.data.artists.items, $scope.tracks)


        //       });
        //   }

        // //get another portions of data on page changed
        //   $scope.pageChanged = function() {
        //     getData();
        //   };

        // function MyController($scope) {

  

  // var dishes = [
  //   'noodles',
  //   'sausage',
  //   'beans on toast',
  //   'cheeseburger',
  //   'battered mars bar',
  //   'crisp butty',
  //   'yorkshire pudding',
  //   'wiener schnitzel',
  //   'sauerkraut mit ei',
  //   'salad',
  //   'onion soup',
  //   'bak choi',
  //   'avacado maki'
  // ];
  // var sides = [
  //   'with chips',
  //   'a la king',
  //   'drizzled with cheese sauce',
  //   'with a side salad',
  //   'on toast',
  //   'with ketchup',
  //   'on a bed of cabbage',
  //   'wrapped in streaky bacon',
  //   'on a stick with cheese',
  //   'in pitta bread'
  // ];
  // for (var i = 1; i <= 100; i++) {
  //   var dish = dishes[Math.floor(Math.random() * dishes.length)];
  //   var side = sides[Math.floor(Math.random() * sides.length)];
  //   // $scope.meals.push('meal ' + i + ': ' + dish + ' ' + side);
  // }
  // var pageNo =  $scope.currentPage - 1;
  // // alert(pageNo)

  // var json_data = {
  //       'latitude': $localStorage.latitude,
  //       'longitude': $localStorage.longitude,
  //       'mobile': $localStorage.userid,
  //     }
  //     // console.log('meals page changed to ' + num);
  //     $http({
  //           method:'POST',
  //           'data': json_data,
  //           'url': "https://mom-apicalls.appspot.com/customer/get/vendor/list/paginated/"+ pageNo +'/'
  //       }).then(function(response){ 
  //       //ajax request to fetch data into $scope.data
  //       alert(JSON.stringify(response.data.vendor_data.length))
  //       var vendor_list = response.data.vendor_data;

// }

// function OtherController($scope) {
  // $scope.pageChangeHandler = function(num) {
  //   console.log('going to page ' + num);
  // };
// }
       
}]);

app.controller("PosController", ['$scope', '$rootScope', '$location','$cookies','$localStorage', '$state','Data', '$base64','$timeout', 'AuthenticationService', 'notify',  function($scope, $rootScope, $location,$cookies, $localStorage,$state, Data, $base64, $timeout, AuthenticationService, notify){
        // var mom_id = $localStorage.mom_mobile;
        $rootScope.momId = $cookies.get('momId') || "";
         // $cookies.remove('item_cart')
       
        $rootScope.item_cart_dict = $cookies.getObject('item_cart') || {};
        $scope.order = [];
        if  ($rootScope.item_cart_dict !={} ){
            Object.keys($rootScope.item_cart_dict).forEach(function(key) {
              if ($rootScope.item_cart_dict[key]!=null){
                // alert($rootScope.item_cart_dict[key].id);
                $scope.order.push($rootScope.item_cart_dict[key]);

              }
            });
         
        }
        // alert(JSON.stringify($rootScope.item_cart_dict))
        console.log($rootScope.item_cart_dict)
        // $localStorage.id = id;
        // $localStorage.mobile = mobile;
        // var pathArray = window.location.href.split('=');
        // var Id = pathArray[1].split('&');
        var id = $localStorage.id;
        var mobile = $localStorage.mobile;
        
        // alert($rootScope.momId)
        if($rootScope.momId != ""){
          // alert($rootScope.momId)
        if ($localStorage.mobile !=  $rootScope.momId ){
            // alert($rootScope.momId)
            
            // alert($rootScope.momId)
            $('#myModal').modal('show');

        }
      }
        // alert(mobile)
        $scope.name = $localStorage.full_name;
        $scope.description = $localStorage.description;
        $scope.rating = $localStorage.rating;
        $scope.specialization =  $localStorage.specialization;
        $scope.image = $localStorage.image;
        $scope.address = $localStorage.address;
        // alert($scope.name)


        var cart_obj = {}
        if($localStorage.cart_obj != undefined){
          cart_obj = $localStorage.cart_obj;
        }
       
        var json_data = {
          'id': id,
          'mobile':mobile,
        }
        console.log(json_data)
         Data.getVendorMenu(json_data)
        .then(function(response){
          console.log(response);
          $scope.products = response;
          $localStorage.cartResponse = JSON.parse(JSON.stringify(response));
          // window.location.reload();
        });
        console.log($localStorage.cartResponse)
        // window.location.reload();
        $scope.drinks = $localStorage.cartResponse;
        
        $scope.new = {};
        $scope.totOrders = 0;

    var url = window.location.protocol + "://" + window.location.host + "/" + window.location.pathname;

    $scope.getDate = function () {
        var today = new Date();
        var mm = today.getMonth() + 1;
        var dd = today.getDate();
        var yyyy = today.getFullYear();

        var date = dd + "/" + mm + "/" + yyyy

        return date
    };
    $scope.vegList = false;
    $scope.commonList = true;
    $scope.valueChanged = function(){
        // if($('.coupon_question').is(":checked")) {
          if($scope.togBtn == true){
             $scope.vegList = true;
            $scope.commonList = false;
         
        }  
          
        else{
              $scope.vegList = false;
              $scope.commonList = true;
        }
         
    }
    
    // alert($localStorage.flag)
    if($localStorage.flag == 1){
      // alert($localStorage.flag)
      $scope.makenonefavourite = true;
      $scope.makefavourite = false;
    }
    else{
      // alert($localStorage.flag)
      $scope.makenonefavourite = false;
      $scope.makefavourite = true;
    }
    // if($localStorage.status_fav == 1){
    //   // alert($localStorage.status_fav)
    //   $scope.makenonefavourite = true;
    //   $scope.makefavourite = false; 
    // }
    var latitude = $localStorage.latitude;
    var longitude = $localStorage.longitude; 
        // toogle button
      var switchStatus = false;
      $scope.makeFavourite = function(){
        if($localStorage.userid == undefined){
          notify("Please Login!!")
        }
        else{
          var json_data = {
          'mobile':$localStorage.userid,
          'momId': ($localStorage.id).toString(),
          'latitude': latitude,
          'longitude': longitude,
          }
          console.log(json_data)
           Data.makeFavourite(json_data)
          .then(function(response){
            // alert(JSON.stringify(response))
            // if(data.response.confirmation === 1){
              $scope.makefavourite = false;
              $scope.makenonefavourite = true;
            // }
            
          }).catch(function(response){

          })
        }
        
      }
      $scope.makeNoneFavourite = function(){
        
        var json_data = {
          'mobile':$localStorage.userid,
          'momId': ($localStorage.id).toString(),
          'latitude': latitude,
          'longitude': longitude,
        }
        console.log(json_data)
         Data.makeNoneFavourite(json_data)
        .then(function(response){
          $scope.makefavourite = true;
        $scope.makenonefavourite = false;
        }).catch(function(response){

        })
      }
   
   
    // $rootScope.momId = mom_id;
    
    // alert($rootScope.momId);

    $scope.addToOrder = function (item, qty) {
      // alert(JSON.stringify(item))
      if($rootScope.momId != ""){
        
          // alert($rootScope.momId)
        if ($localStorage.mobile !=  $rootScope.momId ){
            $('#myModal').modal('show');

        }else{
          // alert("hii")
        $scope.promo = "";
        $scope.total_apply_promo = false;
        $scope.total_withoutapply_promo = true;
        $scope.promo_apply_price = false;
        $scope.promo_withoutapply_price = true;
        $scope.apply_coupon = true;
        $scope.applied_coupon = false;
        $scope.dis_price = 0.0;

        if ($rootScope.item_cart_dict.hasOwnProperty(item.id)){
            var new_dict = $rootScope.item_cart_dict[item.id];
            new_dict.qty = new_dict.qty ;
            $rootScope.item_cart_dict[item.id] = new_dict;
        
        }else{
              $rootScope.item_cart_dict[item.id] = item;

        }
        
        var flag = 0;
        if ($scope.order.length > 0) {
            for (var i = 0; i < $scope.order.length; i++) {

              
                if (item.id === $scope.order[i].id) {

                    // item.qty += qty;
                    $scope.order[i].qty += qty;
                    // alert($scope.order[i].qty);
                    flag = 1;
                    break;
                }
            }
            if (flag === 0) {
                item.qty = 1;
            }
            if (item.qty < 2 && flag !=1) {
                $scope.order.push(item);
            }
        } else {
            item.qty = qty;
            $scope.order.push(item);
        }
        // $rootScope.item_cart[item.id] = item
        $cookies.putObject('item_cart', $rootScope.item_cart_dict);
        $cookies.put('momId', $localStorage.mobile);
        // $cookies.put('mom', );
        }
      }
      else{
        // alert("hii")
        $scope.promo = "";
        $scope.total_apply_promo = false;
        $scope.total_withoutapply_promo = true;
        $scope.promo_apply_price = false;
        $scope.promo_withoutapply_price = true;
        $scope.apply_coupon = true;
        $scope.applied_coupon = false;
        $scope.dis_price = 0.0;

        if ($rootScope.item_cart_dict.hasOwnProperty(item.id)){
            var new_dict = $rootScope.item_cart_dict[item.id];
            new_dict.qty = new_dict.qty ;
            $rootScope.item_cart_dict[item.id] = new_dict;
        
        }else{
              $rootScope.item_cart_dict[item.id] = item;

        }
        
        var flag = 0;
        if ($scope.order.length > 0) {
            for (var i = 0; i < $scope.order.length; i++) {

              
                if (item.id === $scope.order[i].id) {

                    // item.qty += qty;
                    $scope.order[i].qty += qty;
                    // alert($scope.order[i].qty);
                    flag = 1;
                    break;
                }
            }
            if (flag === 0) {
                item.qty = 1;
            }
            if (item.qty < 2 && flag !=1) {
                $scope.order.push(item);
            }
        } else {
            item.qty = qty;
            $scope.order.push(item);
        }
        // $rootScope.item_cart[item.id] = item
        $cookies.putObject('item_cart', $rootScope.item_cart_dict);
        $cookies.put('momId', $localStorage.mobile);
        // $cookies.put('mom', );
      }

    };
    $scope.removeOneEntity = function (item) {
        $scope.promo = "";
      $scope.total_apply_promo = false;
      $scope.total_withoutapply_promo = true;
      $scope.promo_apply_price = false;
      $scope.promo_withoutapply_price = true;
      $scope.apply_coupon = true;
      $scope.applied_coupon = false;
      $scope.dis_price = 0.0;
        if ($rootScope.item_cart_dict.hasOwnProperty(item.id)){
            var new_dict = $rootScope.item_cart_dict[item.id];
            new_dict.qty = new_dict.qty-1 ;
            if (new_dict.qty === 0) {
              // alert("inside clear")
                    delete $rootScope.item_cart_dict[item.id];
                    // $scope.order.splice(i, 1);
            }
            else{
            $rootScope.item_cart_dict[item.id] = new_dict;

            }
        
        }

        for (var i = 0; i < $scope.order.length; i++) {
            if (item.id === $scope.order[i].id) {

                // item.qty -= 1;

                if (item.qty === 0) {
                    $scope.order.splice(i, 1);
                }
            }
        }
        $cookies.putObject('item_cart', $rootScope.item_cart_dict);

    };

    $scope.removeItem = function (item) {
      $scope.promo = "";
      $scope.total_apply_promo = false;
      $scope.total_withoutapply_promo = true;
      $scope.promo_apply_price = false;
      $scope.promo_withoutapply_price = true;
      $scope.apply_coupon = true;
      $scope.applied_coupon = false;
      $scope.dis_price = 0.0;
        for (var i = 0; i < $scope.order.length; i++) {
            if (item.id === $scope.order[i].id) {
                $scope.order.splice(i, 1);
                delete $rootScope.item_cart_dict[item.id];
            }
        }
        $cookies.putObject('item_cart', $rootScope.item_cart_dict);
    };

    $scope.getTotal = function () {
        var tot = 0;
        for (var i = 0; i < $scope.order.length; i++) {
            tot += ($scope.order[i].fullPrice * $scope.order[i].qty)
        }
        return tot;
    };

    $scope.clearOrder = function () {
      $cookies.remove('item_cart');
      $cookies.remove('momId');
        // window.location.reload();
        $scope.order = [];
        $rootScope.momId = "";
        $rootScope.item_cart_dict={};
        // alert($rootScope.momId)
    };

    $scope.checkout = function (index) {
        window.location= "#!/main/checkOut"
    };

    $scope.addNewItem = function (item) {
        if (item.category === "Drinks") {
            item.id = $scope.drinks.length + $scope.foods.length
            $scope.drinks.push(item)
            $scope.new = []
            $('#myTab a[href="#drink"]').tab('show')
        } else if (item.category === "Foods") {
            item.id = $scope.drinks.length + $scope.foods.length
            $scope.foods.push(item)
            $scope.new = []
            $('#myTab a[href="#food"]').tab('show')
        }
    };

}]);

app.controller("checkOutCtrl", ['$scope', '$rootScope', '$location','$cookies','$localStorage', '$state','Data', '$base64','$timeout', 'AuthenticationService', 'notify',  function($scope, $rootScope, $location,$cookies, $localStorage,$state, Data, $base64, $timeout, AuthenticationService, notify){
      
      $scope.address_list = true;
      $scope.add_address = false;
      var conf = $localStorage.confirm;
      // alert(conf)
      $scope.register_forms = false;
      
      if($localStorage.status === 1){
        $scope.name = $localStorage.username;
        $scope.mobile = $localStorage.userid;
        $scope.login_form = true;
        $scope.login_page = false;
        $scope.address_list = true;
        $scope.payment_card = false;
        $scope.login_btn = false;
        $scope.addres_btn = true;
      }
      else{
        $scope.login_form = false;
        $scope.login_page = true;
        $scope.address_list = false;
        $scope.patyment_card = false;
        $scope.login_btn = true;
        $scope.place_order2 = false;

      }
      $scope.showLogin = function(){
        $scope.login_page = false;
        $scope.login_form1 = true;
        $scope.sign_up_form = false;
      }
      $scope.signUp = function(){

        $scope.login_page = false;
        $scope.login_form1 = false;
        $scope.sign_up_form = true;
      }
    
      $scope.addAddress = function(){
        // alert("conf")
        $scope.address_list = false;
        $scope.add_address = true;
      }
      $scope.addAddressMethod = function(){
        var user_name = document.getElementById('user_name').value;
        var phone_number = document.getElementById('phone_number').value;
        var address = document.getElementById('demo1').value;
        var latitude = document.getElementById('lat1').value;
        var longitude = document.getElementById('lon1').value;
        var flat_no = document.getElementById('flat_no').value;       
        var complete_address = address + " " + flat_no;

        if(user_name != '' && address != '' && latitude != '' && longitude != '' && flat_no != ''){
            var json_data = {
            'latitude':latitude,
            'longitude':longitude,
            'phone_number':phone_number,
            'name':user_name,
            'mobile':$localStorage.userid,
            'address':complete_address,
            'latitude':latitude,
          }
          console.log(json_data)
           Data.addAddressMethod(json_data)
          .then(function(response){
            console.log(response.data.response.confirmation)
            // $scope.makefavourite = false;
            // $scope.makenonefavourite = true;
            if(response.data.response.confirmation === 1){
               $scope.address_list = true;
              $scope.add_address = false;
               var json_data = {
                'mobile' : $localStorage.userid,
                }
                console.log(json_data)
                Data.getAddress(json_data)
                .then(function(response){
                  $scope.address_list = response.data.address_data;
                  // alert(JSON.stringify(response.data.address_data))
                }).catch(function(response){

                })
            }
            console(response)
          }).catch(function(response){

          })
        }
        else if(user_name === ""){
        notify("Enter Name")
        }
        else if(address === ""){
          notify("Enter Address")
        }
        else if(latitude === "" && longitude === ""){
          notify("Address Not Found")
        } 
        else if(flat_no === ""){
          notify("Enter Flat No")
        }       
      }
      
      var json_data = {
        'mobile' : $localStorage.userid,
      }
      console.log(json_data)
      Data.getAddress(json_data)
      .then(function(response){
        $scope.address_list = response.data.address_data;
        // alert(JSON.stringify(response.data.address_data))
        console.log($scope.address_list)
      }).catch(function(response){

      })
      $scope.deliver_address = false;
      $scope.deliverAddress = function(address){
       
        // alert($localStorage.user_lat)
        // alert($localStorage.user_long)
        // alert($localStorage.long)
        $localStorage.user_lat = address.latitude;
        $localStorage.user_long = address.longitude;
         function _getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in kilometers
        var dLat = deg2rad(lat2 - lat1); // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in KM
        return d;
      }

      function deg2rad(deg) {
        return deg * (Math.PI / 180)
      }



      // Point 1: 15.008809, 78.659096
      // Point 2: 13.90457539, 78.5855514

      var _lat1 = $localStorage.user_lat;
      var _lon1 = $localStorage.user_long;

      var _lat2 = $localStorage.mom_lat;
      var _lon2 =$localStorage.mom_long;
      // // precise value
      // var _d = "Precise value: " + _getDistanceFromLatLonInKm(_lat1, _lon1, _lat2, _lon2);
      // alert(_d); // alert(_d);


      // round value
      var _d = Math.round(_getDistanceFromLatLonInKm(_lat1, _lon1, _lat2, _lon2) * 100) / 100;
        // alert(_d)
      // if(_d >= 0 && _d <= 1){      
      //   $scope.delivery_val = 5 + 10;
      //   $scope.addres_btn = false;
      //   $scope.place_order2 = true;
      //   $scope.address_list = false;
      //   $scope.deliver_address = true;
      //    $scope.payment_card = true;
      //   $scope.add_address = false;
      //   $scope.name = address.name;
      //   $scope.address = address.address;
      //   $scope.mobile = address.mobile;
      //   // $localStorage.user_lat = address.latitude;
      //   // $localStorage.user_long = address.longitude;
      //    // alert(_d) 
      // }else if(_d > 1 && _d <= 3){
      //   $scope.delivery_val = 5 + 7 + 10;
      //   $scope.addres_btn = false;
      //   $scope.place_order2 = true;
      //   $scope.address_list = false;
      //   $scope.deliver_address = true;
      //    $scope.payment_card = true;
      //   $scope.add_address = false;
      //   $scope.name = address.name;
      //   $scope.address = address.address;
      //   $scope.mobile = address.mobile;
      //   // $localStorage.user_lat = address.latitude;
      //   // $localStorage.user_long = address.longitude;
      //   // alert(_d)  
      // }else if(_d > 3 && _d <= 6){
      //   $scope.delivery_val = 5 + 7 + 10 + 10; 
      //   // alert(_d) 
      //   $scope.addres_btn = false;
      //   $scope.place_order2 = true;
      //   $scope.address_list = false;
      //   $scope.deliver_address = true;
      //   $scope.payment_card = true;
      //   $scope.add_address = false;
      //   $scope.name = address.name;
      //   $scope.address = address.address;
      //   $scope.mobile = address.mobile;
      //   // $localStorage.user_lat = address.latitude;
      //   // $localStorage.user_long = address.longitude;
      // }
      // else{
      //   $('#serviceNotAble').modal('show');
      //   // $scope.paymentFailed = true
      // }

        var _lat1 = $localStorage.user_lat;
        var _lon1 = $localStorage.user_long;

        var _lat2 = $localStorage.mom_lat;
        var _lon2 =$localStorage.mom_long;

        var json_data = {
          'delivery_lat': _lat1,
          'delivery_lang': _lon1,
          'mom_lat': _lat2,
          'mom_lang': _lon2,
          'distance': _d,
        }
        Data.deliveryPrice(json_data)
        .then(function(response){
          var delivery_charge = response.data.delivery_charge;
          var success = response.data.success;
          if(delivery_charge == 0){
            // $scope.delivery_val = response.data.delivery_charge;
            $('#serviceNotAble').modal('show');
          }
          else if(delivery_charge > 0){
            $scope.delivery_val = response.data.delivery_charge;
            $scope.addres_btn = false;
            $scope.place_order2 = true;
            $scope.address_list = false;
            $scope.deliver_address = true;
            $scope.payment_card = true;
            $scope.add_address = false;
            $scope.name = address.name;
            $scope.address = address.address;
            $scope.mobile = address.mobile;
          }
          // alert(JSON.stringify(response))
        }).catch(function(response){

        })
      }
      
      $scope.showAddressList = function(){
        $scope.deliver_address = false;
        $scope.address_list = true;
        $scope.payment_card = false;
        var json_data = {
        'mobile' : $localStorage.userid,
        }
        console.log(json_data)
        Data.getAddress(json_data)
        .then(function(response){
          $scope.address_list = response.data.address_data;
          // alert(JSON.stringify(response.data.address_data))
        }).catch(function(response){

        })
      }
      // $rootScope.item_cart = $cookies.getObject('item_cart');
      // $scope.order = $rootScope.item_cart;
      $rootScope.item_cart_dict = $cookies.getObject('item_cart') || {};
       // alert(JSON.stringify($rootScope.item_cart_dict))
      $rootScope.item_cart =[]
      Object.keys($rootScope.item_cart_dict).forEach(function(key) {
          $rootScope.item_cart.push($rootScope.item_cart_dict[key])
      });
      $scope.order = $rootScope.item_cart;
     
        $scope.new = {};
        $scope.totOrders = 0;

    var url = window.location.protocol + "://" + window.location.host + "/" + window.location.pathname;

    $scope.getDate = function () {
        var today = new Date();
        var mm = today.getMonth() + 1;
        var dd = today.getDate();
        var yyyy = today.getFullYear();

        var date = dd + "/" + mm + "/" + yyyy

        return date
    };
    // alert(JSON.stringify($scope.order))
    if($scope.order == ""){
      // alert("jh")
      $scope.non_empty_cart = false;
      $scope.empty_cart = true;
    }
    else{
      $scope.non_empty_cart = true;
      $scope.empty_cart = false;
    }
    $scope.results = {}
    $scope.addToOrder = function (item, qty) {
      // alert(JSON.stringify(item))
      $scope.promo = "";
      $scope.total_apply_promo = false;
      $scope.total_withoutapply_promo = true;
      $scope.promo_apply_price = false;
      $scope.promo_withoutapply_price = true;
      $scope.apply_coupon = true;
      $scope.applied_coupon = false;
      $scope.dis_price = 0.0;
      // alert(JSON.stringify(item.id))
        if ($rootScope.item_cart_dict.hasOwnProperty(item.id)){
          // alert(JSON.stringify(item.id))
            var new_dict = $rootScope.item_cart_dict[item.id];
            new_dict.qty = new_dict.qty ;
            $rootScope.item_cart_dict[item.id] = new_dict;
        
        }else{
            // alert(JSON.stringify(item))
              $rootScope.item_cart_dict[item.id] = item;

        }
        
        var flag = 0;
        if ($scope.order.length > 0) {
            for (var i = 0; i < $scope.order.length; i++) {

              
                if (item.id === $scope.order[i].id) {

                    // item.qty += qty;
                    $scope.order[i].qty += qty;
                    // alert($scope.order[i].qty);
                    flag = 1;
                    break;
                }
            }
            if (flag === 0) {
                item.qty = 1;
            }
            if (item.qty < 2 && flag !=1) {
                $scope.order.push(item);
            }
        } else {
            item.qty = qty;
            $scope.order.push(item);
        }
        // $rootScope.item_cart[item.id] = item
        $cookies.putObject('item_cart', $rootScope.item_cart_dict);
        $cookies.put('momId', $localStorage.mobile);
        // $cookies.put('mom', );

    };
    $scope.removeOneEntity = function (item) {
        $scope.promo = "";
      $scope.total_apply_promo = false;
      $scope.total_withoutapply_promo = true;
      $scope.promo_apply_price = false;
      $scope.promo_withoutapply_price = true;
      $scope.apply_coupon = true;
      $scope.applied_coupon = false;
      $scope.dis_price = 0.0;
        if ($rootScope.item_cart_dict.hasOwnProperty(item.id)){
            var new_dict = $rootScope.item_cart_dict[item.id];
            new_dict.qty = new_dict.qty-1 ;
            if (new_dict.qty === 0) {
              // alert("inside clear")
                    delete $rootScope.item_cart_dict[item.id];
                    // $scope.order.splice(i, 1);
            }
            else{
               $rootScope.item_cart_dict[item.id] = new_dict;
            }
           
        
        }

        for (var i = 0; i < $scope.order.length; i++) {
            if (item.id === $scope.order[i].id) {

                // item.qty -= 1;

                if (item.qty === 0) {
                    $scope.order.splice(i, 1);
                }
            }
        }
        $cookies.putObject('item_cart', $rootScope.item_cart_dict);

    };

    $scope.removeItem = function (item) {
      $scope.promo = "";
      $scope.total_apply_promo = false;
      $scope.total_withoutapply_promo = true;
      $scope.promo_apply_price = false;
      $scope.promo_withoutapply_price = true;
      $scope.apply_coupon = true;
      $scope.applied_coupon = false;
      $scope.dis_price = 0.0;
        for (var i = 0; i < $scope.order.length; i++) {
            if (item.id === $scope.order[i].id) {
                $scope.order.splice(i, 1);
                delete $rootScope.item_cart_dict[item.id];
                // $cookies.remove($scope.order.splice(i, 1));
            }
        }
        $cookies.putObject('item_cart', $rootScope.item_cart_dict);
    };
    $scope.getTotal = function () {
        tot = 0;
        for (var i = 0; i < $scope.order.length; i++) {
            tot += ($scope.order[i].fullPrice * $scope.order[i].qty)
        }
        // alert(tot)
        return tot;
    };

    $scope.clearOrder = function () {

        // alert('inside');
        $scope.apply_coupon = false;
        $scope.applied_coupon = false;
        $cookies.remove('item_cart');
        $cookies.remove('momId');
        // window.location.reload();
        $scope.order = [];
        $rootScope.momId = "";
        $scope.non_empty_cart = false;
        $scope.empty_cart = true;
    };

    $scope.checkout = function (index) {
        window.location= "#!/main/checkOut"
    };

    $scope.addNewItem = function (item) {
        if (item.category === "Drinks") {
            item.id = $scope.drinks.length + $scope.foods.length
            $scope.drinks.push(item)
            $scope.new = []
            $('#myTab a[href="#drink"]').tab('show')
        } else if (item.category === "Foods") {
            item.id = $scope.drinks.length + $scope.foods.length
            $scope.foods.push(item)
            $scope.new = []
            $('#myTab a[href="#food"]').tab('show')
        }
    };
    Data.getOfferList()
    .then(function(response){
      console.log(response)
      $scope.offerList = response.data.offer;
      console($scope.offerList)
    }).catch(function(response){

    })
    $scope.modal_dis = true;
    $scope.apply_coupon = true;
    $scope.modal_open = function(){
      $scope.modal_dis = true;
    }
    $scope.promo_withoutapply_price = true;
    $scope.promo_apply_price = false;
    $scope.total_apply_promo = false;
    $scope.total_withoutapply_promo = true;
    $scope.applyPromoCode = function(promocode,id,mobile,maxdiscount){
      $localStorage.promocode = promocode;
      $localStorage.maxdiscount = maxdiscount;
      // alert(JSON.stringify(maxdiscount))
       // $('#myModal').modal('hide');       
      
      // if(sub_total < 100){

      // }
      $scope.promo = promocode;
      var sub_total = document.getElementById('sub_total').textContent.trim()

      var json_data = {
        'mobile':$localStorage.userid,
        'promocode':promocode,
        'total_price':sub_total,
      }
      console.log(json_data)
      Data.applyPromoCode(json_data)
      .then(function(response){
        // alert(JSON.stringify(response.data))
        if(response.data.promo_status == 1){
            $scope.apply_coupon = false;
            $scope.applied_coupon = true;
            // alert(response.data.total_discount)
            $scope.total_apply_promo = true;
            $scope.total_withoutapply_promo = false;
            $scope.promo_apply_price = true;
            $scope.promo_withoutapply_price = false;
            $scope.modal_dis = false; 
            $scope.dis_price = response.data.discounted_price;
            $localStorage.discount_price = response.data.discounted_price;
            $scope.total_price = response.data.total_discount;       
        }
        else if(response.data.promo_status == 2){
            $scope.total_apply_promo = false;
            $scope.total_withoutapply_promo = true;
            $scope.promo_apply_price = false;
            $scope.promo_withoutapply_price = true;
            $scope.modal_dis = false;
            notify("Minimum cart value not fulfill!!")
            // $(id).attr('disabled','disabled');
        }
        else if(response.data.promo_status == 3){
            $scope.total_apply_promo = false;
            $scope.total_withoutapply_promo = true;
            $scope.promo_apply_price = false;
            $scope.promo_withoutapply_price = true;
            $scope.modal_dis = false;
            notify("Maxmimum Limit Exceed!!")
        }
        // console.log(res);
        
       // $('#myModal').modal('hide');
       
      }).catch(function(response){

      })
    }

    $scope.removePromo = function(){
      $scope.promo = "";
      $scope.total_apply_promo = false;
      $scope.total_withoutapply_promo = true;
      $scope.promo_apply_price = false;
      $scope.promo_withoutapply_price = true;
      $scope.apply_coupon = true;
      $scope.applied_coupon = false;
      $scope.dis_price = 0.0;
    }



    $scope.placed_order = function(){
     
      // var delivery_value = _d
      var username = $localStorage.username;
      var get_address = $scope.address + "\n" + $localStorage.userid;
      var mobile_no = $localStorage.userid;
      var final_price = $scope.total_price;
      var lat = $localStorage.user_lat;
      var long = $localStorage.user_long;
      var mom_mobile =  $localStorage.mom_mobile;
      var product_list = $scope.order;
      console.log(product_list)
      var notes = document.getElementById('user_notes').value;
      var promocode = $scope.promo;
      var sub_total= document.getElementById('sub_total').textContent;
      var tax_value = document.getElementById('tax_value').textContent;
      var delivery_value = document.getElementById('delivery_value').textContent;
      var promo_code_val = document.getElementById('promo_code').textContent;
      // alert(get_address + )
      
      if($localStorage.promocode != undefined){
        // alert($localStorage.promocode)
        var promo_code = $localStorage.promocode;
      }
      else{
        var promo_code = 0;
        // alert(promo_code)
      }
      if($localStorage.maxdiscount != undefined){
        var maxdiscount = $localStorage.maxdiscount;
        // alert(maxdiscount)
      }
      else{
        var maxdiscount = 0;
        // alert(maxdiscount)
      }
      var total_amount = document.getElementById('total_amount').textContent;
      var total_amount1 = document.getElementById('total_amount1').textContent;
      // alert(total_amount1)
      if(promo_code_val != 0.0){
          var total_price = total_amount;
          // alert(total_amount)
      }
      else if(promo_code_val == 0.0){
        // alert("0.0")
        var total_price = total_amount1;
        // alert(total_amount1)
      }
    var radioValue = $("input[name='gender']:checked").val();
      // alert(total_price)
      var json_data = {
        'name': username,
        'location': get_address,
        'mobile': mobile_no,
        'latitude': lat,
        'longitude': long,
        'mom_mobile': mom_mobile,
        'product_list':product_list,
        'note': notes,
        'promoCode': promo_code,
        'sub_total':sub_total,
        'tax_amount':tax_value,
        'delivery_charge':delivery_value,
        'discount_amount': maxdiscount,
        'total_price': total_price,
        'payment_mode':'radioValue',
      }
      // alert(JSON.stringify(json_data))
      console.log(json_data)
       Data.placed_order(json_data)
        .then(function(response){
          console.log(response)
          // alert(JSON.stringify(response))
           window.location = "#!/order-accepted";
           $cookies.remove('item_cart');
           $cookies.remove('momId');
            $scope.order = [];
            $rootScope.momId = "";
            // alert(JSON.stringify($rootScope.momId))
            $rootScope.item_cart_dict={};
        }).catch(function(response){

        })
      
    }
    $scope.cashMethod = function(){
      var cashValue = document.getElementById('cashValue').value;
      $scope.cashValue = cashValue;
      // alert(cashValue)
      
        // alert($scope.placed_order)

      if(cashValue == 'cash'){
        // alert($scope.placed_order)
        $scope.placed_order1 = true;
        $scope.placed_order2 = true;
        document.getElementById("paytm_btn").style.display = "none";
        
      }
    }
    $scope.paytmMethod = function(){
      //  var x = Math.floor(Math.random()*1E16);
      // $localStorage.orderId = x.toString();

      var radioValue = document.getElementById('paytmValue').value;
      $localStorage.radioValue = radioValue;
      $scope.paytmValue = $localStorage.radioValue;
      if(radioValue == 'paytmValue'){
        $scope.placed_order2 = true;
        document.getElementById("paytm_btn").style.display = "block";
        // alert($scope.placed_order)
        $scope.placed_order1 = false;
        // // alert(radioValue)
        // var json_data ={
        //   'mobile': $localStorage.userid,
        // }
        // Data.orderIdGenerate(json_data)
        // .then(function(response){
        //   console.log(response.data.orderId)
        //   $localStorage.orderId = response.data.orderId;
        // }).catch(function(response){

        // })

        
      }
    }
    $scope.paymentFailed = false;
    $scope.generateOrder = function($event){
      $event.preventDefault();
      var paytm_status = "online-payment";
      $localStorage.paytm_status = paytm_status;
      // alert($localStorage.paytm_status)
      var username = $localStorage.username;
      var get_address = $scope.address;
      var mobile_no = $localStorage.userid;
      var final_price = $scope.total_price;
      var lat = $localStorage.user_lat;
      var long = $localStorage.user_long;
      var mom_mobile =  $localStorage.mom_mobile;
      var product_list = $scope.order;
      console.log(product_list)
      var notes = document.getElementById('user_notes').value;
      var promocode = $scope.promo;
      var sub_total= document.getElementById('sub_total').textContent;
      var tax_value = document.getElementById('tax_value').textContent;
      var delivery_value = document.getElementById('delivery_value').textContent;
      var promo_code = document.getElementById('promo_code').textContent;
      var total_amount = document.getElementById('total_amount').textContent;
      var total_amount1 = document.getElementById('total_amount1').textContent;
      // alert(promo_code)
      if(promo_code != 0.0){
          var total_price = total_amount;
          // alert(total_price)
      }
      else if(promo_code == 0.0){
        var total_price = total_amount1;
        // alert(total_price)
      }
    var radioValue = $("input[name='gender']:checked").val();
      // alert(radioValue)
      var json_data = {
        'name': username,
        'location': get_address,
        'mobile': mobile_no,
        'latitude': lat,
        'longitude': long,
        'mom_mobile': mom_mobile,
        'product_list':product_list,
        'note': notes,
        'promoCode': promo_code,
        'sub_total':sub_total,
        'tax_amount':tax_value,
        'delivery_charge':delivery_value,
        'discount_amount': promo_code,
        'total_price': total_price,
        'payment_mode':'radioValue',
      }
      // console.log(json_data)
      // alert(JSON.stringify(json_data))
       Data.placed_order_online(json_data)
        .then(function(response){
          // console.log(response)
          // alert(JSON.stringify(response.data.orderId))
          $localStorage.orderId = response.data.orderId;
          //================= checkssum generate ====================

            var promo_code = document.getElementById('promo_code').textContent;
            var total_amount = document.getElementById('total_amount').textContent;
            var total_amount1 = document.getElementById('total_amount1').textContent;
            // alert(promo_code)
            if(promo_code != 0.0){
                var total_price = total_amount;
                $localStorage.total_price = total_price;
                // alert($localStorage.total_price)
            }
            else if(promo_code == 0.0){
              var total_price = total_amount1;
              $localStorage.total_price = total_price;
              // alert($localStorage.total_price)
            }
            var json_data = {
              'mobile': $localStorage.userid,
              'orderId': $localStorage.orderId,
              'TXN_AMOUNT': $localStorage.total_price,
            }
            // alert(JSON.stringify(json_data))
            $scope.ORDER_ID = $localStorage.orderId;
            Data.checkSums(json_data)
            .then(function(response){
              // alert(JSON.stringify(response.data))
             
              // $scope.CHEKSUMHASH = response.data.CHECKSUMHASH;
              $("#WEBSITE").val(response.data.params.WEBSITE);
              $("#CHANNEL_ID").val(response.data.params.CHANNEL_ID);
              $("#INDUSTRY_TYPE_ID").val(response.data.params.INDUSTRY_TYPE_ID);
              $("#CUST_ID").val(response.data.params.CUST_ID);
              $("#ORDER_ID").val(response.data.params.ORDER_ID);
              // $scope.WEBSITE = response.data.params.WEBSITE;
              // $scope.CHANNEL_ID = response.data.params.CHANNEL_ID;
              // $scope.INDUSTRY_TYPE_ID = response.data.params.INDUSTRY_TYPE_ID;
              // $scope.CUST_ID = response.data.params.CUST_ID;
              // $scope.ORDER_ID = response.data.params.ORDER_ID;
              // $scope.MID = response.data.params.MID;
              $("#MID").val(response.data.params.MID);
              $("#CHECKSUMHASH").val(response.data.params.CHECKSUMHASH);
              $("#CALLBACK_URL").val(response.data.params.CALLBACK_URL);
              $("#TXN_AMOUNT").val(response.data.params.TXN_AMOUNT);
              // $scope.CALLBACK_URL = response.data.params.CALLBACK_URL;
              // $scope.CHECKSUMHASH = response.data.params.CHECKSUMHASH;
              // alert($scope.CHECKSUMHASH)
              // $scope.TXN_AMOUNT = response.data.params.TXN_AMOUNT;      
              // alert($scope.MID)
              // alert($scope.ORDER_ID)
              // $(document).ready(function(event ) {
                  // event.preventDefault();
                   console.log(response.data)
                $('#paytm_form').submit();
              // $localStorage.CHEKSUMHASH = response.data.CHEKSUMHASH;
              // window.location.href = "https://securegw-stage.paytm.in/order/process"
              // alert(JSON.stringify(response.data))
              // console.log(response)
            }).catch(function(response){

            })

        }).catch(function(response){

        })
      }
    if($localStorage.paytm_status == "online-payment"){
      // var url = window.location.href;
      var confirmation = window.location.href.split('=');
      // alert(confirmation[1])
      if(confirmation[1] == 1){
        window.location = "#!/order-accepted";
        $cookies.remove('item_cart');
        $scope.order = [];
        $rootScope.momId = "";
        $rootScope.item_cart_dict={};
      }
      else if(confirmation[1] == 0){
        $scope.paymentFailed = true;
        notify("Transaction Failed!!")
      }     
    }
    $scope.addAddressPopup = function(){
      notify("Select Address!!")
    }
}]); 

app.controller("searchMomListCtrl", ['$scope', '$rootScope', '$location','$cookies','$localStorage', '$state','Data', '$base64','$timeout', 'AuthenticationService', 'notify',  function($scope, $rootScope, $location,$cookies, $localStorage,$state, Data, $base64, $timeout, AuthenticationService, notify){
     var latitude = $localStorage.latitude;
        var longitude = $localStorage.longitude;
        console.log(latitude)
        var mobile = $localStorage.userid;
        var json_data = {
          'latitude': $localStorage.latitude,
          'longitude': $localStorage.longitude,
          'mobile': mobile,
        }
        console.log(json_data)
         Data.getVendorList(json_data)
        .then(function(response){
          console.log(response)
          $scope.topratedList = response.data.toprated_list;
          $scope.vendorList = response.data.vendor_data;
          $scope.top_rated_list = true;
            $scope.vendor_list = true;
            $scope.no_momChef = false;
          if(response.data.toprated_list.length == 0 || response.data.vendor_data.length == 0){
            $scope.top_rated_list = false;
            $scope.vendor_list = false;
            $scope.no_momChef = true;
          }
          // console($scope.offerList)
        }).catch(function(response){

        })

        $scope.query = {}
        $scope.queryBy = '$'

        $scope.getVenderData =function(id,mobile,firstName,mname,lname,description,rating,specialization,image,address,mobile,flag,lat,long){
          // alert("hii")
          $localStorage.mobile = mobile;
          // alert($localStorage.mom_lat)
          // alert($localStorage.mom_long)
          var json_data = {
            'mobile': $localStorage.mobile,
          }
          // alert(JSON.stringify(json_data))
           Data.getMomStatus(json_data)
          .then(function(response){
            if(response.data.response.statusInt == 1){
              window.location.href = "#!/main/get-vendor-list";
              $localStorage.flag = flag;
              $localStorage.id = id;
              
              if(mname !== null){           
                $localStorage.full_name = firstName + " "+mname +" "+lname;
              } 
              else{
                $localStorage.full_name = firstName+" "+lname;
              }         
              $localStorage.image = image;
              $localStorage.description = description;
              $localStorage.rating = rating;
              $localStorage.specialization = specialization;
              $localStorage.address = address;
              $localStorage.mom_mobile = mobile;
              $localStorage.mom_lat = lat;
              $localStorage.mom_long = long;
            // notify("Successfully Send !!")
          }
          else if(response.data.response.statusInt == 0){
            $('#myModal').modal('show');
          }
            // notify("Successfully Send !!")
          }).catch(function(response){

          })
        }
}]); 
app.controller("orderAcceptedController", ['$scope', '$rootScope', '$location','$cookies','$localStorage', '$state','Data', '$base64','$timeout', 'AuthenticationService', 'notify',  function($scope, $rootScope, $location,$cookies, $localStorage,$state, Data, $base64, $timeout, AuthenticationService, notify){   
    var myFunc = function() {
    window.location = "#!/main/home"
    }
    setTimeout(myFunc, 3000);
}]);
 
app.controller("offerListCtrl", ['$scope', '$rootScope', '$location','$cookies','$localStorage', '$state','Data', '$base64','$timeout', 'AuthenticationService', 'notify',  function($scope, $rootScope, $location,$cookies, $localStorage,$state, Data, $base64, $timeout, AuthenticationService, notify){   
    Data.getOfferList()
    .then(function(response){
      console.log(response)
      $scope.offerList = response.data.offer;
      console($scope.offerList)
    }).catch(function(response){

    })
}]);
app.controller("contactUsCtrl", ['$scope', '$rootScope', '$location','$cookies','$localStorage', '$state','Data', '$base64','$timeout', 'AuthenticationService', 'notify',  function($scope, $rootScope, $location,$cookies, $localStorage,$state, Data, $base64, $timeout, AuthenticationService, notify){      
    
    $scope.sendMessage = function(){
      // alert("hii")
      // $scope.msg = "Form Validated";
      var name = document.getElementById('name_value').value;
      // alert(JSON.stringify(name_value));
      var phone_no = document.getElementById('phone_no').value;
      var email = document.getElementById('email').value;
      var pincode = document.getElementById('pincode').value;
      var message = document.getElementById('message').value;

       
     // alert(JSON.stringify(name_value));
      // alert(JSON.stringify(phone_no.length));
   
      if(name !="" && phone_no.length ==10 && email !="" && pincode.length == 6 && message !=""){
        var json_data = {
        'name':name,
        'phone_no':phone_no,
        'email':email,
        'pincode':pincode,
        'note':message,
      }
      // alert(JSON.stringify(name_value));
       Data.sendMessage(json_data)
      .then(function(response){
        console.log(response)
        document.getElementById("contact_form").reset();
        notify("Submit Successfully !! we will contact you soon.")
      }).catch(function(response){

      })
      }
      else if(name === ""){
        notify("Enter Your Name")
      }
      else if(phone_no === ""){
        notify("Invalid Mobile no")
      }
      else if(email === ""){
        notify("Enter Email")
      }
      else if(pincode === ""){
        notify("Invalid Pincode")
      }
      else if(message === ""){
        notify("Enter Message")
      }
      
    }
}]);

app.controller("momChefRegisterCtrl", ['$scope', '$rootScope', '$location','$cookies','$localStorage', '$state','Data', '$base64','$timeout', 'AuthenticationService', 'notify',  function($scope, $rootScope, $location,$cookies, $localStorage,$state, Data, $base64, $timeout, AuthenticationService, notify){      
     $scope.momChefRegister = function(){
          var name = document.getElementById('inputEmail4').value;
          var number = document.getElementById('inputPassword4').value;
          var email = document.getElementById('inputemail').value;
          var pincode = document.getElementById('pincode').value;
          var message =document.getElementById('message').value;
          var openTime = "";
          var breakStart = "";
          var breakEnd ="";
          $scope.middleName = "";
          $scope.lastName = "";
          $scope.dob = "";
          $scope.address = "";
          $scope.openTime = "";
          $scope.endTime = "";
           $scope.breakStart = "";
           $scope.breakEnd = "";
           $scope.country = "";
           $scope.state = "";
           $scope.foodLicenseNo = "";
            $scope.specialization = "";
            $scope.filename = "";
            $scope.longitude = "";
            $scope.latitude = "";
             $scope.status = "";
          var json_data = {
            'email': email,
            'openTime': $scope.openTime,
            'endTime': $scope.endTime,
            'breakStart': breakStart,
            'breakEnd': breakEnd,
            'firstName': name,
            'middleName': $scope.middleName,
            'lastName': $scope.lastName,
            'dob': $scope.dob,
            'address': $scope.address,
            'openTime': $scope.openTime,
            'endTime': $scope.endTime,
            'breakStart': $scope.breakStart,
            'breakEnd': $scope.breakEnd,
            'country': $scope.country,
            'state': $scope.state,
            'city': $scope.address,
            'zipCode': pincode,
            'mobile': number,
            'foodLicenseNo': $scope.foodLicenseNo,
            'specialization': $scope.specialization,
            'comment': message,
            'image': $scope.filename,
            'longitude': $scope.longitude,
            'latitude': $scope.latitude,
            'status': $scope.status,
          }
        console.log(json_data)
         Data.momChefRegister(json_data)
        .then(function(response){
          console.log(response)
          document.getElementById("register_form").reset();
          notify('Successfully!!')

        }).catch(function(response){

        })
        }
    
}]);


app.factory('URI', function() {
  var uri = JSON.parse(JSON.stringify(window.uri));
  return {
    uri_for: function(handle) {
      return uri[handle];
    }
  }
});