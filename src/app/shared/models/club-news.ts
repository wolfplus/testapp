import { ClubPhoto } from "src/app/club/models/club-photo";

export interface ClubNews {
    '@id'?: string;
    id: string;
    title: string;
    shortContent?: string;
    content?: string;
    publicationStartDate?: Date;
    publicationEndDate?: Date;
    club: string;
    mainPhoto: ClubPhoto;
}

export interface IClubNewsList {
    clubNewsList: ClubNews[];
    totalItems: number;
}

export class ClubNewsList implements IClubNewsList {
    clubNewsList: ClubNews[];
    totalItems: number;
    constructor(
        clubNewsList: ClubNews[],
        totalItems: number
    ) {
        this.totalItems = totalItems;
        this.clubNewsList = clubNewsList;
    }
}


