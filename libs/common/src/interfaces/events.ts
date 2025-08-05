export interface UserCreatedEventInterface {
    userId: string;
    email: string;
}

export interface UserRegisteredEventInterface {
    id: string;
    email: string;
    hashedPassword: string;
}