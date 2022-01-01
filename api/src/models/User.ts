import {
  Model,
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  AutoIncrement,
  Unique,
  IsEmail,
  Length,
  PrimaryKey,
  HasMany,
} from "sequelize-typescript";
import bcrypt from "bcrypt";
import { Message } from "./Message";
import { Op, Transaction } from "sequelize";

@Table({ tableName: "users", paranoid: false })
export class User extends Model {
  saltRounds = 10;

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Length({ min: 3 })
  @Unique
  @Column
  userName: string;

  @AllowNull(false)
  @IsEmail
  @Unique
  @Column
  email: string;

  @Column
  passwordHash: string;

  @Column
  lastLoginAt: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasMany(() => Message, "fromId")
  sendMessages: Message[];

  @HasMany(() => Message, "toId")
  receivedMessages: Message[];

  async messages(otherUser: User, limit = 1000, offset = 0) {
    return Message.findAll({
      where: {
        [Op.or]: [
          {
            [Op.and]: {
              toId: this.id,
              fromId: otherUser.id,
            },
          },
          {
            [Op.and]: {
              fromId: this.id,
              toId: otherUser.id,
            },
          },
        ],
      },
      order: [["createdAt", "asc"]],
      limit,
      offset,
    });
  }

  async unreadConversations() {
    const users: Array<{ DISTINCT: number }> = await Message.aggregate(
      "fromId",
      "DISTINCT",
      {
        where: { toId: this.id, readAt: null },
        plain: false,
      }
    );

    return users.map((u) => u.DISTINCT);
  }

  async conversations() {
    let users: User[];

    const receivedMessageUserIds = await Message.aggregate(
      "fromId",
      "DISTINCT",
      {
        where: { toId: this.id },
        plain: false,
      }
    );

    const sentMessageUserIDs = await Message.aggregate("toId", "DISTINCT", {
      where: { fromId: this.id },
      plain: false,
    });

    const userIds = []
      .concat(receivedMessageUserIds, sentMessageUserIDs)
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      })
      .map((item) => item.DISTINCT);

    return User.findAll({
      where: { id: { [Op.in]: userIds, [Op.ne]: this.id } },
      order: [["userName", "asc"]],
    });
  }

  async apiData(includeEmail = false) {
    return {
      id: this.id,
      userName: this.userName,
      email: includeEmail ? this.email : undefined,
      lastLoginAt: this.lastLoginAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  async updatePassword(password: string, transaction?: Transaction) {
    this.passwordHash = await bcrypt.hash(password, this.saltRounds);
    await this.save({ transaction });
  }

  async checkPassword(password: string) {
    if (!this.passwordHash) {
      throw new Error("password not set for this user");
    }

    const match: boolean = await bcrypt.compare(password, this.passwordHash);
    return match;
  }
}
