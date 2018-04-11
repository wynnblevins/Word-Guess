function NumGenerator () {
    this.generate = function (maxNumber) {
        return Math.floor((Math.random() * maxNumber));
    }    
}
    
module.exports = NumGenerator;