import { User } from "./../../src/models/User";
import { Message } from "./../../src/models/Message";
import { Process } from "actionhero";
const actionhero = new Process();

describe("models/user", () => {
  beforeAll(async () => {
    await actionhero.start();
    await User.destroy({ truncate: true });
  });

  afterAll(async () => {
    await actionhero.stop();
  });

  describe("general", () => {
    let user: User;

    afterEach(async () => {
      if (user) {
        await user.destroy();
      }
    });

    test("a user can be created", async () => {
      user = new User({
        userName: "Mario",
        email: "mario@example.com",
      });

      await user.save();

      expect(user.id).toBeTruthy();
      expect(user.createdAt).toBeTruthy();
      expect(user.updatedAt).toBeTruthy();
    });

    test("users must have unique email addresses", async () => {
      user = await User.create({
        userName: "Mario",
        email: "mario@example.com",
      });

      await expect(
        User.create({
          userName: "Other Mario",
          email: "mario@example.com",
        })
      ).rejects.toThrow(/Validation error/);
    });
  });

  describe("passwords", () => {
    let user: User;
    beforeAll(async () => {
      user = await User.create({
        userName: "Mario",
        email: "mario@example.com",
      });

      await user.updatePassword("Passw0rd!");
    });

    afterAll(async () => {
      await user.destroy();
    });

    test("matching passwords will be validated", async () => {
      const match = await user.checkPassword("Passw0rd!");
      expect(match).toBe(true);
    });

    test("incorrect passwords will be invalidated", async () => {
      const match = await user.checkPassword("nope!");
      expect(match).toBe(false);
    });

    test("users can update their passwords", async () => {
      await user.updatePassword("new password");
      const match = await user.checkPassword("new password");
      expect(match).toBe(true);
    });

    test("users with no passwords set cannot be checked", async () => {
      user.passwordHash = undefined;
      await user.save();

      await expect(user.checkPassword("Passw0rd!")).rejects.toThrow(
        /password not set/
      );
    });
  });

  describe("messages", () => {
    let mario: User;
    let luigi: User;
    beforeAll(async () => {
      mario = await User.create({
        userName: "Mario",
        email: "mario@example.com",
      });

      luigi = await User.create({
        userName: "Luigi",
        email: "luigi@example.com",
      });
    });

    afterAll(async () => {
      await mario.destroy();
      await luigi.destroy();
    });

    test("the users you are having conversations with can be found", async () => {
      await Message.create({
        fromId: mario.id,
        toId: luigi.id,
        message: "unread message",
      });

      const conversationUsers = await luigi.conversations();
      expect(conversationUsers.length).toBe(1);
      expect(conversationUsers[0].id).toBe(mario.id);
    });
  });
});
