
var app = angular.module("fih", []);

app.controller("fihmanager", function ($scope, $http) {

    $scope.configuredDevices = [
        //{ ipAddress: '10.64.28.46', familyName: 'Fiery', modelName: 'Sinatra 2.0' }
    ];
    $scope.ipAddress = '';
    $scope.familyName = '';
    $scope.modelName = '';

    var getDevicesConfigured = function () {
        $http.get('/DevicesConfigured').then(function (response) {
            $scope.configuredDevices = response.data;
        })
    };

    getDevicesConfigured();

    $scope.addDeviceInit = function () {
        $scope.addfailed = 0;
        $scope.deviceAdded = 0;
        $scope.ipAddress = '';
        $scope.familyName = '';
        $scope.modelName = '';
    };

    /*
    * Adding device to the list
    */
    $scope.addDevice = function () {
        var temp = 0;
        $scope.addfailed = 0;
        $scope.deviceAdded = 0;

        var device = {
            ipAddress: $scope.ipAddress,
            familyName: $scope.familyName,
            modelName: $scope.modelName,
        }

        if (0 == device.ipAddress.length || 0 == device.familyName.length) {
            $scope.addfailed = 1;
            return;
        }

        $http.post('/addDevice', device).then(function(response) {
            $scope.deviceAdded = response.data.deviceAdded;
            console.debug('Device added: ' + response.data.deviceAdded);
            $scope.ipAddress = '';
            $scope.familyName = '';
            $scope.modelName = '';
            getDevicesConfigured();
        })     
    };


    // Delete device code
    $scope.deleteDevice = function (ipAddress) {

        var reqObj = { ipAddress};

        $http.post('/deleteDevice', reqObj).then(function (response) {
            
            getDevicesConfigured();
        }) 


        //var index = -1;
        //var comArr = eval($scope.configuredDevices);
        //for (var i = 0; i < comArr.length; i++) {
        //    if (comArr[i].ipAddress === ipAddress) {
        //        index = i;
        //        break;
        //    }
        //}
        //if (index === -1) {
        //    alert("Something gone wrong");
        //}
        //$scope.configuredDevices.splice(index, 1);
    };
    $scope.status = function (ipAddress, familyName, modelName) {
        // Status code goes here and to populate we can bind the info on html page
        $scope.ipAddress = ipAddress;
        $scope.familyName = familyName;
        $scope.modelName;
        var rand = Math.floor((Math.random() * 3) + 1);
        if (rand == 1)
            $scope.curStatus = 'Online';
        else if (rand == 2)
            $scope.curStatus = 'Offline';
        else if (rand == 3)
            $scope.curStatus = 'Printing';

        $scope.infoShow = 1;

    };

    $scope.deviceSettings = function (ipAddress, familyName, modelName) {
        // Device settings code goes here and to populate we can bind the info on html page
        // Installable options
        $scope.infoShow = 2;

    };

    $scope.paperCatalog = function (ipAddress, familyName, modelName) {
        // Paper Catalog code goes here and to populate we can bind the info on html page
        $scope.infoShow = 3;

    };

    $scope.rowHighilited = function (row, ipAddress, familyName, modelName) {
        $scope.selectedRow = row;
        if ($scope.infoShow == 0) {
            $scope.infoShow = 1;
            $scope.status(ipAddress, familyName, modelName);
        }
    };

});

