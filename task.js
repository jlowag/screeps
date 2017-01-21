module.exports = function(method, target, resource) {
    if (method == undefined || target == undefined) {
        throw new Error('Missing arguments');
    }
    this.method = method;
    this.target = target;
    this.resource = resource;
    
    if (arguments.length > 4) {
        this.extraArgs = arguments;
    }
    
    this.completed = false;
    
    this.run = function (creep) {
        if (this.filling && _.sum(creep.carry) == creep.carryCapacity) {
            return this.completed = true;
        }
        
        creep[this.method](this.target)
    }
    
};  