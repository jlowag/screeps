function getOpenNeighbors(resPos) {
    console.log("rP:" + resPos);
    var top = Math.max(resPos.y-1, 0);
    var left = Math.max(resPos.x-1, 0);
    var bottom = Math.min(resPos.y+1, 49);
    var right = Math.min(resPos.x+1, 49);
    var neighbors = Game.rooms[resPos.roomName].lookForAtArea(LOOK_TERRAIN, top, left, bottom, right, true);
    var filteredNeighbors = _.filter(neighbors, function (pos) { return _.contains(['plain','swamp'],pos[LOOK_TERRAIN]); });
    var roomPositions = _.map(filteredNeighbors, function (pos) { return new RoomPosition(pos.x, pos.y, resPos.roomName)});
    console.log(roomPositions);
    return roomPositions;
}

module.exports = {
    findContainerPosition: function (resPos) {
        var harvestSpots = getOpenNeighbors(resPos);
        console.log(harvestSpots);
        var candidates = harvestSpots;
        _.each(harvestSpots, function (spot) {
            candidates = _.filter(getOpenNeighbors(spot), function (pos) { 
                return -1 != _.findIndex(candidates, function (p) { return _.isEqual(pos, p) } );
                
            });
        });
        return candidates[0];
    }
};