(function () {
  'use strict';

  // define controller
  var controllerId = "taskDetail";
  angular.module('app').controller(controllerId,
    ['$window', '$location', '$routeParams', 'common', 'datacontext', taskDetail]);

  // create controller
  function taskDetail($window, $location, $routeParams, common, datacontext) {
    var vm = this;

    vm.goCancel = goCancel;
    vm.goSave = goSave;

    // initalize controller
    init();

    // initalize controller
    function init() {
      // if an ID is passed in, load the item
      var taskItemId = +$routeParams.id;
      if (taskItemId && taskItemId > 0) {
        getItem(taskItemId);
      } else {
        createItem();
      }

      common.logger.log("controller loaded", null, controllerId);
      common.activateController([], controllerId);
    }

    // navigate backwards
    function goBack() {
      $window.history.back();
    }

    // handle revert pending item change and navigate back 
    function goCancel() {
      datacontext.revertChanges(vm.taskItem);
      goBack();
    }

    // handle save action
    function goSave() {
      return datacontext.saveChanges()
      .then(function () {
        goBack();
      });
    }

    // create a new task
    function createItem() {
      var newtaskItem = datacontext.createTaskItem();
      vm.taskItem = newtaskItem;
    }

    // load the item specified in the route
    function getItem(taskId) {
      datacontext.getTaskItem(taskId)
        .then(function (data) {
          vm.taskItem = data;
        });
    }
  }
})();