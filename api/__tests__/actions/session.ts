import { specHelper } from "actionhero";
import { User } from "./../../src/models/User";
import { Process } from "actionhero";

const actionhero = new Process();

describe("session", () => {
  let peach: User;

  beforeAll(async () => {
    await actionhero.start();
    await User.destroy({ truncate: true });
  });

  afterAll(async () => {
    await actionhero.stop();
  });

  beforeAll(async () => {
    peach = await User.create({
      email: "peach@example.com",
      userName: "Peach"
    });

    await peach.updatePassword("P@ssw0rd!");
  });

  describe("session:create", () => {
    test("can log in", async () => {
      const { success, user, error } = await specHelper.runAction(
        "session:create",
        {
          email: "peach@example.com",
          password: "P@ssw0rd!"
        }
      );

      expect(error).toBeUndefined();
      expect(success).toEqual(true);
      expect(user.id).toBeTruthy();
    });

    test("cannot log in with unknown user", async () => {
      const { success, user, error } = await specHelper.runAction(
        "session:create",
        {
          email: "fff@example.com",
          password: "x"
        }
      );

      expect(error).toMatch(/user not found/);
      expect(success).toEqual(false);
      expect(user).toBeUndefined();
    });

    test("cannot log in with bad password", async () => {
      const { success, user, error } = await specHelper.runAction(
        "session:create",
        {
          email: "peach@example.com",
          password: "x"
        }
      );

      expect(error).toMatch(/password does not match/);
      expect(success).toEqual(false);
      expect(user).toBeUndefined();
    });
  });

  describe("session:view", () => {
    test("can view session details", async () => {
      const connection = await specHelper.buildConnection();
      connection.params = { email: "peach@example.com", password: "P@ssw0rd!" };
      const signInResponse = await specHelper.runAction(
        "session:create",
        connection
      );
      expect(signInResponse.error).toBeUndefined();
      expect(signInResponse.success).toBe(true);
      const csrfToken = signInResponse.csrfToken;

      connection.params = { csrfToken };
      const {
        csrfToken: newCsrfToken,
        user,
        error
      } = await specHelper.runAction("session:view", connection);

      expect(error).toBeUndefined();
      expect(newCsrfToken).toBe(csrfToken);
      expect(user.id).toBeTruthy();
    });
  });

  describe("session:destroy", () => {
    test("can log out", async () => {
      const { success, error, csrfToken } = await specHelper.runAction(
        "session:create",
        {
          email: "peach@example.com",
          password: "P@ssw0rd!"
        }
      );

      expect(error).toBeUndefined();
      expect(success).toEqual(true);

      const {
        successAgain = success,
        errorAgain = error
      } = await specHelper.runAction("session:destroy", {
        csrfToken
      });

      expect(errorAgain).toBeUndefined();
      expect(successAgain).toEqual(true);
    });
  });
});
