var S = require('settings');

module.exports = {
    run: function (creep, room) {
        if (creep.room.name == room.name) {
            var hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
            var hostileCreepsWoAllies = _.filter(hostileCreeps, function (creep) { return !_.contains(S.FRIENDLY_PLAYERS, creep.owner.username); });
            if (hostileCreepsWoAllies.length > 0) {
                var result = creep.attack(hostileCreepsWoAllies[0]);
                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostileCreepsWoAllies[0]);
                }
            } else {
                if (Game.spawns.SpawnAlpha.recycleCreep(creep) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.spawns.SpawnAlpha);
                }
            }
            
        }
    }
    
};