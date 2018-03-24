export class UserDetails {
    name: string;
    imageUrl: string;
    email: string;
    givenName: string;
    familyName: string;

    constructor() {
        this.name = '';
        this.email = '';
        this.imageUrl = '../../assets/default-pic.gif';
        this.givenName = '';
        this.familyName = '';
    }

    resetValues() {
        this.name = '';
        this.email = '';
        this.imageUrl = '../../assets/default-pic.gif';
        this.givenName = '';
        this.familyName = '';
    }
}



