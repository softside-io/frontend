export type LoginResponseType = {
	refreshToken: string;
	token: string;
	tokenExpires: number;
	user: User;
};
export type User = {
	id: string;
	email: string;
	provider: string;
	socialId: string;
	firstName: string;
	lastName: string;
	role: Role;
	status: Status;
	createdAt: string;
	updatedAt: string;
};
export type Role = {
	id: number;
};
export type Status = {
	id: number;
};
