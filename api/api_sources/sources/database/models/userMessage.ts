/**
 * User Message Model
 */
import {Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne} from 'typeorm';
import { UserMessagesSchema, UserSchema } from '../database-schema';
import { User } from './user';
import { DataModelController } from '../data.model.controller';

/**
 * @description Status of message
 * @export enum UserMessageStatus
 */
export enum UserMessageStatus {
    unseen = 0,
    seen = 1
}

/**
 * @description UserMessage Model class
 * @export class UserMessage
 */
@Entity({
    name: UserMessagesSchema.schema.name
})
export class UserMessage {
    @PrimaryGeneratedColumn()
    message_id: number;
    @Column({
        name: UserMessagesSchema.schema.columns.title,
        nullable: true
    })
    title?: string;
    @Column({
        name: UserMessagesSchema.schema.columns.body,
        nullable: true
    })
    body?: string;
    @Column({
        name: UserMessagesSchema.schema.columns.type
    })
    type: number;
    @Column({
        name: UserMessagesSchema.schema.columns.status
    })
    status: number;

    // Relationship
    // Receiver
    @ManyToOne(type => User, {eager: true})
    @JoinColumn({
        name: UserMessagesSchema.schema.columns.refReceiverId,
        referencedColumnName: UserSchema.schema.columns.id
    })
    receiver: User;

    // Creator
    @ManyToOne(type => User, {eager: true})
    @JoinColumn({
        name: UserMessagesSchema.schema.columns.refCreatorId,
        referencedColumnName: UserSchema.schema.columns.id
    })
    creator: User;

}
/**
 * @description User message data controller
 * @export class UserMessageController
 */
export class UserMessageController extends DataModelController<UserMessage> {
    public static get shared(): UserMessageController {
        return this.sharedInstance<UserMessage>(UserMessage, UserMessagesSchema) as UserMessageController;
    }
}
