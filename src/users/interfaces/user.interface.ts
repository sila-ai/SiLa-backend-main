export interface UserResponse {
    id: number | null;
    customerId: string | null;
    name: string;
    role: string;
    email: string;
    chat_id: string | null;
}