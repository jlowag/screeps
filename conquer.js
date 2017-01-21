module.exports = {
    findSpawnLocation: function (room) {
        var sources = room.find(FIND_SOURCES);
        if (sources.length == 2) {
//            var path = sources[0].pos.findPathTo(sources[1], {costCallback: this.drainSwamp});
            var path = sources[0].pos.findPathTo(sources[1]);
            // center is position between two sources
            var center = path[Math.floor(path.length / 2)];
            
            var controller = _.first(room.find(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_CONTROLLER }
            }));
            path = (new RoomPosition(center.x, center.y, room.name)).findPathTo(controller);
            center = path[Math.floor(path.length / 3)];
            
            var mineral = _.first(room.find(FIND_MINERALS));
            path = (new RoomPosition(center.x, center.y, room.name)).findPathTo(mineral);
            center = path[Math.floor(path.length / 4)];
            
            path = sources[0].pos.findPathTo(controller, {costCallback: this.drainSwamp});
            center = path[Math.floor(path.length / 2)];

            console.log(JSON.stringify(center));
            this.test();
        }
        
    },
    drainSwamp: function (room, matrix) {
        console.log(JSON.stringify(matrix));
        return matrix;
    },
    test: function () {
        console.log("TEST");
    }
};