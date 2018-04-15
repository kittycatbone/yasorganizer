export class Event {
    id: string;
    summary: string;
    location: string;
    details: string;
    startDate: Date;
    endDate: Date;
    isDayEvent: boolean;
    htmlLink: string;

    constructor(id?: string, summary?: string, location?: string,
                details?: string, startDate?: Date, endDate?: Date,
                isDayEvent?: boolean, htmlLink?: string) {
        this.id = id;
        this.summary = summary === undefined ? '(no title)' : summary;
        this.location = location;
        this.details = details;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isDayEvent = isDayEvent === undefined ? false : isDayEvent;
        this.htmlLink = htmlLink;
    }
}
