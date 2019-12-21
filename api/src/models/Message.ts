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
  BelongsTo
} from "sequelize-typescript";
import { User } from "./User";

@Table({ tableName: "messages", paranoid: false })
export class Message extends Model<Message> {
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
      message: this.message,
      readAt: this.readAt,
      createdAt: this.createdAt
    };
  }
}
