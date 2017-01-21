var minWallHealth = 70000;
var maxWallHealth = 75000;
var minRampartHealth = 70000;
var maxRampartHealth = 75000;
var minRoadHealth = .8;
var maxRoadHealth = .95;
var minContainerHealth = .8;
var maxContainerHealth = .95;

module.exports = {
    run: function(creep) {
        if (!creep.memory.currentTargetId) {
            creep.memory.currentTargetId = -1;
        } else {
//            console.log(Game.getObjectById(creep.memory.currentTargetId).structure_type);
        }
        
//        console.log("role = repair, mode = " + creep.memory.mode);
        if (creep.memory.mode == 'repair') {
            if (creep.carry.energy == 0) {
                creep.memory.mode = 'gather';
                creep.say('Gathering');
            } else {
                if (creep.memory.currentTargetId == -1) {
//                    console.log(">1> ");
                    var allStructures = _.shuffle(creep.room.find(FIND_STRUCTURES));
                    var found = false;
                    for (var structure in allStructures) {
                        var type = allStructures[structure].structureType;
                        var hits = allStructures[structure].hits;
                        var hitsMax = allStructures[structure].hitsMax;
                        if (type == STRUCTURE_RAMPART && hits < minRampartHealth) {
                            creep.memory.currentTargetId = allStructures[structure].id;
                            found = true;
                            break;
                        } else if (type == STRUCTURE_WALL && hits < minWallHealth) {
                            creep.memory.currentTargetId = allStructures[structure].id;
                            found = true;
                            break;
                        } else if (type == STRUCTURE_ROAD && ((hits / hitsMax) < minRoadHealth)) {
                            creep.memory.currentTargetId = allStructures[structure].id;
                            found = true;
                            break;
                        } else if (type == STRUCTURE_CONTAINER && ((hits / hitsMax) < minContainerHealth)) {
                            creep.memory.currentTargetId = allStructures[structure].id;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        if (creep.carry.energy < creep.carryCapacity) {
                            creep.memory.mode = 'gather';
                            creep.say('Gathering');
                        } else {
                            creep.moveTo(Game.flags['RepairPoint']);
                        }
                    }
                }
                
                if (creep.memory.currentTargetId == -1) {
                    return;
                }
                
                var currentTarget = Game.getObjectById(creep.memory.currentTargetId);
                if (currentTarget == null) {
                    creep.memory.currentTargetId = -1;
                    return;
                }
//                console.log(">>> " + currentTarget);
                
                if (creep.repair(currentTarget) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(currentTarget);
                }
                if (currentTarget.structureType == STRUCTURE_WALL && currentTarget.hits >= maxWallHealth || 
                        currentTarget.structureType == STRUCTURE_RAMPART && currentTarget.hits >= maxRampartHealth ||
                        currentTarget.structureType == STRUCTURE_ROAD && ((currentTarget.hits / currentTarget.hitsMax) >= maxRoadHealth) ||
                        currentTarget.structureType == STRUCTURE_CONTAINER
                        && ((currentTarget.hits / currentTarget.hitsMax) >= maxContainerHealth)) {
                    creep.memory.currentTargetId = -1;
                }
            }
        } else {
            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.mode = 'repair';
                creep.say('Repairing');
            } else {
/*
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
*/
                //var containers = _.filter(creep.room.find(FIND_STRUCTURES), function(struc) {return struc.structureType == STRUCTURE_CONTAINER});
                var energySource = Game.getObjectById('58765afc5aa6d05a70f36c89');
                if (creep.withdraw(energySource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energySource);
                }

            }
        }
    }

};