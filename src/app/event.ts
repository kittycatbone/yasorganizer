export class Event {
    id: string;
    summary: string;
    location: string;
    details: string;
    startDate: Date;
    endDate: Date;
    isDayEvent: boolean;

    constructor(id?: string, summary?: string, location?: string,
                details?: string, startDate?: Date, endDate?: Date, isDayEvent?: boolean) {
        this.id = id;
        this.summary = summary;
        this.location = location;
        this.details = details;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isDayEvent = isDayEvent === undefined ? false : isDayEvent;
    }
}
