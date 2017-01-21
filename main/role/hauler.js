module.exports = {
    run: function (creep) {
        if (!creep.memory.currentTarget) {
            creep.memory.currentTarget = -1;
        }
        
        if (creep.memory.mode == 'gather') {
            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.mode = 'deposit';
                creep.memory.currentTarget = -1;
                creep.say('Depositing');
            } else {
                if (creep.memory.currentTarget == -1) {
                    //creep.memory.currentTarget = creep.room.memory.energySource[Math.floor(Math.random()*creep.room.memory.energySource.length)];
//                    creep.memory.currentTarget = "586d4c4e0e72df74699d755e";
                    creep.memory.currentTarget = "58765afc5aa6d05a70f36c89";
                }
                var target = Game.getObjectById(creep.memory.currentTarget);
                if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        } else {
            if (creep.carry.energy == 0) {
                creep.memory.mode = 'gather';
                creep.memory.currentTarget = -1;
                creep.say('Gathering');
            } else {
                if (creep.memory.currentTarget == -1) {
                    //creep.memory.currentTarget = creep.room.memory.energySink[Math.floor(Math.random()*creep.room.memory.energySink.length)];
                    creep.memory.currentTarget = "586d956ff1ad0390326c623d";
                }
                var target = Game.getObjectById(creep.memory.currentTarget);
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
    }
};