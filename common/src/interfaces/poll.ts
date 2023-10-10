

export interface Poll {
    id: number;
    title: string;
    type: 'single' | 'multiple';

    createdByUserId: number;
    createdByName: string;
    createdAt: string;          // Format: 'YYYY-MM-DD HH-MM-SS'

    updatedByUserId: number;
    updatedByName: string;      
    updatedAt: string;          // Format: 'YYYY-MM-DD HH-MM-SS'    
}

export interface PollWithOption extends Poll {
    options: PollOption[];
}

export interface PollOption {
    id: number;
    text: string;
    voteCount: number;
    isVotedOnByUser: boolean;          // Whether the current user has voted on this option
}