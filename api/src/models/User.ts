import {
  Model,
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  AutoIncrement,
  IsEmail,
  Length,
  PrimaryKey,
  HasMany,
} from "sequelize-typescript";
import bcrypt from "bcrypt";
import { Message } from "./Message";
import { Op } from "sequelize";

@Table({ tableName: "users", paranoid: false })
export class User extends Model<User> {
  saltRounds = 10;

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Length({ min: 3 })
  @Column
  userName: string;

  @AllowNull(false)
  @IsEmail
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

  async unreadMessages() {
    return this.$get("receivedMessages", { where: { readAt: null } });
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
    });
  }

  async apiData() {
    return {
      id: this.id,
      userName: this.userName,
      email: this.email,
      lastLoginAt: this.lastLoginAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  async updatePassword(password: string, transaction = undefined) {
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
