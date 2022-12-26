import mysql from "mysql";
import {Queryable} from "../query/Queryable";
import {PoolConnection} from "./PoolConnection";

export class Pool extends Queryable {
    constructor(private mysqlPool: mysql.Pool) {
        super(mysqlPool);
    }

    async getConnection() {
        return new Promise((res, rej) => {
            this.mysqlPool.getConnection((err: mysql.MysqlError, connection) => {
                if (err != null) {
                    rej(err);
                }
                else {
                    res(new PoolConnection(connection));
                }
            })
        });
    }

    async end(): Promise<void> {
        return new Promise((res, rej) => {
            this.mysqlPool.end((err) => {
                if (err == null) {
                    res();
                }
                else {
                    rej(err);
                }
            })
        })
    }
}
