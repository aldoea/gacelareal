var gacelaApp = angular.module('gacelaApp', []);
function mainController($scope, $http) {
    
    $scope.loading = false;
    $scope.response = null;
    $scope.assignaturesResponse = null;
    $scope.emailResponse = null;
    $scope.emailIsValid = false;
    $scope.showTable = false;
    // This property will be bound to checkbox in table header
    $scope.allRowsChecked = true;
    $scope.almostOneChecked = false;

    $scope.validateEmail = function(email){
        
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var valid = re.test(String(email).toLowerCase());
        $scope.emailIsValid = valid;
        return valid;

    }

     // This executes when checkbox in table header is checked
    $scope.selectAllRows = function () {
        // Loop through all the entities and set their isChecked property
        for (var i = 0; i < $scope.assignaturesResponse.assignatures.length; i++) {
            $scope.assignaturesResponse.assignatures[i].isChecked = $scope.allRowsChecked;
        }
        $scope.almostOneChecked = $scope.allRowsChecked;
    };

    // This executes when entity in table is checked
    $scope.selectRow = function (isChecked) {
        $scope.almostOneChecked = isChecked;
        $scope.allRowsChecked = true;
        for (var transaction of $scope.assignaturesResponse.assignatures) {
            if (transaction.isChecked) {
                $scope.almostOneChecked = true;
            }else{
                $scope.allRowsChecked = false;
            }
        }
    };

    $scope.requestAssignatures = function() {
        $scope.loading = true;

        $http.get('/api/assignatures',{ params : $scope.formData })
        .success(function(response) {
            if(!response.status) alert(response.message);
            $scope.response = response;
            $scope.assignaturesResponse = response;
            $scope.showTable = $scope.assignaturesResponse.status
            $scope.loading = false;
            if($scope.assignaturesResponse.assignatures) $scope.selectAllRows();
        })
        .error(function(data) {

            $scope.response = {
                'message' : 'Internal Server Error'
            };

        });
    };

    $scope.requestEmail = function() {

        $scope.loading = true;
        $scope.formData.assignaturesIds = [];
        for(var transaction of $scope.assignaturesResponse.assignatures) {
            if(transaction.isChecked) $scope.formData.assignaturesIds.push(transaction._id);
        }
        $scope.formData.assignaturesIds = JSON.stringify($scope.formData.assignaturesIds);
        $http.get('/api/email',{ params : $scope.formData })
        .success(function(response) {
            if(!response.status) alert(response.message);
            $scope.response = response;
            $scope.emailResponse = response;

            $scope.loading = false;
            
            $scope.emailIsValid = false;
            $scope.rfcIsValid = false;
            if($scope.emailResponse.status) {
                $scope.formData.rfc = '';
                $scope.formData.email = '';
                $scope.formData.assignaturesIds = [];
                $scope.showTable = false;
                $scope.assignaturesResponse = null;
            };
        })
        .error(function(data) {

            $scope.response = {
                'message' : 'Internal Server Error'
            };

        });

    };

}//End of mainController