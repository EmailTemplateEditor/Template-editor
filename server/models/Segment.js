const mongoose = require('mongoose');

const SegmentSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    content: {
        type: Object,
        required: true
    },
});

module.exports = mongoose.model('Segment', SegmentSchema);
