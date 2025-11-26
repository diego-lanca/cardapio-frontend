export interface User {
    id: number;
    full_name: string;
    username: string;
    email: string;
    phone: string;
    avatar_url: string | undefined;
    isAdmin: boolean;
}