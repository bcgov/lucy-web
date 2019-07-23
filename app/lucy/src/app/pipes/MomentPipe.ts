import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({
    name: 'momentPipe'
})
export class MomentPipe implements PipeTransform {
    transform(value: Date|moment.Moment, ...args: any[]): any {
        const [format] = args;
        return moment.tz(value, 'UTC').format(format);
    }
}