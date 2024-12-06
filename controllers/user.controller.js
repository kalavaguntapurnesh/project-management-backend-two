const userModel = require('../models/user.model.js');
const bcrypt = require("bcryptjs");
const tokenModel = require("../models/token.model.js");
const propertyModel = require("../models/property.model.js");
const LandlordLeaseModel = require('../models/landlordLeaseAgreement.js')
const TenantLeaseModel = require('../models/tenantLeaseAgreement.js')
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { log } = require("console");
const nodemailer = require("nodemailer");
const ApiError = require("../utils/ApiError.js");
const sendMail = require("../helpers/sendMail.js");
const landlordLeaseAgreement = require('../models/landlordLeaseAgreement.js');

exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ error: "Required fields missing" });
      // throw new ApiError(400, "Required fields missing");
    }
    const user = await userModel.findOne({ email });
    if (user) {
      return res.json({ message: "User Already Exists" });
      // throw new ApiError(409, "User Already Exists");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      fullName,
      email,
      password: hashPassword,
      role,
    });
    await newUser.save();
    const token = new tokenModel({
      userId: newUser._id,
      token: crypto.randomBytes(16).toString("hex"),
    });
    await token.save();
    const link = `https://backend-syndeo.onrender.com/api/v1/confirm/${token.token}`;
    const transporter = nodemailer.createTransport({
      host: "mail.clouddatanetworks.com",
      port: 465,
      secure: true,
      auth: {
        user: "syndrome-noreply@clouddatanetworks.com",
        pass: "CDN@Syndeo@",
      },
    });
    var mailOptions = {
      from: "noreply-rma@clouddatanetworks.com",
      to: email,
      subject: "Welcome to Rental Management Application!!! 🎉 🎉. Thank you for registering with us",
      html: `<!DOCTYPE html>
    <html>
      <head>
        <style>
        body {
          font-family: Arial, sans-serif;
          height: 100%;
          width: 100%;
        }
  
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
    
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
    
          .header h1 {
            color: #333;
            font-size: 22px;
            font-weight: 600;
            text-align: center;
          }
    
          .content {
            margin-bottom: 30px;
          }
    
          .content p {
            margin: 0 0 10px;
            line-height: 1.5;
          }
    
          .content #para p {
            margin-top: 20px;
          }
    
          .content .button {
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
            margin-bottom: 20px;
          }
    
          .content .button a {
            border-radius: 40px;
            padding-top: 16px;
            padding-bottom: 16px;
            padding-left: 100px;
            padding-right: 100px;
            background-color: #007ae1;
            text-decoration: none;
            color: white;
            font-weight: 600;
          }
    
          /* .footer {
            text-align: center;
          } */
    
          .footer p {
            color: #999;
            font-size: 14px;
            margin: 0;
            margin-top: 8px;
            margin-bottom: 8px;
          }
        </style>
      </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verify your email address to complete registration</h1>
            </div>
            <div class="content">
              <p id="para">Greetings, <span style="font-weight: bold">${fullName}!</span></p>
              <p>
                Thank you for your interest in joining Syndèo! To complete your
                registration, we need you to verify your email address.
              </p>
              <p>
                As part of our ongoing efforts to promote trust and protect your
                security, we now require you to obtain an Identity Verification which
                is done by verifying your email.
              </p>
              <div class="button">
                 <a href="${link}">Verify Email</a>
              </div>
            </div>
            <p>Thanks for helping to keep Syndèo secure!</p>
            <div class="footer">
              <p>Best regards,</p>
              <p>Team Syndèo</p>
            </div>
          </div>
        </body>
    </html>
      `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({ status: false, message: "Error in sending mail" });
      } else {
        console.log("This is for the testing purposes");
        return res.status(201).json(newUser);
      }
    });
  } catch (error) {
    // next(error);
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
    // throw new ApiError(500, "Internal Server Error");
  }
};

