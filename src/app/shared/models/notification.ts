
export interface Notification {
    '@id': string;
    '@type': string;
    title: string;
    content: string;
    type: string;
    club: string;
    id: string;
    targetId: string;
    targetType: string;
    userClientRequester: any;
    viewed: boolean;
    createdAt?: string;
}
