import mysql from "mysql";
import {Pool} from "./Pool";

export type PoolOptions = mysql.PoolConfig | string;

export function createPool(options: PoolOptions) {
    return new Pool(mysql.createPool(options));
}