exports.addProperty = async (req, res) => {
  try {
    const {
      userId,
      doorNumber,
      streetName,
      landMark,
      propertyType,
      propertyState,
      propertyStatus,
      selectedCountry,
      selectedState,
      selectedCity,
      phoneNumber,
      zipCode,
    } = req.body;
    const newProperty = new propertyModel({
      userId,
      doorNumber,
      streetName,
      landMark,
      propertyType,
      propertyState,
      propertyStatus,
      selectedCountry,
      selectedState,
      selectedCity,
      phoneNumber,
      zipCode,
    });
    await newProperty.save();
    console.log("This is for the testing purposes");
    return res.status(201).json(newProperty);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error });
  }
};

exports.getProperty = async (req, res) => {
  try {
    const { userId } = req.body;
    const properties = await propertyModel.find({
      userId: userId,
    });
    return res.status(200).json({ data: properties });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Required fields missing" });
    }
    const user = await userModel.findOne({ email });
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign({ id: user._id }, process.env.KEY, {
        expiresIn: "24h",
      });
      res.cookie("token", token, { httpOnly: true, maxAge: 1800000 });
      const data = [token, user._id];
      return res.status(200).json({ message: "Login Successful", data });
    } else {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await userModel.findOneAndUpdate(
      {
        _id: req.body.userId,
      },
      req.body
    );
    return res.status(200).json({ message: "Profile Updated Successfully!" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    } else {
      return res.status(200).json({ data: user });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = userModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      {
        new: true,
        useFindAndModify: false,
      }
    );
    if (updatedUser) {
      res
        .status(200)
        .json({ message: "Profile updated successfully", updatedUser });
    } else {
      res.status(404).send();
    }
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

exports.confirmToken = async (req, res) => {
  try {
    const token = await tokenModel.findOne({ token: req.params.token });
    const user = await userModel.findOne({ _id: token.userId });
    await userModel.updateOne(
      {
        _id: token.userId,
      },
      {
        $set: { verified: true },
      }
    );
    await tokenModel.findByIdAndDelete(token._id);
    await user.save();
    res.status(200).json({ message: "Email Verified Successfully" });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "Email Not Found" });
    }
    const token = jwt.sign({ id: user._id }, process.env.KEY, {
      expiresIn: "10m",
    });

    const transporter = nodemailer.createTransport({
      host: "mail.clouddatanetworks.com",
      port: 465,
      secure: true,
      auth: {
        user: "syndrome-noreply@clouddatanetworks.com",
        pass: "CDN@Syndeo@",
      },
    });
    var mailOptions = {
      from: "syndrome-noreply@clouddatanetworks.com",
      to: email,
      subject: "Welcome to Syndèo!!! 🎉 🎉. Thank you for registering with us",
      html: `<!DOCTYPE html>
    <html>
      <head>
        <style>
        body {
          font-family: Arial, sans-serif;
          height: 100%;
          width: 100%;
        }
  
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
    
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
    
          .header h1 {
            color: #333;
            font-size: 22px;
            font-weight: 600;
            text-align: center;
          }
    
          .content {
            margin-bottom: 30px;
          }
    
          .content p {
            margin: 0 0 10px;
            line-height: 1.5;
          }
    
          .content #para p {
            margin-top: 20px;
          }
    
          .content .button {
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
            margin-bottom: 20px;
          }
    
          .content .button a {
            border-radius: 40px;
            padding-top: 16px;
            padding-bottom: 16px;
            padding-left: 100px;
            padding-right: 100px;
            background-color: #007ae1;
            text-decoration: none;
            color: white;
            font-weight: 600;
          }
    
          /* .footer {
            text-align: center;
          } */
    
          .footer p {
            color: #999;
            font-size: 14px;
            margin: 0;
            margin-top: 8px;
            margin-bottom: 8px;
          }
        </style>
      </head>
           <body>
          <div class="container">
            <div class="header">
              <h1>Reset your password</h1>
            </div>
            <div class="content">
              <p>This link will expire in 10 minutes.</p>
              <p>If it wasn't done by you, please contact us immediately.</p>
            </div>
            <div class="button">
              <a href="https://syndeo-frontendtwo.vercel.app/resetPassword/${user._id}/${token}"
                >Reset the password</a
              >
            </div>
            <div class="bottom">
              <p>Thanks for helping to keep Syndèo secure!</p>
            </div>
            <div class="footer">
              <p class="footerOne">Best regards,</p>
              <p class="footerTwo">Team Syndèo</p>
            </div>
          </div>
        </body>
    </html>
      `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({ status: false, message: "Error in sending mail" });
      } else {
        return res
          .status(200)
          .json({ status: true, message: "Check your mail once", email });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  jwt.verify(token, process.env.KEY, (err, decoded) => {
    if (err) {
      return res.json({
        status: false,
        message: "Error in resetting the password",
      });
    } else {
      bcrypt.hash(password, 10).then((hash) => {
        userModel
          .findByIdAndUpdate({ _id: id }, { password: hash })
          .then((u) => {
            return res.status(200).json({ message: "Check your mail once" });
          })
          .catch((err) => {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
          });
      });
    }
  });
};


// exports.addLandlordLeaseProperty = async(req,res)=>{
//   const {
//     RentAmount,
//     SecurityDeposit,
//     LeaseDuration,
//     StartDate,
//     EndDate,
//     LeaseTermsAndDescription,
//     Status,
//     Late_Fee_Policy,
//     Rent_Increase_policy,
//     Renewel_Option
// } = req.body;

// const propertyId = req.query.propertyId || req.body.propertyId;

// try {
    
//     if (!propertyId) {
//         return res.status(400).json({ message: "PropertyID  are required" });
//     }

//     const propertyExists = await propertyModel.findById(propertyId);
//     if (!propertyExists) {
//         return res.status(400).json({ message: "Property does not exist" });
//     }
//     const newLandlordLeaseAgreement = new LandlordLeaseModel({
//         PropertyId: propertyId,
//         RentAmount,
//         SecurityDeposit,
//         LeaseDuration,
//         StartDate,
//         EndDate,
//         LeaseTermsAndDescription,
//         Status,
//         Late_Fee_Policy,
//         Rent_Increase_policy,
//         Renewel_Option
//     });

//     await newLandlordLeaseAgreement.save();

//     res.status(201).json({ message: "Landlord Lease Agreement created successfully", LandlordLeaseAgreement: newLandlordLeaseAgreement });
// } catch (error) {
//     console.error("Error while creating Landlord Lease Agreement:", error);
//     res.status(500).json({ message: "Internal Server Error" });
// }
// }


exports.getAllActiveProperties = async (req, res) => {
  
  try {
    const activeProperties = await propertyModel.find({
      "propertyStatus.value": "No", 
      "propertyState.value": "Vacant", 
    }).populate({
      path: 'landlordLeaseAgreement', 
      match: { LeaseAcceptanceStatus: null }, 
    });


    if(activeProperties.length > 0){
      return res.status(200).json({ data: activeProperties });
    }
    else{
      return res.status(200).json({ message: 'At the moment No properties available' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};




// exports.getLandlordLeaseDetails = async (req, res) => {
//   const propertyId = req.query.propertyId || req.body.propertyId;
//   if (!propertyId) {
//     return res.status(400).json({ message: "Property ID is required!" });
//   }

//   try {
 
//     const leaseDetails = await LandlordLeaseModel.findOne({ PropertyId: propertyId }).populate('PropertyId');

//     if (leaseDetails) {
//       return res.status(200).json({ data: leaseDetails });
//     } else {
//       return res.status(404).json({ message: "No lease agreement found for this property" });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Something went wrong" });
//   }
// };



// exports.addTenantLeaseAgreement = async(req,res)=>{
//   const { AcceptanceStatus, leaseTerms, Signature } = req.body;

//   const propertyId = req.query.propertyId || req.body.propertyId;
//   const tenantId = req.query.tenantId || req.body.tenantId;
//   const landlordLeaseAgreementId = req.query.landlordLeaseAgreementId || req.body.landlordLeaseAgreementId;

//   try {

//       if (!propertyId || !landlordLeaseAgreementId || !tenantId) {
//           return res.status(400).json({ message: "PropertyID,tenantId and landlordLeaseAgreementId are required" });
//       }


//       const propertyExists = await propertyModel.findById(propertyId);
//       if (!propertyExists) {
//           return res.status(400).json({ message: "Property does not exist" });
//       }

 
//       const newTenantLeaseAgreement = new TenantLeaseModel({
//           AcceptanceStatus,
//           leaseTerms,
//           Signature,
//           propertyId,
//           landlordLeaseAgreementId,
//           tenantId
//       });

//       const saveTenantLeaseAgreement = await newTenantLeaseAgreement.save();

    
//       const updatedLandlordLeaseAgreement = await LandlordLeaseModel.findByIdAndUpdate(
//           landlordLeaseAgreementId,
//           { LeaseAcceptanceStatus: saveTenantLeaseAgreement.AcceptanceStatus },
//           { new: true }
//       );

//       if (!updatedLandlordLeaseAgreement) {
//           return res.status(400).json({ message: "Landlord Lease ID does not exist" });
//       }

     
//       res.status(201).json({
//           message: "Tenant Lease Agreement created successfully and Landlord acceptance status updated",
//           UpdatedTenantLeaseModel: updatedLandlordLeaseAgreement,
//       });
//   } catch (error) {
//       console.error("Error while creating Tenant Lease Agreement:", error);
//       res.status(500).json({ message: "Internal Server Error" });
//   }
// }

exports.getLandlordDetailsInTenantDashboard = async (req, res) => {
  const propertyId = req.query.propertyId || req.body.propertyId;

  try {
    const landlordDetails = await propertyModel
      .findById(propertyId)
      .populate('userId'); 

    if (!landlordDetails) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({ landlordDetails });
  } catch (error) {
    console.error("Error fetching landlord details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// exports.updateLandlordDetailsInTenantDashboard = async (req, res) => {
//   const { propertyId, landlordId } = req.body;

//   // Validate required fields
//   if (!propertyId || !landlordId) {
//     return res.status(400).json({ message: "propertyId and landlordId are required!" });
//   }

//   try {
//     // Find and update the property based on propertyId and landlordId, then populate user details
//     const property = await propertyModel.findOne({
//       _id: propertyId,
//       userId: landlordId
//     }
//     ).populate('userId'); // Populate userId to get landlord details from userModel

//     // Check if property with specified landlord is found
//     if (!property) {
//       return res.status(404).json({ message: "Landlord details not found" });
//     }

//     // Respond with populated landlord details
//     res.status(200).json({
//       message: "Landlord details retrieved successfully",
//       landlordDetails: property.userId // userId now contains the populated user details
//     });
//   } catch (error) {
//     console.error("Error updating landlord details:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };



exports.updateTenantDetailsInLandlordDashboard = async (req, res) => {
  const { propertyId, tenantId } = req.body;
  if(!propertyId || !tenantId){
    res.status(404).json({message: "propertyId and tenantId required!"})
  }

  try {
    const tenantLease = await TenantLeaseModel.findOneAndUpdate(
      { propertyId, tenantId },
      { AcceptanceStatus: "Accept" },
      { new: true }
    ).populate('tenantId');

    if (!tenantLease) {
      return res.status(404).json({ message: "Lease agreement not found" });
    }

    res.status(200).json({ message: "Tenant details updated successfully", tenantLease });
  } catch (error) {
    console.error("Error updating tenant details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.getLeaseProperty = async (req, res) => {
  try {

    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        message: "Property ID is required",
      });
    }

    const leaseProperty = await propertyModel.findById(propertyId);


    if (!leaseProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.status(200).json({
      success: true,
      data: leaseProperty,
    });
  } catch (error) {
    console.error("Error fetching property:", error);

    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the property",
      error: error.message,
    });
  }
};

// adding lease form data

exports.addingLeaseFormData = async (req, res) => {

  const propertyId = req.query.propertyId || req.body.propertyId;
  if (!propertyId) {
      return res.status(400).json({ message: "PropertyID is required" });
  }

  const propertyExists = await propertyModel.findById(propertyId);
  if (!propertyExists) {
      return res.status(400).json({ message: "Property does not exist" });
  }

  try {
      const {
          leaseTerm,
          rentDetails,
          options,
          clauses,
          rules,
          disclosures,
          lessorInfo,
          termsAndAgreement,
      } = req.body;

      const leaseFormData = {
          PropertyId: propertyId,
          leaseTerm: {
              startDate: new Date(leaseTerm.startDate),
              endDate: leaseTerm.monthToMonth ? null : new Date(leaseTerm.endDate),
              customDate: leaseTerm.customDate || false,
              fullYear: leaseTerm.fullYear || false,
              monthToMonth: leaseTerm.monthToMonth || false,
          },
          rentDetails: {
              rent: Number(rentDetails.rent),
              rentDueDate: rentDetails.rentDueDate,
              fees: Number(rentDetails.fees),
              lateRentFee: Number(rentDetails.lateRentFee),
              moveInFee: Number(rentDetails.moveInFee),
              moveOutFee: Number(rentDetails.moveOutFee),
              parkingFee: Number(rentDetails.parkingFee),
              securityDeposit: Number(rentDetails.securityDeposit),
          },
          options: {
              baseOptions: {
                  petPolicy: options.petPolicy || false,
                  noPets: options.noPets || false,
                  smokingPolicy: options.smokingPolicy || false,
                  requireRentersInsurance: options.requireRentersInsurance || false,
                  requireOnlinePaymentSetup: options.requireOnlinePaymentSetup || false,
              },
              petPolicyDetails: options.petPolicyDetails || {},
              proratedRent: {
                amount: options.proratedRent?.amount || "0", // Default to "0"
                date: options.proratedRent?.date ? new Date(options.proratedRent.date) : null // Parse date if available, default to null
              }
          },
          clauses: clauses.map((clause) => ({
              name: clause.name,
              text: clause.text,
              editable: clause.editable || false,
          })),
          rules: rules.map((rule) => ({
              text: rule.text,
              editable: rule.editable || false,
          })),
          disclosures: {
              bedBug: disclosures.bedBug || {},
              habitability: disclosures.habitability || {},
              leadPaint: disclosures.leadPaint || {},
              mold: disclosures.mold || {},
              utilityDisclosureFile: disclosures.utilityDisclosureFile || null,
          },
          lessorInfo: {
              fullName: lessorInfo.fullName,
              email: lessorInfo.email,
              phoneNumber: lessorInfo.phoneNumber,
              companyName: lessorInfo.companyName,
              companyPhone: lessorInfo.companyPhone,
              emergencyPhone: lessorInfo.emergencyPhone,
              lessorAddress: lessorInfo.lessorAddress,
          },
          termsAndAgreement: {
              content: termsAndAgreement.content,
          },
      };

      const newLease = await landlordLeaseAgreement.create(leaseFormData);

      res.status(200).json({
          success: true,
          message: "Lease form data processed successfully",
          leaseId: newLease._id,
          data: newLease,
      });
  } catch (error) {
    console.log(error);
      res.status(500).json({
          success: false,
          message: "Error processing lease form data",
          error: error.message,
      });
  }
};
