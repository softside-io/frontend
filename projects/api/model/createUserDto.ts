/**
 * API
 * API docs
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { FileDto } from './fileDto';
import { RoleDto } from './roleDto';
import { StatusDto } from './statusDto';

export interface CreateUserDto { 
    email: any;
    password: string;
    firstName: any;
    lastName: any;
    photo: FileDto;
    role: RoleDto;
    status: StatusDto;
}