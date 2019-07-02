//
// UserMessage DataModel
//
// Copyright © 2019 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Pushan Mitra on 2019-06-02.
/**
 * Imports
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
    /**
     * Columns
     */
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
    /**
     * @description Getter for shared instance
     */
    public static get shared(): UserMessageController {
        return this.sharedInstance<UserMessage>(UserMessage, UserMessagesSchema) as UserMessageController;
    }
}
// ----------------------------------------------------------------------------------------------------------------

