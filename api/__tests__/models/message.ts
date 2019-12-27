import { User } from "./../../src/models/User";
import { Message } from "./../../src/models/Message";
import { Process } from "actionhero";
const actionhero = new Process();

describe("models/message", () => {
  beforeAll(async () => {
    await actionhero.start();
    await User.destroy({ truncate: true });
    await Message.destroy({ truncate: true });
  });

  afterAll(async () => {
    await actionhero.stop();
  });

  describe("general", () => {
    let mario;
    let luigi;
    beforeAll(async () => {
      mario = await User.create({
        userName: "Mario",
        email: "mario@example.com"
      });

      luigi = await User.create({
        userName: "Luigi",
        email: "luigi@example.com"
      });
    });

    afterAll(async () => {
      await mario.destroy();
      await luigi.destroy();
    });

    test("a message can be created between 2 users", async () => {
      const message = await Message.create({
        fromId: mario.id,
        toId: luigi.id,
        message: "unread message"
      });

      expect(message.id).toBeTruthy();
    });

    test("a message cannot be created without 2 valid users", async () => {
      await expect(
        Message.create({
          fromId: 999,
          toId: luigi.id,
          message: "some message"
        })
      ).rejects.toThrow(/sender not found/);

      await expect(
        Message.create({
          fromId: mario.id,
          toId: 999,
          message: "some message"
        })
      ).rejects.toThrow(/recipient not found/);
    });
  });
});
