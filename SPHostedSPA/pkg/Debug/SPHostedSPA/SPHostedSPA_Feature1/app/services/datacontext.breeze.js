(function () {
  'use strict';

  var serviceId = 'datacontext';
  angular.module('app').factory(serviceId, ['common', 'breeze.config', 'breeze.entities', 'spContext', datacontext]);

  function datacontext(common, breezeConfig, breezeEntities, spContext) {
    var metadataStore, taskType, manager;
    var $q = common.$q;

    // init factory
    init();

    var service = {
      getTasks: getTasks,
      getTaskItem: getTaskItem,
      saveChanges: saveChanges,
      revertChanges: revertChanges,
      createTaskItem: createTaskItem
    };

    return service;

    // init service
    function init() {
      // get reference to the breeze metadata store
      metadataStore = breezeEntities.metadataStore;

      // get references to the two types
      taskType = metadataStore.getEntityType('Tasks');

      // define instance of the entity manager
      manager = new breeze.EntityManager({
        dataService: breezeConfig.dataservice,
        metadataStore: metadataStore
      });

      common.logger.log("service loaded", null, serviceId);
    }

    // retrieve all tasks, using ngHttp service
    function getTasks() {
      return breeze.EntityQuery
      .from(taskType.defaultResourceName)
      .using(manager)
      .execute().then(function (data) {
        return data.results;
      });
    }

    // gets a specific learning item
    function getTaskItem(id) {
      // first try to get the data from the local cache, but if not present, grab from server
      return manager.fetchEntityByKey('Tasks', id, true)
        .then(function (data) {
          common.logger.log('fetched task item from ' + (data.fromCache ? 'cache' : 'server'), data);
          return data.entity;
        });
    }

    // saves all changes
    function saveChanges() {
      // save changes
      return manager.saveChanges()
        .then(function (result) {
          if (result.entities.length == 0) {
            common.logger.logWarning('Nothing saved.');
          } else {
            common.logger.logSuccess('Saved changes.');
          }
        })
        .catch(function (error) {
          $q.reject(error);
          common.logger.logError('Error saving changes', error, serviceId);
        });
    }

    // reverts all changes back to their original state
    function revertChanges() {
      return manager.rejectChanges();
    }

    function createTaskItem(initialValues) {
      return manager.createEntity(taskType, initialValues);
    }
  }
})();