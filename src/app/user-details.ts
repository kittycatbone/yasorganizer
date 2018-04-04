import { DEFAULT_PIC } from './constants';

export class UserDetails {
    name: string;
    imageUrl: string;
    email: string;
    givenName: string;
    familyName: string;

    constructor() {
        this.name = '';
        this.email = '';
        this.imageUrl = DEFAULT_PIC;
        this.givenName = '';
        this.familyName = '';
    }

    resetValues() {
        this.name = '';
        this.email = '';
        this.imageUrl = DEFAULT_PIC;
        this.givenName = '';
        this.familyName = '';
    }
}



