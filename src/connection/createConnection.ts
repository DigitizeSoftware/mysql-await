import {Connection, ConnectionArg} from "./Connection";

export const createConnection = (options: ConnectionArg) => new Connection(options);
