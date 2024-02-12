/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FileType } from './FileType';
import type { Role } from './Role';
import type { Status } from './Status';

export type User = {
    id: (string | number);
    email: string;
    password?: string;
    previousPassword?: string;
    provider: string;
    socialId?: string;
    firstName?: string;
    lastName?: string;
    photo?: FileType;
    address?: string;
    phone?: string;
    role: Role;
    status: Status;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
};
