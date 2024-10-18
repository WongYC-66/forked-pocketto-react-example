import { Model, Pocketto } from "pocketto";
import moment from 'moment';

@Pocketto
export class Dummy extends Model {
    static collectionName = 'Dummies';

    name?: string;
    someData?: any;

    setRandomName() {
        this.name = moment().format('YYYY-MM-DD HH:mm:ss');
        return this;
    }
}