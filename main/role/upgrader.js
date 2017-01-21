module.exports = {
    run: function(creep) {
        var container = Game.getObjectById('58791c4a31950fb26ecc65d7');

        if (creep.memory.mode == 'upgrade') {
            if (creep.carry.energy == 0) {
                creep.memory.mode = 'gather';
                creep.say('Gathering');
            } else {
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
                //creep.withdraw(container, RESOURCE_ENERGY);
            }
        } else {
            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.mode = 'upgrade';
                creep.say('Upgrading');
            } else {
/*
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[1]);
                }
*/
/*
                var containers = _.filter(creep.room.find(FIND_STRUCTURES), function(struc) {return struc.structureType == STRUCTURE_CONTAINER});
                if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers[0]);
                }
*/
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
                if (creep.carry.energy > 0) {
                    creep.memory.mode = 'upgrade';
                }
                
            }
        }
    }
};