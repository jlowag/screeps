var refillTypes = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER];

module.exports = {
    run: function(creep) {

    var sources = creep.room.find(FIND_SOURCES);
    if (creep.memory.mode == 'gather') {
        if (creep.carryCapacity == creep.carry.energy) {
            creep.memory.mode = 'deliver';
            creep.memory.currentTarget = -1;
            return;
        }
        var target = null;
        if (creep.memory.currentTarget == -1) {
            //target = _.sample(creep.room.find(FIND_DROPPED_ENERGY));
            //if (target == undefined || target.length == 0) {
            target = _.sample(_.filter(creep.room.find(FIND_STRUCTURES), function(struc) {return struc.structureType == STRUCTURE_CONTAINER}));
            //}
            creep.memory.currentTarget = target.id;
        } else {
            target = Game.getObjectById(creep.memory.currentTarget);
        }

        result = creep.withdraw(target, RESOURCE_ENERGY, creep.carryCapacity - _.sum(creep.carry));

        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        } else if (result == ERR_NOT_ENOUGH_RESOURCES) {
            //creep.say('¯\\_(ツ)_/¯');
            creep.withdraw(target, RESOURCE_ENERGY);
            creep.memory.currentTarget = -1;
        }

    } else {
        if (creep.carry.energy == 0) {
            creep.memory.mode = "gather";
            creep.memory.currentTarget = -1;
            return;
        }
        if (creep.memory.currentTarget == -1) {
            var targets = creep.room.find(FIND_MY_STRUCTURES);
            targets = _.filter(targets, function (structure) {
//                if (_.random(0,5) == 0) {
//                    refillTypes.push(STRUCTURE_STORAGE);
//                }
                var matchesType = structure.id == '5878a71850532ff6700befbc' || _.contains(refillTypes, structure.structureType);
                var isNotFull = "store" in structure ? structure.store['energy'] < structure.storeCapacity : structure.energy < structure.energyCapacity;
                return matchesType && isNotFull; 
            });
            
            if (targets.length == 0) {
                targets = _.filter(creep.room.find(FIND_MY_STRUCTURES), function (struct) {
                    return struct.structureType == STRUCTURE_STORAGE;
                });
            }

            if (targets.length == 0) {
                creep.moveTo(Game.flags['RepairPoint']);
                return;
            }
            var randomTarget = _.sample(targets);
            creep.memory.currentTarget = randomTarget.id;
        }
        
        var target = Game.getObjectById(creep.memory.currentTarget);
        var result = creep.transfer(target, RESOURCE_ENERGY);
        if (_.contains([OK,ERR_FULL], result)) {
            creep.memory.currentTarget = -1;  
        } else if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        } 
        
    }
        
    }

};