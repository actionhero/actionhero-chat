import { specHelper } from "actionhero";
import { User } from "./../../src/models/User";
import { Process } from "actionhero";
import { Op } from "sequelize";

const actionhero = new Process();

describe("session", () => {
  let mario: User;

  beforeAll(async () => {
    await actionhero.start();
    await User.destroy({ where: { userName: { [Op.ne]: "actionhero-bot" } } });
  });

  afterAll(async () => {
    await actionhero.stop();
  });

  describe("user creation and log in", () => {
    test("can create a new user", async () => {
      const { success, user, error } = await specHelper.runAction(
        "user:create",
        {
          email: "mario@example.com",
          password: "P@ssw0rd!",
          userName: "mario",
        }
      );

      expect(error).toBeUndefined();
      expect(user.id).toBeTruthy();
    });

    describe("with session", () => {
      let csrfToken: string;
      let connection;

      beforeAll(async () => {
        connection = await specHelper.buildConnection();

        connection.params = {
          email: "mario@example.com",
          password: "P@ssw0rd!",
        };
        const signInResponse = await specHelper.runAction(
          "session:create",
          connection
        );
        csrfToken = signInResponse.csrfToken;
      });

      test("can log in and view user details", async () => {
        connection.params = { csrfToken };

        const {
          csrfToken: newCsrfToken,
          user,
          error,
        } = await specHelper.runAction("user:view", connection);

        expect(error).toBeUndefined();
        expect(user.id).toBeTruthy();
        expect(user.userName).toBe("mario");
      });

      test("can update user details", async () => {
        connection.params = {
          csrfToken,
          userName: "Mario!!!",
        };

        const {
          csrfToken: newCsrfToken,
          user,
          error,
        } = await specHelper.runAction("user:edit", connection);

        expect(error).toBeUndefined();
        expect(user.id).toBeTruthy();
        expect(user.userName).toBe("Mario!!!");
      });
    });
  });
});
