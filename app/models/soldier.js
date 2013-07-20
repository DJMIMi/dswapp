var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var soldierSchema = new Schema({
    name: { type: String, unique: true},
    foodfight: Number,
    bars: Number,
    rockets: Number,
    status: Boolean,
});

module.exports = mongoose.model('Soldier', soldierSchema);

