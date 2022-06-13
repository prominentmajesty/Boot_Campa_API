const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title : {
        type : String,
        trim : true,
        required : [true, 'Please add a course title']
    },

    description : {
        type : String,
        required : [true, 'Please add a description']
    },

    weeks : {
        type : String,
        required : [true, 'Please add number of weeks']
    },

    tuition : {
        type : String,
        required : [true, 'Please add tuition cost']
    },

    minimumSkill : {
        type : String,
        required : [true, 'Please add minimum skill'],
        enum : ['beginner', 'intermediate', 'advance']
    },

    scholershipAvailable : {
        type : Boolean,
        default : false
    },

    createdAt : {
        type : Date,
        default : Date.now
    },

    bootcamp : {
        type : mongoose.Schema.ObjectId,
        ref : 'Bootcamp'
    }
});

// Static method to get average course tuition
CourseSchema.statics.getAverageCost = async function(bootcampId){
    const obj = await this.aggregate([
        { 
            $match : {bootcamp : bootcampId}
        },
        {
            $group : {
                _id : 'bootcamp',
                averageCost : {$avg : '$tuition'}
            }
            
        }
    ]);

    try{
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost : Math.ceil(obj[0].averageCost / 10) * 10
        });
    }catch(err){
        console.log(err);
    }
}

// Call AverageCost After save
CourseSchema.post('save', function() {
    this.constructor.getAverageCost(this.bootcamp);
});

// Call AverageCost Before save
CourseSchema.pre('save', function() {
    this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);