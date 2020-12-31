app.run(function ($rootScope, $location, $cookies, $http, $state, AuthenticationService, $timeout, $localStorage) {

  $rootScope.globals = $cookies.getObject('globals') || {};


    if ($rootScope.globals.loggedIn ==1) {
          

      $localStorage.username = $rootScope.globals.currentUser.resp_datasets;

      if ($location.path() =='/'){        
          $location.path('/main/home');
      }else{
         
         $location.path($location.path()); 
      }
           
  }else{
        $location.path('/login');
    }
    
    $rootScope.logout = function(){
  
      AuthenticationService.ClearCredentials();
      $timeout(function () {
       $location.path('/login');
      },1000);
  
      $localStorage.imgsrc = '';
  
    }

});
app.controller('AppController', ['$scope', '$route', function ($scope, $route) {
$scope.reloadRoute = function () {
$route.reload();
};
}]);

app.controller('loginCtrl', ['$rootScope','$cookies','$scope', 'Data', '$location', 'AuthenticationService', '$state', '$localStorage', function($rootScope,$cookies,$scope, Data, $location, AuthenticationService, $state, $localStorage){

      $rootScope.globals = $cookies.getObject('globals') || {};
      if ($rootScope.globals.loggedIn ==1) {
        $location.path('/home');
      }

    $scope.wrongpass = false;

    
    $scope.islogin = false;
    
    
    
    

    $scope.submitLogin = function (username, password) {
    
      AuthenticationService.Login(username, password,   function (response) {
      if (response.data.success == 1) {
                    if(response.data.configure_data[4]==1){
                      AuthenticationService.SetCredentials(username, password, response.data.configure_data, response.data.datasets);
                         
                        $state.go('main.home');
                        
                        $localStorage.username = response.data.datasets;
                        }
                    else{
                      
                      $state.go('resetpassword');
                    }
                } else {
                    $scope.wrongpass = true;
                    
                    $state.go('login')
                }
            });

    }

}]);



