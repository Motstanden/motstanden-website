import { UserReference } from "./User.js";

export interface NewPoll {
    title: string;
    type: 'single' | 'multiple';
}

export interface Poll extends NewPoll {
    id: number;

    createdBy: number;          // User id
    createdByName: string;
    createdAt: string;          // Format: 'YYYY-MM-DD HH-MM-SS'

    updatedBy: number;          // User id
    updatedByName: string;      
    updatedAt: string;          // Format: 'YYYY-MM-DD HH-MM-SS'    
}

export interface PollWithOption extends Poll {
    options: PollOption[];
}

export interface NewPollWithOption extends NewPoll {
    options: NewPollOption[];
}

export interface NewPollOption {
    text: string;
}

export interface PollOption extends NewPollOption {
    id: number;
    voteCount: number;
    isVotedOnByUser: boolean;          // Whether the current user has voted on this option
}

export interface PollOptionVoters { 
    optionId: number,
    voters: UserReference[]
}
