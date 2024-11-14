const mongoose = require('mongoose');

const TenantLeaseSchema = new mongoose.Schema({
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true 
    },
    landlordLeaseAgreementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LandlordLeaseAgreement',
        required: true 
    },
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    leaseTerms: {
        type: String,
        required: true
    },
    AcceptanceStatus: {
        type: String,
        enum: ['Accept', 'Disagree'],
        required: true 
    },
    Signature: {
        type: String,
        required: true
    }
});

const TenantLeaseSchemaModel = mongoose.model('TenantLeaseAgreement', TenantLeaseSchema);

module.exports = TenantLeaseSchemaModel;
