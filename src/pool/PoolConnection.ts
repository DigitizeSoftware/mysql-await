import mysql from "mysql";
import {Connection} from "../connection";

export class PoolConnection extends Connection<mysql.PoolConnection> {
    constructor(mysqlPoolConnection: mysql.PoolConnection) {
        super(mysqlPoolConnection);
    }

    release() {
        this.mysqlConnection.release()
    }
}
