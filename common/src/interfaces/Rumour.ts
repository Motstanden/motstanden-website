export interface NewRumour {
    rumour: string
}

export interface Rumour extends NewRumour {
    id: number,
    createdBy: number,
    createdAt: string,          // Format: 'YYYY-MM-DD HH-MM-SS'
    updatedAt: string           // Format: 'YYYY-MM-DD HH-MM-SS'
}