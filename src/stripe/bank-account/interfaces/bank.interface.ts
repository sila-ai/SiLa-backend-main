export interface Bank {
    id: string;
    object: string;
    account_holder_name: string;
    account_holder_type: string;
    bank_name: string | null;
    country: string;
    currency: string;
    fingerprint?: string;
    last4: string;
    routing_number: string;
    status: string
}