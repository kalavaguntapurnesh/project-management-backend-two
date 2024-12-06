

const mongoose = require('mongoose');

// Lease Term Schema
const LeaseTermSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  customDate: { type: Boolean, default: false },
  fullYear: { type: Boolean, default: false },
  monthToMonth: { type: Boolean, default: false }
});

// Rent Details Schema
const RentDetailsSchema = new mongoose.Schema({
  rent: { type: Number, required: true },
  rentDueDate: { type: Date, required: true },
  fees: { type: Number, required: true },
  lateRentFee: { type: Number, required: true },
  moveInFee: { type: Number, default: 0 },
  moveOutFee: { type: Number, default: 0 },
  parkingFee: { type: Number, default: 0 },
  securityDeposit: { type: Number, required: true }
});

// Options Schema (Dynamic fields allowed)
const OptionsSchema = new mongoose.Schema({
  baseOptions: {
    petPolicy: { type: Boolean, default: false },
    noPets: { type: Boolean, default: true },
    smokingPolicy: { type: Boolean, default: false },
    requireRentersInsurance: { type: Boolean, default: true },
    requireOnlinePaymentSetup: { type: Boolean, default: true }
  },
  petPolicyDetails: {
    type: Map, // Flexible key-value pair structure
    of: mongoose.Schema.Types.Mixed // Allows various data types
  },
  proratedRent: {
    amount: { type: String, default: "0" }, // Default to "0"
    date: { type: Date, default: null } // Default to null if no date provided
  }
 
});

// Clause Schema
const ClauseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  editable: { type: Boolean, default: false }
});

// Rule Schema
const RuleSchema = new mongoose.Schema({
  text: { type: String, required: true },
  editable: { type: Boolean, default: false }
});

// Disclosures Schema (Dynamic fields allowed)
const DisclosuresSchema = new mongoose.Schema({
  bedBug: {
    issue: { type: String },
    otherDetails: { type: String }
  },
  habitability: {
    isAware: { type: Boolean, default: false },
    details: { type: String }
  },
  leadPaint: {
    isLead: { type: Boolean, default: false },
    details: { type: String }
  },
  mold: {
    isMold: { type: Boolean, default: false },
    details: { type: String }
  },
  utilityDisclosureFile: {
    name: { type: String },
    size: { type: Number },
    type: { type: String },
    lastModified: { type: Number }
  },
  dynamicFields: {
    type: Map, // Allows for flexible key-value pairs
    of: mongoose.Schema.Types.Mixed
  }
});

// Lessor Info Schema
const LessorInfoSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  companyName: { type: String },
  companyPhone: { type: String },
  emergencyPhone: { type: String },
  lessorAddress: { type: String }
});

// Main Lease Agreement Schema
const landlordLeaseSchema = new mongoose.Schema({
  PropertyId:{  
    type:mongoose.Schema.Types.ObjectId,
    ref:'Property',
    required:'true'
    },
  leaseTerm: LeaseTermSchema,
  rentDetails: RentDetailsSchema,
  options: OptionsSchema,
  clauses: [ClauseSchema],
  rules: [RuleSchema],
  disclosures: DisclosuresSchema,
  lessorInfo: LessorInfoSchema,
  termsAndAgreement: {
    content: { type: String }
  }
});

const leaseAgreementModel = mongoose.model('LeaseAgreement', landlordLeaseSchema);
module.exports = leaseAgreementModel;


