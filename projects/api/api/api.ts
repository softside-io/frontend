export * from './auth.service';
import { AuthService } from './auth.service';
export * from './files.service';
import { FilesService } from './files.service';
export * from './home.service';
import { HomeService } from './home.service';
export * from './users.service';
import { UsersService } from './users.service';
export const APIS = [AuthService, FilesService, HomeService, UsersService];
