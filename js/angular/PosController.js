window.angularApp.controller("PosController", [
    "$scope", 
    "API_URL",
    "POS_API_URL", 
    "TOKEN",
    "window", 
    "jQuery",
    "$compile",
    "$uibModal",
    "$http",
    "$sce",
    "ProductCreateModal",
    "CategoryCreateModal",
    "BoxCreateModal",
    "SupplierCreateModal",
    "ProductViewModal",
    "ProductEditModal",
    "CustomerCreateModal",
    "BuyingProductModal",
    "PayNowModal",
    "CustomerDuePaidModal",
    "AddInvoiceNoteModal",
function (
    $scope,
    API_URL,
    POS_API_URL, 
    TOKEN,
    window,
    $,
    $compile,
    $uibModal,
    $http,
    $sce,
    ProductCreateModal,
    CategoryCreateModal,
    BoxCreateModal,
    SupplierCreateModal,
    ProductViewModal,
    ProductEditModal,
    CustomerCreateModal,
    BuyingProductModal,
    PayNowModal,
    CustomerDuePaidModal,
    AddInvoiceNoteModal
) {
    "use strict";

    $scope._percentage = function (amount, per)
    {
        if(false === $scope._isNumeric(amount) || false === $scope._isNumeric(per)) {
            if (window.store.sound_effect == 1) {
                window.storeApp.playSound("error.mp3");
            }
            window.toastr.warning("The discount amount isn't numeric!", "Warning!");
            return 0;
        }
        return (amount/100)*per;
    };
    $scope._isNumeric = function (val) {
      return !isNaN(parseFloat(val)) && 'undefined' !== typeof val ? parseFloat(val) : false;
    };
    $scope._isInt = function (value) {
        return !isNaN(value) && 
             parseInt(Number(value)) == value && 
             !isNaN(parseInt(value, 10));
    };
    $scope.isEditMode = false;
    $scope.invoiceId = null;
    $scope.orderData = {};
    $scope.billData = {};
    $scope.orderData.store_name = window.store.name;
    $scope.orderData.header = "\nOrder\n\n";
    $scope.billData.store_name = window.store.name;
    $scope.billData.header = "\nBill\n\n";
    $scope.billData.footer = "\nMerchant Copy\n\n";

    $http.defaults.headers.common['Authorization'] = 'Bearer '+localStorage.getItem('token');
    
    //count total items
    $scope.countTotalItems = function (items) {
        //console.log(items);
        $scope.totalQuantity = 0;
        window.angular.forEach(items, function(customerItem, key) {
            $scope.totalQuantity +=customerItem.quantity;
        });
    }    

    // ===============================================
    // start showing customer dropdown list
    // ===============================================

    $scope.customerName = "";
    $scope.dueAmount = 0;
    $scope.creditAmount = 0;
    $scope.hideCustomerDropdown = false;
    $scope.customerArray = [];
    $scope.totalTax = 0;
    $scope.coupanApplied = false;
    $scope.discount_on_bill = 0;
    $scope.showCustomerList = function (isClick) {
        if ($scope.isEditMode) { return false; }
        if (isClick) { 
            //$scope.customerName = ""; 
        }
        if (window.deviceType == 'computer') {
            $("#customer-name").focus();
        }
        $http({
            url: POS_API_URL + "/customer?search=" + $scope.customerName,
            method: "GET",
            cache: false,
            processData: false,
            contentType: false,
            dataType: "json"
        }).
        then(function(response) {
            $scope.hideCustomerDropdown = false;
            $scope.customerArray = [];
            window.angular.forEach(response.data.data, function(customerItem, key) {
                if (customerItem) {
                    $("#customer-dropdown").scrollTop($("#customer-dropdown").offset().top);
                    $("#customer-dropdown").perfectScrollbar("update");
                    $scope.customerArray.push(customerItem);
                }
            });

        }, function(response) {
            if (window.store.sound_effect == 1) {
                window.storeApp.playSound("error.mp3");
            }
            window.toastr.warning(response.data.errorMsg, "Warning!");
        });
    };
    $("#customer-name").on("click", function() {
        $scope.showCustomerList(true);
    });
    $scope.addCustomer = function (customer , callApi = false) {

        if(customer && customer.customer_id != $scope.customerId){
            $scope.removeCoupan(false,false);
        }

        if (customer && customer.customer_id) {
            var contact = customer.customer_mobile || customer.customer_email;
           
            if(!customer.customer_name){
                $scope.customerName = " (" + customer.customer_mobile + ")";
            }
            else{
                 $scope.customerName = customer.customer_name + " (" + contact + ")";
            }
            
            $scope.customerEmail = customer.customer_email;
            $scope.customerId = customer.customer_id;
            $scope.dueAmount = customer.due_amount;
            $scope.creditAmount = customer.credit_balance ? customer.credit_balance : 0.00;

            $scope.hideCustomerDropdown = true;
            var pos_customer = "C: " + $scope.customerName + "\n";
            var ob_info = pos_customer+ "\n";
            $scope.orderData.info = ob_info;
            $scope.billData.info = ob_info;
            $scope._calcTotalPayable();


            var temp_id = $scope.selectedCart.temp_id;
            var $queryString  = 'temp_id='+temp_id+'&customer_id='+$scope.customerId;
            if($scope.customerId && $scope.customerId !== undefined){
                $http({
                    url: POS_API_URL + "/cart/customer?" + $queryString,
                    method: "POST",
                    cache: false,
                    processData: false,
                    contentType: false,
                    dataType: "json"
                }).
                then(function(response) {
                    if(callApi){
                        $scope.getCardItems();
                    }
                   
                }, function(response) { 
                });
            }

        } else {
            if (window.store.sound_effect == 1) {
                window.storeApp.playSound("error.mp3");
            }
            //window.toastr.warning("Oops!, Invalid customer", "Warning!");
        }
    };
    if (window.getParameterByName("customer_id")) {
        //$scope.addCustomer(window.getParameterByName("customer_id"));
    } else {
        // add walking customer to invoice
        //$scope.addCustomer(1);
    }

    // ===============================================
    // end showing customer dropdown list
    // ===============================================

    // ===============================================
    // start showing product list
    // ===============================================

    $scope.productName = "";
    $scope.productArray = [];
    $scope.showLoader = !1;
    $scope.showAddProductBtn = !1;
    $scope.totalProduct = 0;
    $scope.productScan = '';
    $scope.addedProduct = false;
    $scope.showProductList = function () {
        
        $scope.showLoader = 1;
        var productCode = $scope.productName;
        var categoryId = $scope.ProductCategoryID ? $scope.ProductCategoryID : '';
        
        if ($scope._isInt(productCode) && productCode.length == 8) {
            
            $scope.addedProduct = false;
            $scope.searchProduct(productCode);
            // window.angular.forEach($scope.productArray, function(productItem, key) {
            //     if(productItem.p_code == productCode){
            //         console.log(productItem.p_code);
                    
            //         $scope.addItemToInvoice(productItem.p_id);
            //         break;
            //     }
                
            // });
            

                // if($scope.productScan){
                //     console.log($scope.productScan);
                //     // if(response.data.data.results[0].p_id == $scope.productScan){
                //     //      
                //     // }
                // }   
        }
        else{
            
            var search = $('#product-name').val();
            if(search){
                $scope.productScan = search;
            }
            else{
                $scope.productScan = '';
            }


            $http({
            url: POS_API_URL + "/products?category_id=" + categoryId + "&p_code="+$scope.productScan,
            method: "GET",
            cache: false,
            processData: false,
            contentType: false,
            dataType: "json"
            }).
            then(function(response) {
                $scope.productArray = [];
                window.angular.forEach(response.data.data.results, function(productItem, key) {

                  if (productItem) {
                    $scope.productArray.push(productItem);
                  }
                });
                // if($scope.productScan){
                //     console.log(response.data.data.results[0]);
                //     if(response.data.data.results[0].p_id == $scope.productScan){
                //         $scope.addItemToInvoice(response.data.data.results[0].p_id); 
                //     }
                    
                // }
                window.$("#item-list").perfectScrollbar('update');
                $scope.totalProduct = $scope.productArray.length;
                $scope.showLoader = !1;
                // setTimeout(function () {
                //     $scope.$apply(function(){
                //         $scope.showAddProductBtn = !parseInt($scope.totalProduct);
                //     });
                // }, 100);
            }, function(response) {
                if(response.status === 401 && response.statusText == 'Unauthorized'){
                    var username =  localStorage.getItem('email');
                    var password =  localStorage.getItem('password');
                    $scope.relogin(username, password, 'product');
                }
                else{
                    window.toastr.warning(response.data.errorMsg, "Warning!");
                }
                if (window.store.sound_effect == 1) {
                    window.storeApp.playSound("error.mp3");
                }
                
            });
        }
    };

    $scope.showProductList();
    $("#category-search-select").on('select2:selecting', function(e) {
        var categoryID = e.params.args.data.id;
        $scope.ProductCategoryID = categoryID;
        $scope.showProductList();
    });

    $scope.searchProduct = function(p_code = false){
        
            $http({
            url: POS_API_URL + "/products?p_code="+p_code,
            method: "GET",
            cache: false,
            processData: false,
            contentType: false,
            dataType: "json"
            }).
            then(function(response) {
                $scope.productArray = [];
                window.angular.forEach(response.data.data.results, function(productItem, key) {

                  if (productItem) {
                    $scope.productArray.push(productItem);
                  }
                });


                window.angular.forEach($scope.productArray, function(productItem, key) {
                    if(productItem.p_code == p_code && !$scope.addedProduct){
                        
                        $scope.addedProduct = true;
                        //$scope.searchProduct(productItem.p_code);
                        $scope.addItemToInvoice(productItem.p_id);
                        return false;
                    }
                    
                });
                
                window.$("#item-list").perfectScrollbar('update');
                $scope.totalProduct = $scope.productArray.length;
                $scope.showLoader = !1;
                setTimeout(function () {
                    $scope.$apply(function(){
                        $scope.showAddProductBtn = !parseInt($scope.totalProduct);
                    });
                }, 100);
            }, function(response) {
                if(response.status === 401 && response.statusText == 'Unauthorized'){
                    var username =  localStorage.getItem('email');
                    var password =  localStorage.getItem('password');
                    $scope.relogin(username, password, 'product');
                }
                else{
                    window.toastr.warning(response.data.errorMsg, "Warning!");
                }
                if (window.store.sound_effect == 1) {
                    window.storeApp.playSound("error.mp3");
                }
                
            });
    }

    // ===============================================
    // end showing product list
    // ===============================================

    // ===============================================
    // start invoice calculation
    // ===============================================

    $scope.itemArray        = [];
    $scope.historyArray = [];
    $scope.totalItem        = 0;
    $scope.totalQuantity    = 0;
    $scope.totalAmount      = 0;
    $scope.discountAmount   = 0;
    $scope.taxAmount        = 0;
    $scope.totalPayable     = 0;
    $scope.taxInput         = 0;
    $scope.discountInput    = 0;
    $scope.discountType    = 'plain';
    $scope._calcDisAmount = function () {
        if (window._.includes($scope.discountInput, '%')) {
            $scope.discountType = 'percentage';
        } else {
            $scope.discountType = 'plain';
        }
        if ($scope.discountInput < 1) {
            $scope.discountAmount = 0;
            $scope.discountInput = 0;
        } else {
            $scope.discountAmount = parseFloat($scope.discountInput);
        }
    };
    $scope._calcTaxAmount = function () {
        if ($scope.taxInput < 1 || $scope.taxInput > 100) {
            $scope.taxAmount = 0;
            $scope.taxInput = 0;
        } else {
            $scope.taxAmount = (parseFloat($scope.taxInput) / 100) * parseFloat($scope.totalAmount);
        }
    };
    $scope._calcTotalPayable = function () {
        var discountPercentage = 0;
        $scope._calcDisAmount();
        $scope._calcTaxAmount();
        $scope.totalPayable = (($scope.totalAmount  + $scope.taxAmount)) + parseFloat($scope.dueAmount);
        if ($scope.totalPayable != 0 && ($scope.discountAmount >= $scope.totalPayable)) {
            $scope.discountAmount = 0;
            $scope.discountInput = 0;
            if (window.store.sound_effect == 1) {
                window.storeApp.playSound("error.mp3");
            }
            window.toastr.warning("Discount amount must be less than payable amount", "Warning!");
        }
        if ($scope.discountType == 'percentage') {
            discountPercentage =  parseFloat($scope._percentage($scope.totalPayable, $scope.discountAmount));
        } else {
            discountPercentage =  parseFloat($scope.discountAmount);
        }
        $scope.totalPayable =  $scope.totalPayable - discountPercentage;
        $scope.billData.totals = "Grand Total   " + $scope.totalPayable;
    };
    $scope.addDiscount = function () {
        $scope._calcTotalPayable();
    };
    $scope.addTax = function () {
        $scope._calcTotalPayable();
    };
    $scope.itemQuantity = 0;
    $scope.isPrevQuantityCalcculate = false;
    $scope.prevQuantity = 0;
    $scope.itemListHeight = 0;
    $scope.totalPrice = 0;
    $scope.total_discount = 0;
    $scope.coupan_Code = '';
    $scope.coupan_code_discount = 0;
    $scope.cartArray = [];
    $scope.activeIndex = 0;
    $scope.selectedCart = '';


    //get cart item

    $scope.getCardItems = function () {
        
         $http({
            url: POS_API_URL + "/mine/cart?",
            method: "GET",
            cache: false,
            processData: false,
            contentType: false,
            dataType: "json"
        }).
        then(function(response) {
            if(!response.data.status){
                $scope.showLoader = 0;
                return false;
            }
            //get last cart data
            var cartIndex = $scope.activeIndex;
            var tempIndex = parseInt(cartIndex)+1;
            $scope.cartArray = response.data.data;
            if($scope.cartArray.length){
                $scope.selectedCart = response.data.data[cartIndex];
                $scope.itemArray = response.data.data[cartIndex].products;
                $scope.totalPrice = response.data.data[cartIndex].total_price;
                $scope.total_discount = response.data.data[cartIndex].total_discount;
                $scope.totalTax = response.data.data[cartIndex].total_tax;
                $scope.countTotalItems(response.data.data[cartIndex].products);
                $scope.discount_on_bill = response.data.data[cartIndex].discount_on_bill;
                if($scope.coupan_Code !=''){
                    $scope.applyDiscount($scope.coupan_Code, true);
                }
                setTimeout(function(){ 
                    $('.temp_id_invoice span.select2-selection__rendered').text('Invoice '+$scope.selectedCart.temp_id);
                }, 250);
                if($scope.selectedCart.customer_id){
                    $scope.filterCustomer($scope.selectedCart.customer_id);
                }
                
            }
            else{

                $scope.selectedCart = '';
                $scope.itemArray = [];
                $scope.totalPrice = 0;
                $scope.total_discount = 0;
                $scope.totalTax = 0;
                $scope.discount_on_bill = 0;
                $scope.countTotalItems([]);
                $scope.coupan_code_discount = 0;
                $scope.coupanApplied = false;
                $scope.coupan_Code = '';

                 setTimeout(function(){ 
                    $('.temp_id_invoice span.select2-selection__rendered').text('No Invoice');
                }, 250);
            }
            $scope.showLoader = 0;
            $scope.totalItem = window._.size($scope.itemArray);
            
        }, function(response) {
            
        });
    }

    //customer filter
    $scope.filterCustomer = function(customer_id){
        $http({
            url: POS_API_URL + "/customer",
            method: "GET",
            cache: false,
            processData: false,
            contentType: false,
            dataType: "json"
        }).
        then(function(response) {
            $scope.customerArray = response.data.data;
            if($scope.customerArray.length){
                var selectedCutomer = $scope.customerArray.filter(function(object) {
                  return object.customer_id ==  customer_id;
                });
            }
            $scope.addCustomer(selectedCutomer[0]);
        }, function(response) {
        });
    }

    //applyDiscount
    $scope.applyDiscount = function(code, message = false){
        if($scope.customerId == undefined){
            window.toastr.warning('Please select customer', "Warning!");
            return false;
        }
        $scope.coupan_Code = code;
        if(code == ''){
            window.toastr.warning('Please enter coupon code', "Warning!");
            return false;
        }

        $http({
            url: POS_API_URL + "/cart/apply-coupon?code="+$scope.coupan_Code+'&customer_id='+$scope.customerId+'&temp_id='+$scope.selectedCart.temp_id,
            method: "POST",
            cache: false,
            processData: false,
            contentType: false,
            dataType: "json"
        }).
        then(function(response) {
            if(message){
                window.toastr.success('Coupon value recalculated successfully.', "success");
            }
            else{
                window.toastr.success('Coupon applied successfully.', "success");
            }
            
            $scope.coupan_code_discount = parseFloat(response.data.data.total_discount);
            $scope.coupanApplied = true;
        }, function(response) {
            if(!response.data.status){
                $scope.removeCoupan(false,false);
                window.toastr.warning(response.data.message, "Warning!");
            }
            
        });
    };

    $scope.removeCoupan = function(amount = false, message = true){
        if(message){
            window.toastr.success('Coupon removed successfully.', "success");
        }
        $scope.coupan_code_discount = 0;
        $scope.coupanApplied = false;
        $scope.coupan_Code = '';
    }

    // $scope.selectedTrue = function(item){
    //     console.log(item);
    //     return $scope.cartArray[0];
    // }

    // ===============================================
    // end invoice calculation
    // ===============================================


    // ===============================================
    // start add product item into invoice item array
    // ===============================================

    $scope.addItemToInvoice = function (id, price_after_disc = false,qty, index) {
       
        if((price_after_disc || price_after_disc == 0) && price_after_disc != false){
            if(price_after_disc <= 0){
                window.toastr.warning('After discount price TOO LOW! Please re-check cart.', "Warning!");
                return false;
            }
            
        }

        if (!qty) {
            qty = 1;
        }
        if (index != null) {
            var selectItem = $("#"+index);
            $("#item-list .item").removeClass("select");
            if (selectItem.length) {
                selectItem.addClass("select");
            }
        }
        var $queryString = "product_id=" + id + "&quantity="+qty;

        if($scope.selectedCart && $scope.cartArray.length){
            $queryString += '&temp_id='+$scope.selectedCart.temp_id+'&customer_old=1';
        }
        else{
            $queryString += '&customer_old=0';
        }
        if($scope.customerId){
            $queryString += '&customer_id='+$scope.customerId;
        }
        $scope.showLoader = 1;
        $http({
            url: POS_API_URL + "/cart/add?" + $queryString,
            method: "POST",
            cache: false,
            processData: false,
            contentType: false,
            dataType: "json"
        }).
        then(function(response) {

            
            if(!response.data.status){
                $scope.getCardItems();
                window.toastr.warning(response.data.message, "Warning!");
                $scope.showLoader = 0;
                return false;
            }

            
            //get last cart data
            var cartIndex = $scope.activeIndex;
            var tempIndex = parseInt(cartIndex)+1;
            $scope.cartArray = response.data.data;
            if($scope.cartArray.length){
                $scope.selectedCart = response.data.data[cartIndex];
                $scope.itemArray = response.data.data[cartIndex].products;
                $scope.totalPrice = response.data.data[cartIndex].total_price;
                $scope.total_discount = response.data.data[cartIndex].total_discount;
                $scope.totalTax = response.data.data[cartIndex].total_tax;
                $scope.totalItem = window._.size($scope.itemArray);
                $scope.countTotalItems(response.data.data[cartIndex].products);
                $scope.discount_on_bill = response.data.data[cartIndex].discount_on_bill;
                if($scope.coupan_Code !=''){
                    $scope.applyDiscount($scope.coupan_Code, true);
                }
                
                setTimeout(function(){ 
                    $('.temp_id_invoice span.select2-selection__rendered').text('Invoice '+$scope.selectedCart.temp_id);
                }, 250);
            }
            else{
                 setTimeout(function(){ 
                    $('.temp_id_invoice span.select2-selection__rendered').text('No Invoice Invoice');
                }, 250);
            }
            $scope.showLoader = 0;






            // var cartIndex = $scope.activeIndex;
            // $scope.itemArray = response.data.data[cartIndex].products;
            // //$scope.selectedCart = $scope.cartArray[cartIndex];
            // $scope.totalPrice = response.data.data[cartIndex].total_price;
            // $scope.totalItem = window._.size($scope.itemArray);
            // $scope.total_discount = response.data.data[cartIndex].total_discount;
            // $scope.totalTax = response.data.data[cartIndex].total_tax;
            // $scope.countTotalItems(response.data.data[cartIndex].products);
           
            $('#product-name').val('');
            $scope.productName = '';
            $scope.showProductList();
            window.onbeforeunload = function() {
              return "Data will be lost if you leave the page, are you sure?";
            };
            
        }, function(response) {
            
            if (window.store.sound_effect == 1) {
                window.storeApp.playSound("error.mp3");
            }
            window.toastr.warning(response.data.errorMsg, "Warning!");
            $scope.showLoader = !1;
        });
    };

    // ===============================================
    // end add product item into invoice item array
    // ===============================================


    // ============================================
    // start decrease invoice item quantity
    // ============================================

    $scope.DecreaseItemFromInvoice = function (id, qty) {

        var $queryString = "product_id=" + id;

        if($scope.selectedCart){
            $queryString += '&temp_id='+$scope.selectedCart.temp_id+'&customer_old=1';
        }
        else{
            $queryString += '&customer_old=0';
        }

        if($scope.customerId){
            $queryString += '&customer_id='+$scope.customerId;
        }

        if($scope.selectedCart.products.length <2){
            $scope.customerName     = "";
            $scope.customerId       = "";
            $scope.removeCoupan(false,false);
            $scope.dueAmount = 0;
        }

        $scope.showLoader = 1;
        $http({
            url: POS_API_URL + "/cart/decrease?" + $queryString,
            method: "POST",
            cache: false,
            processData: false,
            contentType: false,
            dataType: "json"
        }).
        then(function(response) {
            // $scope.itemArray = response.data.data.products;
            // $scope.totalPrice = response.data.data.total_price;
            // $scope.totalItem = window._.size($scope.itemArray);
            // $scope.total_discount = response.data.data.total_discount;
            // $scope.totalTax = response.data.data.total_tax;
            // $scope.countTotalItems(response.data.data.products);
            // $scope.discount_on_bill = response.data.data.discount_on_bill;
            // $scope.showLoader = !1;
            $scope.getCardItems();
            window.onbeforeunload = function() {
              return "Data will be lost if you leave the page, are you sure?";
            };
            
            
        }, function(response) {
            if (window.store.sound_effect == 1) {
                window.storeApp.playSound("error.mp3");
            }
            window.toastr.warning(response.data.errorMsg, "Warning!");
            $scope.showLoader = !1;
        });
    };

    // ====================================================
    // end decrease invoice item quantity
    // ====================================================


    // ====================================================
    // start add product into invoice array by invoice item
    // ====================================================

    if (window.getParameterByName("invoice_id")) {
        $scope.invoiceId = window.getParameterByName("invoice_id");
        $http({
            url: API_URL + "/_inc/invoice.php?action_type=EDIT&invoice_id=" + $scope.invoiceId,
            method: "GET",
            cache: false,
            processData: false,
            contentType: false,
            dataType: "json"
        }).
        then(function(response) {
            $scope.customerName = response.data.invoice.customer_name;
            $scope.customerId = response.data.invoice.customer_id;
            $scope.totalPayable = window.getNumber(response.data.invoice.payable_amount);
            $scope.dueAmount = window.getNumber(response.data.invoice.previous_due);

            $scope.totalPayable = window.getNumber(response.data.invoice.payable_amount);
            $scope.totalAmount = window.getNumber(response.data.invoice.subtotal);
            $scope.taxInput = window.getNumber(response.data.invoice.tax_amount);
            if (response.data.invoice.discount_type == 'percentage') {
                $scope.discountType = 'percentage';
                $scope.discountAmount = (window.getNumber(response.data.invoice.discount_amount) / $scope.totalAmount) * 100;
                $scope.discountInput = $scope.discountAmount+'%';
            } else {
                $scope.discountType = 'plain';
                $scope.discountAmount = window.getNumber(response.data.invoice.discount_amount);
                $scope.discountInput = $scope.discountAmount;
            }
            $scope.taxAmount = response.data.invoice.tax_amount;
            window.angular.forEach(response.data.invoice.items, function(productItem) {
                if (productItem) {
                    var item = [];
                    item.id = productItem.item_id;
                    item.categoryId = productItem.category_id;
                    item.supId = productItem.sup_id;
                    item.name = productItem.item_name;
                    item.price = window.getNumber(productItem.item_price);
                    item.quantity = window.getNumber(productItem.item_quantity);
                    item.subTotal = parseFloat(productItem.item_price) * productItem.item_quantity;
                    $scope.totalItem = $scope.totalItem + 1;
                    $scope.totalQuantity = $scope.totalQuantity + parseInt(productItem.item_quantity);
                    $scope.itemArray.unshift(item);
                }
            });

        }, function(response) {
            if (window.store.sound_effect == 1) {
                window.storeApp.playSound("error.mp3");
            }
            window.toastr.warning(response.data.errorMsg, "Warning!");
            window.location = window.baseUrl + '/admin/pos.php';
        });
    }

    // ====================================================
    // end add product into invoice array by invoice item
    // ====================================================


    // ===================================================
    // start remove product from invoice
    // ===================================================

    $scope.removeItemFromInvoice = function (index, id) {
        var $queryString = "product_id=" + id;

        if($scope.selectedCart){
            $queryString += '&temp_id='+$scope.selectedCart.temp_id+'&customer_old=1';
            if($scope.selectedCart.products.length <2){
                $scope.customerName     = "";
                $scope.customerId       = "";
                $scope.dueAmount = 0;
                $scope.removeCoupan(false,false);
            }
        }
        $scope.showLoader = 1;
        $http({
            url: POS_API_URL + "/mine/cart/product/remove?" + $queryString,
            method: "POST",
            cache: false,
            processData: false,
            contentType: false,
            dataType: "json"
        }).
        then(function(response) {

            
            $scope.getCardItems();
            
            //$scope.showLoader = !1;

            window.onbeforeunload = function() {
              return "Data will be lost if you leave the page, are you sure?";
            };
            
        }, function(response) {
            if (window.store.sound_effect == 1) {
                window.storeApp.playSound("error.mp3");
            }
            window.toastr.warning(response.data.errorMsg, "Warning!");
            $scope.showLoader = !1;
        });
    };

    // if invocie edit mode then disable customer dropdown
    if (window.getParameterByName("customer_id") && window.getParameterByName("invoice_id")) {
        $scope.isEditMode = true;
    }

    // ============================================
    // end remove product from invoice
    // ============================================

    
    // ============================================
    // start reset pos
    // ============================================
    $scope.resetPos = function () {
        if (window.getParameterByName("customer_id")) {
            window.location = "pos.php";
        } else {
            $scope.customerArray    = [];
            $scope.itemArray        = [];
            $scope.invoiceId        = "";
            $scope.invoiceNote      = "";
            $scope.hideCustomerDropdown = true;
            $scope.dueAmount        = 0;
            $scope.customerName     = "";
            $scope.customerId       = "";
            $scope.totalItem        = 0;
            $scope.totalQuantity    = 0;
            $scope.totalAmount      = 0;
            $scope.discountAmount   = 0;
            $scope.totalPayable     = 0;
            $scope.discountInput    = 0;
            $scope.totalTax = 0;
            $scope.totalPrice = 0;
            $scope.dueAmount = 0;
            $scope.coupan_code_discount = 0;
            $scope.coupanApplied = false;
            $scope.coupan_Code = '';
            $scope.discount_on_bill = 0;
            $scope.addCustomer(1);
            $("#invoice-note").data("note", "");
            $scope.resetBillandOrderItems();
            $scope.getCardItems();
        }
    };

    // $('.draft-sel').change(function(){
    //    // $scope.cartIndex = $(this)[0].selectedIndex;

    //     var cartIndex = $(this)[0].selectedIndex;
    //     $scope.selectedCart = $scope.cartArray[cartIndex];
    //     $scope.itemArray = $scope.cartArray[cartIndex].products;
    //     console.log($scope.itemArray);
    //     // $scope.totalPrice = $scope.cartArray[cartIndex].total_price;
    //     // $scope.total_discount = $scope.cartArray[cartIndex].total_discount;
    //     // $scope.totalTax = $scope.cartArray[cartIndex].total_tax;
    //     // $scope.countTotalItems($scope.cartArray[cartIndex].products);
        
    // });

    $scope.changeTempId = function(){
        //$scope.cartIndex = $('#select_temp_id')[0].selectedIndex;
        var cartIndex = $('#select_temp_id')[0].selectedIndex;
        var tempIndex = parseInt(cartIndex)+1;
        $scope.selectedCart = $scope.cartArray[cartIndex];
        $scope.itemArray = $scope.cartArray[cartIndex].products;
        $scope.totalPrice = $scope.cartArray[cartIndex].total_price;
        $scope.total_discount = $scope.cartArray[cartIndex].total_discount;
        $scope.totalTax = $scope.cartArray[cartIndex].total_tax;
        $scope.countTotalItems($scope.cartArray[cartIndex].products);
        $scope.discount_on_bill = $scope.cartArray[cartIndex].discount_on_bill;

        if($scope.selectedCart.customer_id){
            $scope.filterCustomer($scope.selectedCart.customer_id);
        }
        else{

            $scope.customerName     = "";
            $scope.customerId       = "";
            $scope.customerEmail = "";
            $scope.dueAmount = 0.00;
            $scope.creditAmount = 0.00;
            $scope.discount_on_bill = 0;
            $scope._calcTotalPayable();
        }

        $scope.removeCoupan(false, false);

        setTimeout(function(){ 
            $('.temp_id_invoice span.select2-selection__rendered').text('Invoice '+$scope.selectedCart.temp_id);
        }, 250);

        
    }

    // ============================================
    // end reset pos
    // ============================================


    // =============================================
    // context menu for pay button right click for
    // =============================================

    // $('#pay-button').contextMenu({
    //     selector: 'button', 
    //     callback: function(key, options) {
    //         switch(key) {
    //             case "reset":
    //                 $scope.resetPos();
    //             break;
    //         }
    //     },
    //     items: {
    //         "reset": {name: "Reset Invoice", icon: "fa-circle-o"},
    //     }
    // });

    // =============================================
    // end menu for pay button right click for
    // =============================================
    //add new data for new cusomer
    $scope.addcartfornewcustomer = function(customer_old, callCart= false){
        
        var temp_id = $scope.selectedCart.temp_id;
        var $queryString  = 'temp_id='+temp_id+'&customer_id='+$scope.customerId;
        $scope.itemArray = [];
        $scope.selectedCart = '';
        if($scope.customerId && $scope.customerId !== undefined){
            $http({
                url: POS_API_URL + "/cart/customer?" + $queryString,
                method: "POST",
                cache: false,
                processData: false,
                contentType: false,
                dataType: "json"
            }).
            then(function(response) {
                $scope.customerName     = "";
                $scope.customerId       = "";
                if(callCart){
                    $scope.showLoader = 0;
                    $scope.getCardItems();
                }
                
            }, function(response) {
                
            });
        }

        $scope.invoiceId        = "";
        $scope.invoiceNote      = "";
        $scope.hideCustomerDropdown = true;
        $scope.dueAmount        = 0;
        $scope.customerName     = "";
        $scope.customerId       = "";
        $scope.totalItem        = 0;
        $scope.totalQuantity    = 0;
        $scope.totalAmount      = 0;
        $scope.discountAmount   = 0;
        $scope.totalPayable     = 0;
        $scope.discountInput    = 0;
        $scope.totalTax = 0;
        $scope.totalPrice = 0;
        $scope.dueAmount = 0;
        $scope.coupan_code_discount = 0;
        $scope.coupanApplied = false;
        $scope.coupan_Code = '';
        $scope.discount_on_bill = 0;
        

        setTimeout(function(){ 
            $('.temp_id_invoice span.select2-selection__rendered').text('New Invoice');
        }, 250);
       
    }

    // =============================================
    // start print popup window
    // =============================================

    $scope.popupWindow = function(data) {
        var mywindow = window.open('', 'pos_print', 'height=500,width=300');
        mywindow.document.write('<html><head><title>Print</title>');
        mywindow.document.write('</head><body >');
        mywindow.document.write(data);
        mywindow.document.write('</body></html>');
        mywindow.print();
        mywindow.close();
        return true;
    };

    // =============================================
    // end print popup window
    // =============================================


    // ============================================
    // start bill and order items
    // ============================================
    $scope.setBillandOrderItems = function() {
        $scope.orderData.items = '';
        $scope.billData.items = '';
        var billaOrderinc = 1;
        var orderItem = '';
        var billItem = '';
        window._.map($scope.itemArray, function (item, key) {
            if (item.id) {
                orderItem += "#";
                orderItem += billaOrderinc;
                orderItem += " - " + item.name;
                orderItem += "\n   ";
                orderItem += '[' + item.quantity + ']';
                orderItem += "\n\n";
                billItem += "#";
                billItem += billaOrderinc;
                billItem += " - " + item.name;
                billItem += "\n   ";
                billItem += item.quantity;
                billItem += " x " + item.price;
                billItem += "   " + item.subTotal;
                billItem += "\n";
            }
            billaOrderinc++;
        });
        $scope.orderData.items = orderItem;
        $scope.billData.items = billItem;
    };
    $scope.resetBillandOrderItems = function() {
        $scope.orderData.header = '';
        $scope.orderData.footer = '';
        $scope.orderData.info = '';
        $scope.orderData.items = {};
        $scope.billData.items = {};
        $scope.orderData.store_name = '';
        $scope.orderData.totals = '';
    };
    // ============================================
    // end bill and order items
    // ============================================


    // =============================================
    // start order and bill print
    // =============================================

    $scope.printOrder = function () {
        $.each(window.orderPrinters, function() {
            var socket_data = { 
                'printer': this,
                'logo': '',
                'text': $scope.orderData 
            };
            $.get(window.baseUrl+'_inc/print.php', {data: JSON.stringify(socket_data)});
        });
        return false;
    };

    $scope.printBill = function () {
        var socket_data = {
            'printer': window.printer,
            'logo': '',
            'text': $scope.billData
        };
        $.get(window.baseUrl+'/_inc/print.php', {data: JSON.stringify(socket_data)});
        return false;
    };

    $scope.clickOnPrintOrder = function () {
        if ($scope.itemArray.length <= 0) {
            if (window.store.sound_effect == 1) {
                window.storeApp.playSound("error.mp3");
            }
            window.toastr.warning("Please, select at least one product item", "Warning!");
            return false;
        }
        if (window.store.remote_printing != 1) {
            $scope.printOrder();
        } else {
            $scope.popupWindow($('#order_tbl').html());
        }
    };

    $scope.clickOnPrintBill = function () {
        if ($scope.itemArray.length <= 0) {
            if (window.store.sound_effect == 1) {
                window.storeApp.playSound("error.mp3");
            }
            window.toastr.warning("Please, select at least one product item", "Warning!");
            return false;
        }
        if (window.store.remote_printing != 1) {
            $scope.printBill();
        } else {
            $scope.popupWindow($('#bill_tbl').html());
        }
    };

    // =============================================
    // end order and bill print
    // =============================================


    // =============================================
    // start opening invoice payment form
    // =============================================

    $scope.payNow = function () {
        $scope.invoiceNote = $("#invoice-note").data("note");
        if ($scope.itemArray.length <= 0) {
            if (window.store.sound_effect == 1) {
                window.storeApp.playSound("error.mp3");
            }
            window.toastr.warning("Please, select at least one product item", "Warning!");
            return false;
        }
        if (!$scope.customerName) {
        window.swal({
          title: "Are you sure?",
          text: "You want to continue without selecting customer.",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            $http({
                url: POS_API_URL + "/customer?search=CASH",
                method: "GET",
                cache: false,
                processData: false,
                contentType: false,
                dataType: "json"
            }).
            then(function(response) {
                if ( (response.data.data).length > 0) {
                    $scope.addCustomer(response.data.data[0]);
                    PayNowModal($scope);
                }
                else {
                    window.toastr.warning("Please, select a customer Because default customer may be deleted parmanently.", "Warning!");
                }
                
            }, function(response) {
                window.toastr.warning("Please, select a customer Because default customer may be deleted parmanently.", "Warning!");
            });
          } 
          else {
            window.toastr.warning("Please, select a customer.", "Warning!");
          }
        });
        //     if (window.store.sound_effect == 1) {
        //         window.storeApp.playSound("error.mp3");
        //     }
        //     window.toastr.warning("Please, select a customer.", "Warning!");
        //     return false;
        } 
        else {
            $scope.customerId = $(document).find("input[name=\"customer-id\"]").val();
            $scope.historyArray = $scope.itemArray;
            PayNowModal($scope); 
        }
    };


    $scope.defineCustomerName = function(name,id,contact){
        $scope.customerName = name+ " (" + contact + ")";
        $scope.customerId = id;
        $scope.addcartfornewcustomer($scope.customerId, true);
        $scope.removeCoupan(false, false);
    }

    $scope._calproductDiscount = function(discountAmount){
        var amt = '0.00';
        if(discountAmount > 0){
            var amt = discountAmount;
        }
        return amt;
    }

    // =============================================
    // start opening invoice payment form
    // =============================================

    
    // =============================================
    // start opening customer due paid form
    // =============================================

    $scope.duePaid = function() {
        if ($scope.dueAmount > 0) {
            var customer = {
                id: $scope.customerId,
                name: $scope.customerName,
                dueAmount: $scope.dueAmount,
            };
            CustomerDuePaidModal(customer);
        }
    };

    // =============================================
    // start opening customer due paid form
    // =============================================


    // =============================================
    // start opening invoice note form
    // =============================================

    $scope.addInvoiceNote = function() {
        $scope.invoiceNote = $("#invoice-note").data("note");
        AddInvoiceNoteModal($scope);
    };

    // =============================================
    // end opening invoice note form
    // =============================================


    // =============================================
    // start custom command handler for context menu
    // =============================================

    $.contextMenu.types.label = function(item, opt, root) {
        $("<span>Quantity<div>"
        + "<div class=\"input-group input-group-sm\">"
        + "<input class=\"form-control\" type=\"text\" name=\"add-quantity\" value=\"1\" onClick=\"this.select()\" onKeyUp=\"if(this.value<0 || this.value>100000){this.value=1}\">"
        +   "<span class=\"input-group-btn\">"
        +    "<button class=\"btn btn-default add\" type=\"button\">Add</button>"
        +  "</span>"
        +  "</div>")
        .appendTo(this)
        .on("click", "button", function() {
            var itemQuantity = $(this).parent().parent().find("input[name=\"add-quantity\"]").val();
            if (!itemQuantity || !$scope._isInt(itemQuantity) || itemQuantity <= 0) {

                if (window.store.sound_effect == 1) {
                    window.storeApp.playSound("error.mp3");
                }
                window.toastr.warning("Quantity must be greater than 0!", "Warning!");
                return false;
            }
            $scope.addItemToInvoice($scope.productItemId, parseInt(itemQuantity));
            // hide the menu
            root.$menu.trigger("contextmenu:hide");
        });
    };

    // =============================================
    // end custom command handler for context menu
    // =============================================

    // =============================================
    // start product item context menu
    // =============================================

    // $("#item-list").contextMenu({
    //     selector: "div.item", 
    //     callback: function(key, options) {
    //         var p_id = $(this).find(".item-info").data("id");
    //         var p_name = $(this).find(".item-info").data("name");
    //         switch(key) {
    //             case "view":
    //                 ProductViewModal({p_id:p_id,p_name:p_name});
    //             break;
    //             case "edit":
    //                 ProductEditModal({p_id:p_id,p_name:p_name});
    //             break;
    //             case "add":
    //                 $scope.addItemToInvoice(p_id, 1);
    //             break;
    //         }
    //     },
    //     items: {
    //         "add": {name: "Add 1 (one) Item", icon: "fa-plus"},
    //         "sep1": "---------",
    //         "add_specific_amount": {name: "Add Specific Quantity", icon: "fa-th", disabled: true},
    //         "quantity": {
    //             type: "label", 
    //             customName: "Quantity", callback: function() { 
    //                 $scope.productItemId = $(this).find(".item-info").data("id");
    //                 return false; 
    //             },
    //         },
    //         "view": {name: "View", icon: "fa-eye"},
    //         "sep2": "---------",
    //         "edit": {name: "Edit", icon: "fa-pencil"}
    //     }
    // });

    // =============================================
    // end product item context menu
    // =============================================

    $scope.BuyingProductModalCallback = function ($scopeData) {
        $scope.showProductList();
    };
    $scope.ProductCreateModalCallback = function ($scopeData) {
        $scope.product = $scopeData.product;
        BuyingProductModal($scope);
    };
    $scope.createNewProduct = function () {
        $scope.hideCategoryAddBtn = true;
        $scope.hideSupAddBtn = true;
        $scope.hideBoxAddBtn = true; 
        ProductCreateModal($scope);
    };

    // create new product
    $scope.createNewCustomer = function () {
        if ($scope.invoiceId) return false;
        $scope.dueAmount = 0;
        $scope.addCustomer(1);
        CustomerCreateModal($scope);
    };

    // create new category
    $scope.createNewCategory = function () {
        CategoryCreateModal($scope);
    };

    // create new supplier
    $scope.createNewSupplier = function () {
        SupplierCreateModal($scope);
    };

    // create new box
    $scope.createNewBox = function () {
        BoxCreateModal($scope);
    };

    //relogin
    $scope.relogin = function (username, password, $product = false) {
        $.ajax({
            url: POS_API_URL+"/login",
            type: "POST",
            dataType: "json",
            data: {username: username, password: password},
            success: function (response) {
              localStorage.setItem('token', response.data.token);
              localStorage.setItem('email', username);
              localStorage.setItem('password', password);
              $http.defaults.headers.common['Authorization'] = 'Bearer '+response.data.token;
              if($product){
                $scope.showProductList();
                $scope.getCardItems();
              }
            },
            error: function (response) {   
                      
        }});
    };

    $scope.changeInvoiceType = function(type,itemArray){
                   
        $('.withtax').trigger('click');
        $('#done').trigger('click');
               
    }

    // $scope.closeCustomerPopup = function(){
    //     $scope.hideCustomerDropdown = true;
    //     console.log($scope.hideCustomerDropdown);
       
    // }

    //document click
    // $(document).click(function(e) {
    //    $('.previous-due').trigger('click');
    // });


    // =============================================
    // start keyboard shortcut
    // =============================================

    $(document).keydown(function(e) {
        
        if (e.altKey && e.which == 80) { //searchbox [p]
          $("[name=\"product-name\"]").focus().select();
        } else if (e.altKey && e.which == 65) { // create new customer [a]
            $scope.createNewCustomer();
        } else if (e.which != 16 && e.altKey && e.which == 67) { // customer search box [c]
          $("[name=\"customer-name\"]").focus().select();
        } else if (e.altKey && e.which == 73) { // discount field [i]
          $("[name=\"discount-amount\"]").focus().select();
        } else if (e.altKey && e.which == 84) { // tax field [t]
            $("[name=\"tax-amount\"]").focus().select();
        } else if (e.altKey && e.which == 78) { // invoice note [n]
            $scope.addInvoiceNote();
        } else if (e.altKey && e.which == 90) { // paynow fowm [z]
            $scope.payNow();
        }
       
       
        if (e.which == 37) { // left arrow
          // var selectedItem = $("#item-list").find(".select");
          // $("#item-list .item").removeClass("select");
          // if (selectedItem.length) {
          //   var itemId = parseInt(selectedItem.attr("id"))-1;
          //   $("#"+itemId).addClass("select");
          // } else {
          //   $("#0").addClass("select");
          // }
        }
        if (e.which == 39) { // right arrow
          // var selectedItem1 = $("#item-list").find(".select");
          // $("#item-list .item").removeClass("select");
          // if (selectedItem1.length) {
          //   var itemId1 = parseInt(selectedItem1.attr("id"))+1;
          //   $("#"+itemId1).addClass("select");
          // } else {
          //   $("#0").addClass("select");
          // }
        }
        if (e.which == 13 && !$('.modal').length) { // add item when press enter key, if selected any
            var selectedItem2 = $("#item-list").find(".select");
            if (selectedItem2.length) {
                var itemId2 = selectedItem2.find(".item-info").data("id");
                $scope.addItemToInvoice(itemId2, 1);
            }
        }
    });
    $scope.getCardItems();
}]);

(function(){
     
}());