let id = 1;
module.exports = class Transform {
    constructor(previous, description, transformFunction, value) {
        this.value = value;
        this.id = id++;
        this.previous = previous;
        this.description = description;
        this.transform = transformFunction;
        this.toString = this.toString.bind(this);
    }
    toString () {
        return this.previous ? this.transform(this.previous.toString()) : this.value
    }
    getClone () {
        return new Transform(this.previous, this.description, this.transform, this.value);
    }
}