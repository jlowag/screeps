var roleCollector = require('role.collector');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var roleMine = require('role.mine');
var roleHauler = require('role.hauler');
var rolePlunder = require('role.plunder');
var roleDefend = require('role.defend');
var tower = require('tower');
var tools = require('tools');
var Task = require('task');
var Scheduler = require('scheduler');
var conquer = require('conquer');

module.exports.loop = function() {
    
    PathFinder.use(true);

    var goalCreeps = {collector: 4, builder: 3, upgrader: 3, repair: 2, mine: 2, hauler: 0, defend: 0, plunder:0, scout:0, claim:0}
    var curCreeps = {collector: 0, builder: 0, upgrader: 0, repair: 0, mine: 0, hauler: 0, defend: 0, plunder:0, scout:0, claim:0}
    var roleTypes = {
        collector: [CARRY, CARRY, MOVE], 
        builder: [WORK, WORK, CARRY, MOVE], 
        upgrader: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], 
        repair: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
        mine: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], 
        hauler: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
        plunder: [WORK,CARRY,CARRY,CARRY,MOVE,MOVE],
        defend: [ATTACK, MOVE],
        scout: [MOVE],
        claim: [CLAIM,MOVE]
    };
    
    var threats = _.filter(Game.rooms.W73N4.find(FIND_HOSTILE_CREEPS), function (creep) {
        return !_.contains(['Pseudostein','Schnuffel','Invader'],creep.owner);
    });
    if (threats.length > 1) {
        goalCreeps.defend = Math.min(threats.length * 2, 10);
        Game.notify("Hostiles detected: \n" + JSON.stringify(threats), 5);
    } 
    
//    var sched = new Scheduler(Game.rooms.W73N4);
//    sched.runAllCreeps();
    
    if (Game.time % 30 == 0) {
        tools.cleanup();
    } 
    if (Game.time % 1000 == 1) {
        tools.takeBackup(Game.rooms.W73N4);
    }

    
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        if (creep.memory.role == 'scout') {
            curCreeps.scout++;
            if (Game.rooms.W73N3) {
                //conquer.findSpawnLocation(Game.rooms.W73N3);
            } else {
                creep.moveTo(new RoomPosition(20,2,'W73N3'));
            }
        } else if (creep.memory.role == 'collector') {
            roleCollector.run(creep);
            //creep.say('Hey');
            curCreeps.collector++;
        } else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
            curCreeps.upgrader++;
        } else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
            curCreeps.builder++;
        } else if (creep.memory.role == 'repair') {
            roleRepair.run(creep);
            curCreeps.repair++;
        } else if (creep.memory.role == 'mine') {
            roleMine.run(creep);
            curCreeps.mine++;
        } else if (creep.memory.role == 'hauler') {
            roleHauler.run(creep);
            curCreeps.hauler++;
        } else if (creep.memory.role == 'defend') {
            roleDefend.run(creep, Game.rooms['W73N4']);
            curCreeps.defend++;
        } else if (creep.memory.role == 'plunder') {
            //rolePlunder.run(creep);
            curCreeps.plunder++;
        } else if (creep.memory.role == 'claim') {
            if (creep.room.name == 'W73N3') {
                if (creep.claimController(_.first(creep.room.find(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_CONTROLLER }
            }))));
            } else {
                creep.moveTo(new RoomPosition(14,8,'W73N3'));
            }
            curCreeps.claim++;
        }
        
        if (creep.ticksToLive < creep.body.length) {
            creep.say("Goodbye");
            curCreeps[creep.memory.role]--;
            //creep.drop(RESOURCE_ENERGY);
        } else if (creep.ticksToLive == 1499) {
            creep.say("I'm a " + creep.memory.role + "er");
        }
        

    }
    
    for (var roleName in goalCreeps) {
        if (curCreeps[roleName] < goalCreeps[roleName]) {
            if (roleName == 'mine') {
                var lastIndex = parseInt(Game.rooms.W73N4.memory.lastMineIndex);
                var curIndex = (lastIndex + 1) % 2;
                Game.spawns['SpawnAlpha'].createCreep(roleTypes[roleName], require('tools').getId(), {role: roleName, mode: 'gather', currentTarget: -1, index: curIndex});
                Game.rooms.W73N4.memory.lastMineIndex = curIndex;                        
            } else {
                Game.spawns['SpawnAlpha'].createCreep(roleTypes[roleName], require('tools').getId(), {role: roleName, mode: 'gather', currentTarget: -1});
            }
            console.log('Spawning new ' + roleName)
        }
    }
    
    for (var strucId in Game.structures) {
        structure = Game.structures[strucId];
        if (structure.structureType == STRUCTURE_TOWER) {
            tower.run(structure);
        }
    }
    
    // Transfer energy
    if (Game.time % 30 == 10) {
        var source = Game.getObjectById('5878a71850532ff6700befbc');
        var destination = Game.getObjectById('58791c4a31950fb26ecc65d7');
        source.transferEnergy(destination);
    } 
    

    var mySpawn = Game.spawns['SpawnAlpha'];
    if (mySpawn.spawning == null) {
        var creepsNearSpawn = mySpawn.pos.findInRange(FIND_MY_CREEPS, 1);
        _.each(creepsNearSpawn, function (creep) {
            //console.log(creep.ticksToLive + "/" + CREEP_LIFE_TIME);
            if (creep.ticksToLive < CREEP_LIFE_TIME * .75) {
                //creep.cancelOrder('move');
                //console.log(creep.memory.role + curCreeps[creep.memory.role] + goalCreeps[creep.memory.role])
                if (curCreeps[creep.memory.role] <= goalCreeps[creep.memory.role] && _.isEqual(_.map(creep.body, function (bodyPart) {return bodyPart.type}), roleTypes[creep.memory.role])){
                    mySpawn.renewCreep(creep);
                } else {
                    mySpawn.recycleCreep(creep);
                }    
                    
                //return;
            }
        });
    }
/*    
    if (Game.time % 30 == 15) {
        console.log(JSON.stringify(Game.cpu) + " " + Game.cpu.getUsed());
    }
*/
}