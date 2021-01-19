import {
  Model,
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  AutoIncrement,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  BeforeCreate,
  AfterCreate,
} from "sequelize-typescript";
import { User } from "./User";
import { chatRoom } from "actionhero";

@Table({ tableName: "messages", paranoid: false })
export class Message extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  fromId: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  toId: number;

  @AllowNull(false)
  @Column
  message: string;

  @Column
  readAt: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => User, "fromId")
  sender: User;

  @BelongsTo(() => User, "toId")
  recipient: User;

  async apiData() {
    return {
      id: this.id,
      toId: this.toId,
      fromId: this.fromId,
      message: this.message,
      readAt: this.readAt,
      createdAt: this.createdAt,
    };
  }

  @BeforeCreate
  static async ensureUsersExist(instance: Message) {
    const sender = await instance.$get("sender");
    const recipient = await instance.$get("recipient");

    if (!sender) {
      throw new Error("sender not found");
    }

    if (!recipient) {
      throw new Error("recipient not found");
    }
  }

  @AfterCreate
  static async broadcast(instance: Message) {
    const apiData = await instance.apiData();

    if (await chatRoom.exists(`user:${instance.toId}`))
      chatRoom.broadcast({}, `user:${instance.toId}`, { message: apiData });

    if (await chatRoom.exists(`user:${instance.fromId}`))
      chatRoom.broadcast({}, `user:${instance.fromId}`, { message: apiData });
  }

  /**
   * A helper to create a message between 2 users
   */
  static async store(from: User, to: User, message: string) {
    return Message.create({
      fromId: from.id,
      toId: to.id,
      message,
    });
  }
}
