/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FileDto } from './FileDto';
import type { RoleDto } from './RoleDto';
import type { StatusDto } from './StatusDto';
export type UpdateUserDto = {
    email?: Record<string, any>;
    password?: string;
    firstName?: string;
    lastName?: string;
    photo?: FileDto;
    role?: RoleDto;
    status?: StatusDto;
    phone?: string;
    address?: string;
};

