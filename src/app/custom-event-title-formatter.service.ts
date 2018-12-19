import { LOCALE_ID, Inject } from '@angular/core';
import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';

export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
    constructor( @Inject(LOCALE_ID) private locale: string) {
        super();
    }



    // you can override any of the methods defined in the parent class

    month(event: CalendarEvent): string {
        return `<b>${new Intl.DateTimeFormat(this.locale, {
            hour: 'numeric',
            minute: 'numeric'
        }).format(event.start)}</b> ${event.title} : ${event.meta.service} for ${event.meta.name}  ${event.meta.phone}  `;
    }

    week(event: CalendarEvent): string {
        return `<b>${new Intl.DateTimeFormat(this.locale, {
            hour: 'numeric',
            minute: 'numeric'
        }).format(event.start)}</b> ${event.title} : ${event.meta.service} for ${event.meta.name}  ${event.meta.phone}  `;
    }

    // day(event: CalendarEvent): string {
    //     //return`
    //     //${event.title} : ${event.meta.service} for ${event.meta.name}  ${event.meta.phone}  `;
    //     return `${event.meta.name} ( ${event.meta.service} )`
    // }

    day(event: CalendarEvent): string {
        var nameLower = event.meta.name.toLowerCase();
        var name = nameLower.charAt(0).toUpperCase() + nameLower.substr(1);

        var title = event.title.charAt(0).toUpperCase() + event.title.substr(1);
        return `<b>${new Intl.DateTimeFormat(this.locale, {
            hour: 'numeric',
            minute: 'numeric'
        }).format(event.start)} - ${new Intl.DateTimeFormat(this.locale, {
            hour: 'numeric',
            minute: 'numeric'
        }).format(event.end)}</b><br> 
        ${name} : ${title}<br>
        ${event.meta.service}  `;
    }
}

