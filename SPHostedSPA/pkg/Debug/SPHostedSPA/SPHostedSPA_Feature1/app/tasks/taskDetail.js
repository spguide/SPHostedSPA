(function () {
  'use strict';

  // define controller
  var controllerId = "taskDetail";
  angular.module('app').controller(controllerId,
    ['$window', '$location', '$routeParams', 'common', 'datacontext', taskDetail]);

  // create controller
  function taskDetail($window, $location, $routeParams, common, datacontext) {
    var vm = this;

    // handle saves & deletes
    vm.goCancel = goCancel;
    vm.goSave = goSave;
    vm.goDelete = goDelete;

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

    // handle delete action
    function goDelete() {
      datacontext.deleteTask(vm.taskItem)
        .then(function () {
          common.logger.logSuccess("Deleted learning item.", null, controllerId);
        })
        .then(function () {
          goBack();
        });
    }


    // create a new learning path item
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

    // navigate backwards
    function goBack() {
      $window.history.back();
    }

    // handle revert pending item change and navigate back 
    function goCancel() {
      datacontext.revertChanges(vm.learningItem);
      goBack();
    }

    // handle save action
    function goSave() {
      return datacontext.saveChanges()
      .then(function () {
        goBack();
      });
    }

    // handle delete action
    function goDelete() {
      datacontext.deleteLearningItem(vm.learningItem)
        .then(function () {
          common.logger.logSuccess("Deleted learning item.", null, controllerId);
        })
        .then(function () {
          goBack();
        });
    }
  }

})();