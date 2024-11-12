const mongoose = require('mongoose');

const landlordLeaseSchema = mongoose.Schema({
    PropertyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Property',
        required:'true'
    },
    RentAmount:{
        type:Number,
        required:true
    },
    SecurityDeposit:{
        type:Number,
        required:true
    },
    LeaseDuration:{
        type:String,
        required:true
    },
    StartDate:{
        type:Date,
        required:true
    },
    EndDate:{
        type:Date,
        required:true
    },
    LeaseTermsAndDescription:{
        type:String,
        required:true
    },
    LeaseAcceptanceStatus: {
        type: String,
        enum: ['Accept', 'Disagree'],
        default: null
    },
    Status:{
    type: String,
    enum:['Active', 'Expired', 'Terminated'],
    required:true
    },
    Late_Fee_Policy:{
        type: String,
        required:true
    },
    Late_Fee_Policy:{
        type: String,
        required:true
    },
    Rent_Increase_policy:{
        type: String,
        required:true
    },
    Renewel_Option:{
        type:String,
        required:true
    }
})

const landlordLeaseModel = mongoose.model('LandlordLeaseAgreement', landlordLeaseSchema);

module.exports = landlordLeaseModel;