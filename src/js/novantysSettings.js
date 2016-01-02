// **************** Settings Management ********************/

angular.module('novantys.Settings',[])
.service('$novantysSettings', function($q, $cordovaFile) {
    var settings = null;
    var settingsFile = 'settings.cfg';

    this.load = function(fName) {
        var dfd = $q.defer();
        if (settingsFile == null) {
            settingsFile = 'settings.cfg';
        }
        if (settings == null) {
            document.addEventListener("deviceready", function() {
                $cordovaFile.checkFile(cordova.file.dataDirectory, settingsFile)
                    .then(function (success) {
                        $cordovaFile.readAsBinaryString(cordova.file.dataDirectory, settingsFile)
                            .then(function (success) {
                                settings=JSON.parse(success);
                                dfd.resolve(settings);
                            }, function (error) {
                                // settings = [];
                                console.error(error);
                                dfd.resolve(settings);
                            });
                    }, function (error) {
                        settings = {};
                        console.error(error);
                        dfd.resolve(settings);
                    });
            });
        } else {
            dfd.resolve(settings);
        }
        return dfd.promise;
    }

    this.get = function(key) {
        if (settings==null) return null;
        return settings[key];
    }

    this.set = function(key, value) {
        settings[key] = angular.copy(value);
    }

    this.setAll = function(source) {
        settings = angular.copy(source);
    }

    this.save =function() {
      document.addEventListener("deviceready", function() {
          userdata = JSON.stringify(settings);
          $cordovaFile.writeFile(cordova.file.dataDirectory, settingsFile, userdata, true)
              .then(function (success) {
                  console.info("Settings have been saved");
              }, function (error) {
                  console.info("Settings have not been saved");
              });
      });
    }
});
// /******************* End of settings management *****************
