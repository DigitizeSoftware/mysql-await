import mysql from "mysql";
import {Connection, ConnectionOptions} from "./Connection";

export const createConnection = (options: ConnectionOptions) => {
    return new Connection(mysql.createConnection(options));
}
