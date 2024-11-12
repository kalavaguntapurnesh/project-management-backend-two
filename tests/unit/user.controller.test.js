const userController = require("../../controllers/user.controller.js");
const userModel = require("../../models/user.model.js");
const httpMocks = require("node-mocks-http");
const newUser = require("../mock-data/new-user.json");
const allUsers = require("../mock-data/all-users.json");
const request = require("supertest");
const express = require("express");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const app = require("../../app.js");

jest.mock("../../models/user.model.js", () => ({
  save: jest.fn(),
}));
jest.mock("../../models/user.model.js");
jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

process.env.KEY = "jwttokenkey";

app.use(express.json());

app.post("/api/v1/registerUser", userController.registerUser);
app.post("/api/v1/login", userController.loginUser);

describe("User Registration", () => {
  // it("should register a user with valid inputs", async () => {
  //   const mockUserData = {
  //     firstName: "Purnesh",
  //     lastName: "Kalavagunta",
  //     email: "purnesh@gmail.com",
  //     password: "Purnesh@1226",
  //     middleName: "Krishna",
  //   };
  //   userModel.save.mockResolvedValue(mockUserData);
  //   const response = await request(app)
  //     .post("/api/v1/registerUser")
  //     .send(mockUserData)
  //     .expect(201);
  //   expect(response.body).toEqual(mockUserData);
  // });

  it("should return 500 if registration fails", async () => {
    const validUserData = {
      firstName: "Purnesh",
      lastName: "Kalavagunta",
      email: "purnesh@gmail.com",
      password: "Purnesh@1226",
      middleName: "Krishna",
    };

    userModel.save.mockResolvedValue(new Error("Database error"));

    const response = await request(app)
      .post("/api/v1/registerUser")
      .send(validUserData)
      .expect(500);
    expect(response.body.error).toBe("Internal Server Error");
  });

  it("should return 400 if required fields are missing", async () => {
    const incompletedData = {
      firstName: "Purnesh",
      email: "purnesh@gmail.com",
      password: "Purnesh@1226",
      middleName: "Krishna",
    };
    const response = await request(app)
      .post("/api/v1/registerUser")
      .send(incompletedData)
      .expect(400);
    expect(response.body.error).toBe("Required fields missing");
  });
});

describe("User Login", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: "kalavaguntapurnesh@gmail.com",
        password: "Purnesh@1226",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 401 if password is invalid", async () => {
    const mockUser = {
      _id: "66ed19f0e4a91c95328d9463",
      email: "kalavaguntapurnesh@gmail.com",
      password: "Purnesh@1226",
    };
    userModel.findOne = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockUser));

    bcryptjs.compare = jest
      .fn()
      .mockImplementation(() => Promise.resolve(false));

    await userController.loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
  });

  it("should return 401 if user does not exist", async () => {
    userModel.findOne = jest
      .fn()
      .mockImplementation(() => Promise.resolve(null));
    await userController.loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid Credentials" });
  });

  // it("should return 200 and token if login is successful", async () => {
  //   const mockUser = {
  //     _id: "66ed19f0e4a91c95328d9463",
  //     email: "kalavaguntapurnesh@gmail.com",
  //     password: "Purnesh@1226",
  //   };

  //   userModel.findOne = jest
  //     .fn()
  //     .mockImplementation(() => Promise.resolve(mockUser));
  //   bcryptjs.compare = jest
  //     .fn()
  //     .mockImplementation(() => Promise.resolve(true));

  //   await userController.loginUser(req, res);

  //   expect(res.status).toHaveBeenCalledWith(200);
  //   expect(res.json).toHaveBeenCalledWith({ token: "token" });
  // });
});

//   let token;
//   let mockUser;

//   beforeEach(() => {
//     mockUser = {
//       email: "kalavagunta@gmail.com",
//       firstName: "Moisturex",
//       lastName: "Hydra",
//       password: "hydra@1226",
//       save: jest.fn().mockResolvedValue(true),
//     };

//     token = jsonwebtoken.sign({ email: mockUser.email }, process.env.KEY);

//     userModel.find

//   });
// });

describe("Updating user profile", () => {
  let req, res;
  beforeEach(() => {
    req = {
      body: {
        _id: "66ed19f0e4a91c95328d9463",
        firstName: "hello",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should update user profile successfully and return 200", async () => {
    userModel.findOneAndUpdate = jest.fn().mockImplementation(() => ({
      _id: "66ed19f0e4a91c95328d9463",
      firstName: "hello",
    }));
    await userController.updateProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Profile Updated Successfully!",
    });

    // expect(userModel.findOneAndUpdate).toHaveBeenCalledWith(
    //   {
    //     _id: "66ed19f0e4a91c95328d9463",
    //   },
    //   req.body
    // );
  });

  it("should return 500 status if there is an error in updating the profile", async () => {
    userModel.findOneAndUpdate = jest.fn().mockImplementation(() => {
      throw new Error("Database Error");
    });
    await userController.updateProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });
});
