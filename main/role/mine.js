module.exports = {
    run: function (creep) {
        var containers = _.filter(creep.room.find(FIND_STRUCTURES), function(struc) {return struc.structureType == STRUCTURE_CONTAINER});
        var index = creep.memory.index;
        if (creep.memory.mode == 'mine') {
            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.mode = 'deposit';
                creep.say('Depositing');
            } else {
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[index]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[index]);
                }
                creep.transfer(containers[index],RESOURCE_ENERGY);
            }
        } else {
            if (creep.carry.energy == 0) {
                creep.memory.mode = 'mine';
                creep.say('Mining');
            } else {
                if (creep.transfer(containers[index], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers[index]);
                }
            }
        }
        
    }
};