import { Model, Pocketto } from "pocketto";

@Pocketto
export class Dummy extends Model {
    name?: string;
    someData?: any;

    setRandomName() {
        this.name = Math.random().toString(36).substring(7);
        return this;
    }
}