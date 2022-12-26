import mysql from "mysql";
import {Queryable} from "../query/Queryable";
import {PoolConnection} from "./PoolConnection";
import {TransactionContext} from "../connection";

export class Pool extends Queryable {
    constructor(private mysqlPool: mysql.Pool) {
        super(mysqlPool);
    }

    async getConnection(): Promise<PoolConnection> {
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

    async transaction<V>(fn: (ctx: TransactionContext) => Promise<V>): Promise<V> {
        const connection = await this.getConnection();
        const result = await connection.transaction(fn);
        await connection.release();
        return result;
    }
}
