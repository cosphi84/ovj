export interface User {
    id: number;
    name: string;
}

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    password?: string;
    active: boolean;
}