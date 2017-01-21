module.exports = {
    getId: function () {
        return "C" + Math.floor(Date.now()/1000).toString(16);
    },
    
    cleanup: function () {
//        var deletedCreeps = [];
        for (var creep in Memory.creeps) {
            if (!Game.creeps[creep]) {
//                deletedCreeps.push(creep);
                delete Memory.creeps[creep];    
            }
        }
//        console.log('Deleted creeps' + deletedCreeps);
    },
    
    getRandomEnergySource: function (room) {
        var sources = room.find(FIND_SOURCES);
        return sources.length;
        
    },
    
    listCreeps: function () {
        console.log("Listing creeps:")
        _.each(Game.creeps, function (creep, i, l) { console.log(creep.name + ": " + creep.memory.role); })
    }, 
    
    maintenanceState: function () {
        
    },
    
    createRepairQueue: function (room) {
    
    },
    
    takeBackup: function (room) {
        var structures = _.map(room.find(FIND_STRUCTURES), function (struct) {
            return {x: struct.pos.x, y: struct.pos.y, type: struct.structureType};
        });
        delete room.memory['_backup'];
        return room.memory['_backup'] = structures;
    },
    
    restoreBackup: function (room) {
        _.each(room.memory['_backup'], function (obj) {
            room.createConstructionSite(obj.x, obj.y, obj.type);
        });
    },
    
    planRoad: function (start, end) {
        var path = start.findPathTo(end);
        //console.log(JSON.stringify(path));
        for (i = 0; i < path.length; i++) {
            console.log(i);
            var pos = new RoomPosition(path[i].x, path[i].y, start.roomName);
            var res = pos.createConstructionSite(STRUCTURE_ROAD);
            console.log(pos + " " + res);
        }
    }

};