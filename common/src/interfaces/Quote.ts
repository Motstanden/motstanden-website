export interface NewQuote {
    utterer: string,
    quote: string,
}

export interface Quote extends NewQuote {
    id: number,
    isCreatedByCurrentUser: boolean,
    createdAt: string,          // Format: 'YYYY-MM-DD HH-MM-SS'
    updatedAt: string           // Format: 'YYYY-MM-DD HH-MM-SS'
}