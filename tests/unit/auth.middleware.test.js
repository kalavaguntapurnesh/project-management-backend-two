// auth.middleware.test.js
const authMiddleware = require("../../middlewares/auth.middleware");
const JWT = require("jsonwebtoken");

describe("Auth Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: { authorization: "Bearer validToken" }, body: {} };
    res = {
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should call next if token is valid", async () => {
    // Mock JWT.verify to simulate a successful token verification
    JWT.verify = jest.fn((token, key, callback) => {
      callback(null, { id: "userId123" }); // Mock decode object
    });

    await authMiddleware(req, res, next);

    expect(JWT.verify).toHaveBeenCalledWith(
      "validToken",
      process.env.KEY,
      expect.any(Function)
    );
    expect(req.body.userId).toBe("userId123");
    expect(next).toHaveBeenCalled();
    console.log("This is in the middleware one");

    expect(res.json).not.toHaveBeenCalled();
  });

  it("should return 'Auth Failed' if token verification fails", async () => {
    // Mock JWT.verify to simulate token verification failure
    JWT.verify = jest.fn((token, key, callback) => {
      callback(new Error("Invalid token"), null);
    });

    await authMiddleware(req, res, next);

    expect(JWT.verify).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: "Auth Failed" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 'Authentication Failed in catch block' if there is an error in the try block", async () => {
    req.headers.authorization = null; // Simulate missing token

    await authMiddleware(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      message: "Authentication Failed in catch block",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