app.controller('salesCtrl', ['$scope', '$rootScope', '$location','$cookies','$localStorage', 'Data', 'SummaryView','$base64','$timeout', function($scope, $rootScope, $location,$cookies, $localStorage, Data,SummaryView, $base64, $timeout){
  

  username=$localStorage.username
  saurabh=$localStorage.username[0].username;
  var d=new Date();
  var second = new Date().getDate() - 1;
    var year=d.getFullYear();
    var month=d.getMonth()+1;
    if (month<10){
      month="0" + month;
    }
    var day=d.getDate();

    Data.documnetViewData()
      .then(function(response){
         $scope.length = response
         console.log($scope.length);
 
      })
    $scope.date=second+"/"+month+"/"+year;
    var json_data =   {
            "username":saurabh,
            }

    $scope.submitAmc = function(){
     
        Data.amcService(json_data)
        .then(function(response){
            var StudentData = response;
            console.log(StudentData);
          $("#saurabh").fadeIn(100);


   
   var length=StudentData.length;
   $scope.total = StudentData.length;
   var dataArray=[];

    for (var i=0; i<length; i++) {
             
        dataArray.push([StudentData[i]['title'], StudentData[i]['name'],'','', StudentData[i]['gendor'],StudentData[i]['dob'],  StudentData[i]['land_mark'],StudentData[i]['address'],StudentData[i]['city'],StudentData[i]['city'],StudentData[i]['pincode'],StudentData[i]['state'],'',StudentData[i]['email'],'',StudentData[i]['customerNumber'],StudentData[i]['category'],StudentData[i]['validityPeriod'],StudentData[i]['ageing'],StudentData[i]['sumInsured'],'As per the Policy wordings',StudentData[i]['brand'],StudentData[i]['model'],StudentData[i]['invoice'],StudentData[i]['purchasedOn'],'0 Year',StudentData[i]['productId'],StudentData[i]['brand'],StudentData[i]['section'],'NA','NA','NA']);  
    }

    $.fn.dataTable.ext.errMode = 'none';

    $('#runningOrdersTable').on( 'error.dt', function ( e, settings, techNote, message ) {
    console.log( 'An error has been reported by DataTables: ', message );
    } ) ;

   $('#runningOrdersTable').html('<table cellspacing="0" border="0" id="example" class="display" cellspacing="0" width="100%"><\/table>' );
     var table =$('#example').DataTable( {
        "scrollX": true,  
    
        "data": dataArray,
        "colReorder": true,
          "select": true,
          initComplete : function() {
           $('.buttons-excel').click()
         },

        "buttons": [ {
                'extend': 'excel',
                'title': '',
                'filename': function(){
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!

                var yyyy = today.getFullYear();
                if (dd < 10) {
                  dd = '0' + dd;
                } 
                if (mm < 10) {
                  mm = '0' + mm;
                } 
                var today = dd + '/' + mm + '/' + yyyy;
                return 'SSBAGIC' + today;
            },
            },],
        "dom": 'Blfrtip',
        
        "lengthMenu": [[10, 15, 20, -1], [10, 15, 20, "All"]],      
         "responsive": true,
        
        "columns": [
            
            { "title": "Title" },
            { "title": "FirstName" },
            { "title": "MiddleName" },
            { 'title': "LastName" },
            { "title": "Gender"},
            { "title": "DateofBirth" },
            { "title": "House/Building" },
            { "title": "StreetName" },
            { 'title': "SubArea/City" },
            { 'title': "Addressee" },
            {'title':"PinCode"},
            {'title':"State"},
            {'title':"Telephone"},
            {'title':"Email ID"},
            {'title':"Fax"},
            {'title':"Mobile No"},
            {'title':"ASSET CATEGORY"},
            {'title':"NO OF YEARS"},

            { "title": "AGEING" },
            { "title": "SUM_INSURED" },
            { "title": "Scope of Cover 1" },
            { 'title': "Manufacturer" },
            { "title": "Model"},
            { "title": "Serial Number or Invoice No. of Insured Asset" },
            { "title": "Invoice Date of Insured Asset / Warranty Start date" },
            { "title": "Manufacturer Product Warranty Period" },
            { 'title': "Bank Reference No. 1" },
            { 'title': "Make" },
            { 'title': "Section" },
            {'title':"Dealer Location"},
            {'title':"Dealer Code"},
            {'title':"Dealer Name"},
            

           

            
        ]
    });
    
    Data.UpdateStatus()
     .then(function(response){
      $scope.list = response.data.partner_data[0]; 
      window.location.reload();

    })
     window.location.reload();

            
        })
        
     }


    var selectempCode = document.getElementById("selUser2");
  
  var employeeList = SummaryView;

  
  angular.forEach(employeeList, function(value, key) {
    var option = document.createElement("option");
    option.text = value.fileName;
    option.value = value.fileName;
    selectempCode.appendChild(option);
    });

  $scope.fileReport = function(){

      var fileName = document.getElementById('selUser2').value;
      var json_data =   {
            "fileName":fileName,
            }
      Data.fileOrder(json_data)
        .then(function(response){
           var StudentData = response;
         console.log(StudentData);
          $("#saurabh").fadeIn(100);


   
   var length=StudentData.length;
   $scope.total = StudentData.length;
   var dataArray=[];

    for (var i=0; i<length; i++) {
             
        dataArray.push([StudentData[i]['title'], StudentData[i]['name'],'','', StudentData[i]['gendor'],StudentData[i]['dob'],  StudentData[i]['land_mark'],StudentData[i]['address'],StudentData[i]['city'],StudentData[i]['city'],StudentData[i]['pincode'],StudentData[i]['state'],'',StudentData[i]['email'],'',StudentData[i]['customerNumber'],StudentData[i]['category'],StudentData[i]['validityPeriod'],StudentData[i]['ageing'],StudentData[i]['sumInsured'],'As per the Policy wordings',StudentData[i]['brand'],StudentData[i]['modalNo'],StudentData[i]['invoice'],StudentData[i]['purchasedOn'],'0 Year',StudentData[i]['productId'],StudentData[i]['brand'],StudentData[i]['section'],'NA','NA','NA']);  
    }

    $.fn.dataTable.ext.errMode = 'none';

    $('#runningOrdersTable').on( 'error.dt', function ( e, settings, techNote, message ) {
    console.log( 'An error has been reported by DataTables: ', message );
    } ) ;

   $('#runningOrdersTable').html('<table cellspacing="0" border="0" id="example" class="display" cellspacing="0" width="100%"><\/table>' );
     var table =$('#example').DataTable( {
        "scrollX": true,  
    
        "data": dataArray,
        "colReorder": true,
          "select": true,
          initComplete : function() {
           $('.buttons-excel').click()
         },

        "buttons": [ {
                'extend': 'excel',
                'title': '',
                'filename': function(){
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!

                var yyyy = today.getFullYear();
                if (dd < 10) {
                  dd = '0' + dd;
                } 
                if (mm < 10) {
                  mm = '0' + mm;
                } 
                var today = dd + '/' + mm + '/' + yyyy;
                return 'SSBAGIC' + today;
            },
            },],
        "dom": 'Blfrtip',
        
        "lengthMenu": [[10, 15, 20, -1], [10, 15, 20, "All"]],      
         "responsive": true,
        
        "columns": [
            
            { "title": "Title" },
            { "title": "FirstName" },
            { "title": "MiddleName" },
            { 'title': "LastName" },
            { "title": "Gender"},
            { "title": "DateofBirth" },
            { "title": "House/Building" },
            { "title": "StreetName" },
            { 'title': "SubArea/City" },
            { 'title': "Addressee" },
            {'title':"PinCode"},
            {'title':"State"},
            {'title':"Telephone"},
            {'title':"Email ID"},
            {'title':"Fax"},
            {'title':"Mobile No"},
            {'title':"ASSET CATEGORY"},
            {'title':"NO OF YEARS"},

            { "title": "AGEING" },
            { "title": "SUM_INSURED" },
            { "title": "Scope of Cover 1" },
            { 'title': "Manufacturer" },
            { "title": "Model"},
            { "title": "Serial Number or Invoice No. of Insured Asset" },
            { "title": "Invoice Date of Insured Asset / Warranty Start date" },
            { "title": "Manufacturer Product Warranty Period" },
            { 'title': "Bank Reference No. 1" },
            { 'title': "Make" },
            { 'title': "Section" },
            {'title':"Dealer Location"},
            {'title':"Dealer Code"},
            {'title':"Dealer Name"},
           

           

            
        ]
    })
})
}
    }]); 


