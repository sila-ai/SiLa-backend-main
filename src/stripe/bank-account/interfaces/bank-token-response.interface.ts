import { Bank } from "./bank.interface";

export interface BankTokenResponse {
    id: string;
    object: string;
    bank_account?: Bank;
    client_ip: string;
    created: number;
    livemode: boolean;
    type: string;
    used: boolean;
}
