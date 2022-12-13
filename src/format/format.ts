import {format as mysqlFormat} from "mysql";

export function format(sql: string, options: Array<any>): string {
    return mysqlFormat(sql, options);
}
