(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('app').controller(controllerId, ['$scope', '$location', '$route', 'common', 'datacontext', dashboard]);

    function dashboard($scope,$location, $route, common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;

        vm.title = 'Dashboard';
        vm.tasks = [];

        activate();

        function activate() {
          var promises = [getTasks()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Dashboard View'); });
        }

        function getTasks() {
          var promise;
          promise = datacontext.getTasks();

          return promise.then(function (data) {
            if (data) {
              return vm.tasks = data;
            }
            else {
              throw new Error('error obtaining data');
            }
          }).catch(function (error) {
            common.logger.logError('error obtaining tasks', error, controllerId);
          });
        }

        // navigate to the specified item
        $scope.gotoItem = function(t) {
          if (t && t.Id) {
            $location.path('/Tasks/' + t.Id);
          }
        }
        $scope.newTask = function() {
          $location.path('/Tasks/new');
        }
        $scope.goDelete = function (task) {
          datacontext.deleteTask(task)
            .then(function () {
              common.logger.logSuccess("Deleted task.", null, controllerId);
              $location.path('/');
              $route.reload();
            });
        }
    }
})();