app.controller('QcCtrl', ['$scope', '$rootScope', '$location','$cookies','$localStorage', 'Data', 'qcdownload',  '$base64', function($scope, $rootScope, $location,$cookies, $localStorage, Data, qcdownload, $base64){
   
   var StudentData = qcdownload;
   console.log(StudentData);
   
   
   var length=StudentData.length;
   $scope.total = StudentData.length;
   var dataArray=[];

    for (var i=0; i<length; i++) {
             
        dataArray.push([StudentData[i]['mobile'], StudentData[i]['name'], StudentData[i]['productId'], StudentData[i]['policyId'], StudentData[i]['productName'],StudentData[i]['PlanName'],'<button type="button" class="btn-details" data-toggle="modal" data-backdrop="static" data-keyboard="false" data-target="#dlg-details" style="background: url(../images/pdf1.png) !important;background-size: 34px !important;padding-top:17px !important;background-repeat: no-repeat !important;background-position: center !important; margin-bottom: 7px !important;border: white !important;-webkit-text-fill-color: rgba(236, 228, 228, 0.09) !important; " >Complete</button>'],);  
    }



   $('#runningOrdersTable').html('<table cellspacing="0" border="0" id="example" class="display" cellspacing="0" width="100%"><\/table>' );
     var table =$('#example').DataTable( {

        "scrollX": true,  
    
        "data": dataArray,
        
        "columnDefs": [
                { "visible": false }
              ],
        "lengthMenu": [[10, 15, 20, -1], [10, 15, 20, "All"]],      
         "responsive": true,
         
        
        "columns": [

           

            { "title": "CustomerMobile" },
            { "title": "CustomerName" },
            { "title": "ProductId" },
            { 'title': "PolicyId" },
            { "title": "ProductName"},
            {"title":"PlanName"},
            { "title": "PDF"}
            
            
        ]
    });
     $('#example').on('click','button', function(){
        var data = table.row( $(this).parents('tr') ).data();


        var json_data =   {
            "productId":$scope.productId,
            
           }
           console.log(json_data);
        
        Data.QcList(json_data)
        .then(function(response){

          $scope.lists = [];
          var attendance_data = response.data.amc_data[0];
          console.log(attendance_data);
          $scope.list = attendance_data;
          $scope.string = attendance_data.checkString;
         
          
          console.log($scope.string);
           
        })


        $localStorage.report_json_data = {
            'mobile':data[0],
            'name':data[1],
            'productId': data[2],
            'policyId': data[3],
            'productName':data[4],
            'PlanName':data[5],
            
        }
        console.log($localStorage.report_json_data);
        window.location.href = '/#!/qcreport';


     });
  }]); 

