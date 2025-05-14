declare enum UserRole {
    USER = "USER",
    STORE_OWNER = "STORE_OWNER",
    ADMIN = "ADMIN"
}
export declare class CreateUserDto {
    name: string;
    email: string;
    address: string;
    password: string;
    role: UserRole;
}
export {};
