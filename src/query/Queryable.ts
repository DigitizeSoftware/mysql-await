import mysql, {FieldInfo} from "mysql";
import {log} from "../logger";
import {format} from "../format/format";

export type QueryableOptions = {
    query: mysql.QueryFunction
};

export interface QueryResult<T = any> {
    results?: T;
    fields?: FieldInfo[];
}

export class Queryable {
    constructor(private objectWithQuery: QueryableOptions) {
    }

    query<T = any>(options: string | mysql.QueryOptions, values?: any): Promise<QueryResult<T>> ;
    query<T = any>(...args: [string | mysql.QueryOptions, any?]): Promise<QueryResult<T>> {
        if (typeof args[0] === "string") {
            log(format(args[0], args[1]));
        }
        return new Promise((res, rej) => {
            this.objectWithQuery.query(...args, (err: mysql.MysqlError | null, results?: any, fields?: mysql.FieldInfo[]) => {
                if (err) {
                    if (typeof err === "object") {
                        const clone = {
                            stack: err.stack,
                            message: err.message,
                            // @ts-ignore
                            offset: err.offset,
                            code: err.code,
                        }
                        rej(clone);
                    }
                    else {
                        rej(err);
                    }
                }
                else {
                    res({results, fields});
                }
            });
        });
    }
}
