import { Card } from "./card.interface";

export interface CardTokenResponse {
    id: string;
    object: string;
    card?: Card;
    client_ip: string;
    created: number;
    livemode: boolean;
    type: string;
    used: boolean;
}
