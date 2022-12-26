import mysql, {ConnectionConfig} from "mysql";
import {Queryable} from "../query/Queryable";
import {callbackToPromise} from "../util/callbackToPromise";

export {ConnectionConfig};

export type ConnectionOptions = string | ConnectionConfig;

export type TransactionContext = {
    rollback: () => Promise<void>;
}

export class Connection<T extends mysql.Connection = mysql.Connection> extends Queryable {
    private inTransaction = false;

    constructor(protected mysqlConnection: T) {
        super(mysqlConnection);
    }

    connect(): Promise<void> {
        return new Promise<void>((res, rej) => {
            this.mysqlConnection.connect((err) => {
                if (err) {
                    rej(err);
                }
                else {
                    res();
                }
            })
        });
    }

    end(): Promise<void> {
        return new Promise((res, rej) => {
            this.mysqlConnection.end((err) => {
                if (err) {
                    rej(err);
                }
                else {
                    res();
                }
            })
        });
    }

    destroy() {
        this.mysqlConnection.destroy();
    }

    pause() {
        this.mysqlConnection.pause();
    }

    resume() {
        this.mysqlConnection.resume();
    }

    async transaction<V>(fn: (ctx: TransactionContext) => Promise<V>): Promise<V> {
        await this.beginTransaction();
        try {
            const result = await fn({rollback: async () => await this.rollback()});
            if (!this.inTransaction) {
                await this.commit();
            }
            return result;
        }
        catch (err) {
            await this.rollback();
            throw err;
        }
    }

    async beginTransaction(): Promise<void> {
        await new Promise<void>((res, rej) => {
            this.mysqlConnection.beginTransaction(callbackToPromise(res, rej));
        });
        this.inTransaction = true;
    }

    async commit(): Promise<void> {
        if (!this.inTransaction) {
            throw new Error('no transaction to commit');
        }
        await new Promise<void>((res, rej) => {
            this.mysqlConnection.commit(callbackToPromise(res, rej));
        });
        this.inTransaction = false;
    }

    async rollback(): Promise<void> {
        if (!this.inTransaction) {
            throw new Error('no transaction to rollback');
        }
        await new Promise<void>((res, rej) => {
            this.mysqlConnection.rollback(callbackToPromise(res, rej));
        });
        this.inTransaction = false;
    }
}
