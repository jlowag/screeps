module.exports = {
    run: function(creep) {
        if (creep.memory.mode == 'build') {
            if (creep.carry.energy == 0) {
                creep.memory.mode = 'gather';
                creep.say('Gathering');
            } else {
                var sites = creep.room.find(FIND_CONSTRUCTION_SITES);
                if (sites.length > 0) {
                    if (creep.build(sites[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sites[0]);
                    }
                } else {
                    if (creep.carry.energy < creep.carryCapacity) {
                        creep.memory.mode = 'gather';
                        creep.say('Gathering');
                    } else {
                        creep.moveTo(Game.flags['RepairPoint']);
                    }
                }
            }
        } else {
            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.mode = 'build';
                creep.say('Building');
            } else {
/*
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
*/
                var containers = _.filter(creep.room.find(FIND_STRUCTURES), function(struc) {return struc.structureType == STRUCTURE_STORAGE});
                if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers[0]);
                }

            }
        }
    }

};