import {
    ConnectionConfig,
    createConnection,
    Connection as MysqlConnection,
    QueryOptions,
    MysqlError,
    FieldInfo
} from "mysql";
import { format } from "../format/format";

export {FieldInfo} from "mysql";

export type ConnectionArg = string | ConnectionConfig;

export interface QueryResult<T = any> {
    results?: T;
    fields?: FieldInfo[];
}

export class Connection {
    private mysqlCon: MysqlConnection;

    constructor(options: ConnectionArg) {
        this.mysqlCon = createConnection(options);
    }

    connect(): Promise<void> {
        return new Promise<void>((res, rej) => {
            this.mysqlCon.connect((err) => {
                if (err) {
                    rej(err);
                }
                else {
                    res();
                }
            })
        });
    }

    query<T = any>(options: string | QueryOptions, values?: any): Promise<QueryResult<T>> ;
    query<T = any>(...args: [string | QueryOptions, any?]): Promise<QueryResult<T>> {
        if (typeof args[0] === "string") {
            console.log(format(args[0], args[1]));
        }
        return new Promise((res, rej) => {
            this.mysqlCon.query(...args, (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
                if (err) {
                    rej(err);
                }
                else {
                    res({results, fields});
                }
            });
        });
    }

    end(): Promise<void> {
        return new Promise((res, rej) => {
            this.mysqlCon.end((err) => {
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
        this.mysqlCon.destroy();
    }

    pause() {
        this.mysqlCon.pause();
    }

    resume() {
        this.mysqlCon.resume();
    }
}
