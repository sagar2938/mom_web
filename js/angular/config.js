var app = angular.module('coreuiApp', ['ui.router', 'oc.lazyLoad', 'ngCookies','angular-loading-bar','ngStorage', 'base64', 'cgNotify', 'angularUtils.directives.dirPagination',]);

app.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider){

    $urlRouterProvider.otherwise("/main-login/login-home");
    // $urlRouterProvider.otherwise("/customer/login");
    

    $stateProvider

     .state('login', {
        url:'/login',
        templateUrl:'templates/login.html',
        controller:'loginCtrl'
        
    })
    
    // login page url
     .state('login-home', {
        url:'/login-home',
        templateUrl:'templates/login-home.html',
        // controller:'loginCtrl'
        
    })

     .state('page-register', {
        url:'/page-register',
        templateUrl:'templates/page-register.html',
        controller:'signUpCtrl'
        
    })

    .state('otp-page', {
        url:'/otp-page',
        templateUrl:'templates/otp-page.html',
        controller:'otpPageCtrl',
        
    })
    
    .state('register-ui-carousel', {
        url:'/register-ui-carousel',
        templateUrl:'templates/register-ui-carousel.html',
        // controller:'signUpCtrl'
        
    })   
    
    // home page url
    .state('main', {
        url:'/main',
        templateUrl:'templates/main.html',
        controller:'mainCtrl', 
        // controller: 'homeCtrl',
    })

    .state('reorder', {
        url:'/reorder',
        templateUrl:'templates/reorder.html',
        controller:'mainCtrl', 
        // controller: 'homeCtrl',
    })

    .state('reorder.reorderCheckout', {
        url:'/reorderCheckout',
        templateUrl:'templates/reorderCheckout.html',
        controller:'checkOutCtrl'
        
    })

    .state('main-login', {
        url:'/main-login',
        templateUrl:'templates/main-login.html',
        controller: 'mainLoginCtrl',
    })

    // .state('login-home', {
    //     url:'/login-home',
    //     templateUrl:'templates/login-home.html',
    //     controller:'loginHomeCtrl'
        
    // })

    .state('main-login.login-home', {
        url:'/login-home',
        templateUrl:'templates/login-home.html',
        controller:'loginHomeCtrl',
        
    })

    .state('main.update-address', {
        url:'/update-address',
        templateUrl:'templates/update-address.html',
        controller:'updateAddressCtrl'
        
    })
    .state('main.home', {
        url:'/home',
        templateUrl:'templates/home.html',
        controller:'homeCtrl'
        
    })
    .state('main.about', {
        url:'/about',
        templateUrl:'templates/about.html',
        // controller:'updateAddressCtrl'
        
    })
    .state('main.contact-us', {
        url:'/contact-us',
        templateUrl:'templates/contact-us.html',
        controller:'contactUsCtrl'
        
    })
    .state('main.checksum', {
        url:'/checksum',
        templateUrl:'templates/checksum.html',
        controller:'checksumsCtrl',
        // resolve: {
        //     checkSums: function(Data){
        //         return Data.checkSums();
        //     }
        // }
        
    })
    .state('main.terms-con', {
        url:'/terms-con',
        templateUrl:'templates/terms-con.html',
        // controller:'updateAddressCtrl'
        
    })
    .state('main.privacy-policy', {
        url:'/privacy-policy',
        templateUrl:'templates/privacy-policy.html',
        // controller:'updateAddressCtrl'
        
    })
    .state('main.mom-chef-register', {
        url:'/mom-chef-register',
        templateUrl:'templates/mom-chef-register.html',
        controller:'momChefRegisterCtrl'
        
    })
    .state('main.faq', {
        url:'/faq',
        templateUrl:'templates/faq.html',
        // controller:'updateAddressCtrl'
        
    })
    .state('main.career', {
        url:'/career',
        templateUrl:'templates/career.html',
        // controller:'updateAddressCtrl'
        
    })
    .state('main.get-vendor-list', {
        url:'/get-vendor-list',
        templateUrl:'templates/get-vendor-list.html',
        controller:'PosController'
        
    })
    .state('main.checkOut', {
        url:'/checkOut',
        templateUrl:'templates/checkOut.html',
        controller:'checkOutCtrl'
        
    })
    .state('main.offerApply', {
        url:'/offerApply',
        templateUrl:'templates/offerApply.html',
        controller:'offerListCtrl'
        
    })
    .state('main.search-mom', {
        url:'/search-mom',
        templateUrl:'templates/search-mom.html',
        controller:'searchMomListCtrl'
        
    })
     .state('main.cart-page', {
        url:'/cart-page',
        templateUrl:'templates/cart-page.html',
        // controller:'getVendorListCtrl'
        
    })
      .state('main.order-details', {
        url:'/order-details',
        templateUrl:'templates/order-details.html',
        controller:'ongoingCtrl'
        
    })
     .state('main.cartWeb', {
        url:'/cartWeb',
        templateUrl:'templates/cartWeb.html',
        controller:'PosController'
        
    })
    .state('order-accepted', {
        url:'/order-accepted',
        templateUrl:'templates/order-accepted.html',
        controller:'orderAcceptedController'
        
    })
}]);