app.controller('qcreportCtrl', ['$scope', '$rootScope', '$http','$timeout', '$location', 'Data', '$localStorage', function($scope, $rootScope, $http,$timeout, $location, Data, $localStorage){
   
    
    console.log($localStorage.report_json_data.date);
    console.log($localStorage.report_json_data);
    $scope.productId=$localStorage.report_json_data.productId;
    $scope.name=$localStorage.report_json_data.name;
    
     var json_data =   {
            "productId":$scope.productId,
            
           }
           console.log(json_data);
        
        Data.QcList(json_data)
        .then(function(response){

          $scope.lists = [];
          var attendance_data = response.data.amc_data[0];
          console.log(attendance_data);
          $scope.list = attendance_data;
          $scope.string = attendance_data.checkString;

            // Render the result as a PDF file
            var doc = new jsPDF();
                $('#formConfirmation').html(), 15, 15, 
                { 'width': 170, 'elementHandlers': specialElementHandlers }, 
                function(){ doc.save('sample-file.pdf'); }

        }) 
          
           
          
           


        
         }]); 

   

// AMC CLAIM

app.controller('amcclaimCtrl', ['$scope', '$rootScope', '$location','$cookies','$localStorage', 'Data', 'SummaryClaim','$base64','$timeout', function($scope, $rootScope, $location,$cookies, $localStorage, Data,SummaryClaim, $base64, $timeout){
  

  username=$localStorage.username
  saurabh=$localStorage.username[0].username;
  var d=new Date();
  var second = new Date().getDate() - 1;
    var year=d.getFullYear();
    var month=d.getMonth()+1;
    if (month<10){
      month="0" + month;
    }
    var day=d.getDate();

    Data.cliamViewData()
      .then(function(response){
         $scope.length = response
 
      })
    $scope.date=second+"/"+month+"/"+year;
    var json_data =   {
            "username":saurabh,
            }

    $scope.submitAmc = function(){
     
        Data.SummaryClaim(json_data)
        .then(function(response){
            var StudentData = response;
            console.log(StudentData);
          $("#saurabh").fadeIn(100);


   
   var length=StudentData.length;
   $scope.total = StudentData.length;
   var dataArray=[];

    for (var i=0; i<length; i++) {
             
        dataArray.push([StudentData[i]['policyId'], StudentData[i]['validity_start'],StudentData[i]['validity_end'],StudentData[i]['name'],StudentData[i]['category'], StudentData[i]['brand'],StudentData[i]['brand'],  StudentData[i]['modalNo'],StudentData[i]['validity_start'],StudentData[i]['customerNumber'],StudentData[i]['customerNumber'],StudentData[i]['email'],StudentData[i]['state'],StudentData[i]['address'],StudentData[i]['order_time'],StudentData[i]['orderDate'],'NO','YES','NA',StudentData[i]['problemType'],StudentData[i]['job_done'],'NA',StudentData[i]['address'],StudentData[i]['pincode'],StudentData[i]['city'],StudentData[i]['state'],StudentData[i]['address']]);  
    }

    $.fn.dataTable.ext.errMode = 'none';

    $('#runningOrdersTable').on( 'error.dt', function ( e, settings, techNote, message ) {
    console.log( 'An error has been reported by DataTables: ', message );
    } ) ;

   $('#runningOrdersTable').html('<table cellspacing="0" border="0" id="example" class="display" cellspacing="0" width="100%"><\/table>' );
     var table =$('#example').DataTable( {
        "scrollX": true,  
    
        "data": dataArray,
        "colReorder": true,
          "select": true,
          initComplete : function() {
           $('.buttons-excel').click()
         },

        "buttons": [ {
                'extend': 'excel',
                'title': '',
                'filename': function(){
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!

                var yyyy = today.getFullYear();
                if (dd < 10) {
                  dd = '0' + dd;
                } 
                if (mm < 10) {
                  mm = '0' + mm;
                } 
                var today = dd + '/' + mm + '/' + yyyy;
                return 'SSBAGIC' + today;
            },
            },],
        "dom": 'Blfrtip',
        
        "lengthMenu": [[10, 15, 20, -1], [10, 15, 20, "All"]],      
         "responsive": true,
        
        "columns": [
            
            { "title": "PolicyNumber" },
            { "title": "Policy Start date " },
            { "title": "Policy End date" },
            { 'title': "Insured Name" },
            { "title": "Asset categpry"},
            { "title": "Manufacturer" },
            { "title": "Asset Make" },
            { "title": "Asset Model" },
            { 'title': "Notification date" },
            { 'title': "Mobile no " },
            {'title':"Alternate no."},
            {'title':"Email Id"},
            {'title':"State "},
            {'title':"ClaimLocation"},
            {'title':"Loss Date "},
            {'title':"Loss Time"},
            {'title':"Delay in Intimation"},
            {'title':"Asset Use"},

            { "title": "Loss Description " },
            { "title": "Loss Type" },
            { "title": "Possible affected part/service" },
            { 'title': "Period since the last service" },
            { "title": "Inspection At "},
            { "title": "Pin Code" },
            { "title": "City" },
            { "title": "State" },
            { 'title': "Address" },
           
            

           

            
        ]
    });
    
    // Data.UpdateClaimStatus()
    //  .then(function(response){
    //   $scope.list = response.data.partner_data[0]; 
    //   // window.location.reload();

    // })
     // window.location.reload();

            
        })
        
     }


    var selectempCode = document.getElementById("selUser2");
  
  var employeeList = SummaryClaim;

  
  angular.forEach(employeeList, function(value, key) {
    var option = document.createElement("option");
    option.text = value.fileName;
    option.value = value.fileName;
    selectempCode.appendChild(option);
    });

  $scope.fileReport = function(){

      var fileName = document.getElementById('selUser2').value;
      var json_data =   {
            "fileName":fileName,
            }
      Data.fileClaimOrder(json_data)
        .then(function(response){
           var StudentData = response;
         console.log(StudentData);
          $("#saurabh").fadeIn(100);


   
   var length=StudentData.length;
   $scope.total = StudentData.length;
   var dataArray=[];

    for (var i=0; i<length; i++) {
             
        dataArray.push([StudentData[i]['policyId'], StudentData[i]['validity_start'],StudentData[i]['validity_end'],StudentData[i]['name'],StudentData[i]['category'], StudentData[i]['brand'],StudentData[i]['brand'],  StudentData[i]['modalNo'],StudentData[i]['validity_start'],StudentData[i]['customerNumber'],StudentData[i]['customerNumber'],StudentData[i]['email'],StudentData[i]['state'],StudentData[i]['address'],StudentData[i]['verificationDate'],'02:56 PM','NO','YES',StudentData[i]['partnerRemarks'],StudentData[i]['amcCheckList'],'NA','1 Month',StudentData[i]['address'],StudentData[i]['pincode'],StudentData[i]['city'],StudentData[i]['state'],StudentData[i]['address']]);  
    }

    $.fn.dataTable.ext.errMode = 'none';

    $('#runningOrdersTable').on( 'error.dt', function ( e, settings, techNote, message ) {
    console.log( 'An error has been reported by DataTables: ', message );
    } ) ;

   $('#runningOrdersTable').html('<table cellspacing="0" border="0" id="example" class="display" cellspacing="0" width="100%"><\/table>' );
     var table =$('#example').DataTable( {
        "scrollX": true,  
    
        "data": dataArray,
        "colReorder": true,
          "select": true,
          initComplete : function() {
           $('.buttons-excel').click()
         },

        "buttons": [ {
                'extend': 'excel',
                'title': '',
                'filename': function(){
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!

                var yyyy = today.getFullYear();
                if (dd < 10) {
                  dd = '0' + dd;
                } 
                if (mm < 10) {
                  mm = '0' + mm;
                } 
                var today = dd + '/' + mm + '/' + yyyy;
                return 'SSBAGIC' + today;
            },
            },],
        "dom": 'Blfrtip',
        
        "lengthMenu": [[10, 15, 20, -1], [10, 15, 20, "All"]],      
         "responsive": true,
        
        "columns": [
            
            { "title": "PolicyNumber" },
            { "title": "Policy Start date " },
            { "title": "Policy End date" },
            { 'title': "Insured Name" },
            { "title": "Asset categpry"},
            { "title": "Manufacturer" },
            { "title": "Asset Make" },
            { "title": "Asset Model" },
            { 'title': "Notification date" },
            { 'title': "Mobile no " },
            {'title':"Alternate no."},
            {'title':"Email Id"},
            {'title':"State "},
            {'title':"ClaimLocation"},
            {'title':"Loss Date "},
            {'title':"Loss Time"},
            {'title':"Delay in Intimation"},
            {'title':"Asset Use"},

            { "title": "Loss Description " },
            { "title": "Loss Type" },
            { "title": "Possible affected part/service" },
            { 'title': "Period since the last service" },
            { "title": "Inspection At "},
            { "title": "Pin Code" },
            { "title": "City" },
            { "title": "State" },
            { 'title': "Address" }, 
        ]
    })
})
}
    }]); 
