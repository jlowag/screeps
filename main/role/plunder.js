var targetId = "58729bf8f40a21661a15a586";
var targetPosition = new RoomPosition(33,36,"W73N3");
var bucketId = "5836b6d78b8b9619519ef757";

module.exports = {
    run: function (creep) {
        Game.creeps['5873e13d'].moveTo(Game.getObjectById('586a67cdc04c074e4f1f6816'));
        return;
        if (creep.memory.mode == 'deliver') {
            if (creep.carry.energy == 0) {
                creep.memory.mode = 'plunder';
                return;
            }
            var bucket = Game.getObjectById(bucketId);
            if (creep.transfer(bucket, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(bucket);
            }
        } else {
            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.mode = 'deliver';
                return;
            }
            var target = Game.getObjectById(targetId);
            if (target == null || creep.dismantle(target) == ERR_NOT_IN_RANGE) {
                if (target.energy == 0 || creep.withdraw(target, RESOURCE_ENERGY) != 0) {
                    if (creep.dismantle(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targetPosition);
                    }
                }
            }
        }
    }
};