var Task = require('task');
var Job = require('job');

module.exports = function (room) {
    this.room = room;
    
    // Load jobs from memory;
    this.tasks = _.mapValues(room.memory.tasks, function (task) { 
        return new Task(task.m, Game.getObjectById(task.t), task.r);
    });
    this.jobs = {}
    for (var jobId in room.memory.jobs) {
        this.jobs[jobId] = room.memory.jobs[jobId];
    }

    this.runAllCreeps = function () {
        for (var creepName in Game.creeps) {
            var creep = Game.creeps[creepName];
            if (creep.name != 'Eliana') {
                continue;
            }
            var job = null;
            if (!creep.memory.task || !creep.memory.job) {
                continue;
                console.log('Corrupt creep data.');
            }
            job = this.jobs[creep.memory.job];
            //creep.memory.task = job.getNextTask().id;

            
            // Execute Task
            var task = this.tasks[creep.memory.task];
            var result = -1;
            if (task.resource) {
                result = creep[task.method](task.target, task.resource);
            } else {
                result = creep[task.method](task.target);
            }
            if (result == ERR_NOT_IN_RANGE) {
                creep.moveTo(task.target);
            }
            
            // Check if task is done
            var completed = false;
            if (_.contains(['harvest'], task.method)) {
                completed = _.sum(creep.carry) == creep.carryCapacity;
            } else if (_.contains(['transfer'], task.method)) {
                completed = _.sum(creep.carry) == 0;
            }
            if (completed) {
                //job.assignNextTask(creep);
            }
        }
    }
    
    
};