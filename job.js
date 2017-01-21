module.exports = function (id, tasks, resource) {
    this.id = id;
    this.tasks = tasks;
    this.resource = resource;
    
    this.assign = function (creep) {
        
    };
    
    this.assignNextTask = function (creep) {
        var lastTask = creep.memory.task;
        var lastTaskSet = -1;
        for (var i = 0; i < this.tasks.length; i++) {
            var taskSet = this.tasks[i];
            if (_.contains(taskSet, lastTask)) {
                lastTaskSet = i;
                break;
            }
        }
        var nextTaskSet = lastTaskSet == this.tasks.length - 1 ? 0 : lastTaskSet + 1;
        var nextTask = _.sample(this.tasks[nextTaskSet]);
        creep.memory.task = nextTask;
    };
};