import { Model } from "pocketto";
import moment from 'moment';

export class Dummy extends Model {
    static collectionName = 'Dummies';

    name?: string;
    color?: string;

    setRandomName() {
        this.name = moment().format('YYYY-MM-DD HH:mm:ss');
        return this;
    }

    setRandomHexColor() {
        this.color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        return this;
    }
}