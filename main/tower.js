var minRampartHealth = 65000;
var S = require('settings');

module.exports = {
    run: function (tower) {
        var otherCreeps = tower.room.find(FIND_HOSTILE_CREEPS);
        var hostiles = _.filter(otherCreeps, function (creep) { return !_.contains(S.FRIENDLY_PLAYERS, creep.owner.username); });
        var prioritizedHostiles = _.sortBy(hostiles, function (creep) {
            var threat = - _.sum(creep.body, function(part) { return S.THREAT[part]} );
            console.log("Threat: "+ creep.id + " " + threat);
            return threat;
        });
        if (hostiles.length > 0) {
            tower.attack(hostiles[0]);
            return;
        }
        
        var ramparts = _.filter(tower.room.find(FIND_MY_STRUCTURES), function (struct) { return struct.structureType == STRUCTURE_RAMPART;});
        _.each(ramparts, function (rampart, i, l) {
            if (rampart.hits < minRampartHealth) {
                tower.repair(rampart);
                return;
            }
        });
        
        
    }
};