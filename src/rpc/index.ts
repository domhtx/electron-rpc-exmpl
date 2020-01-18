import { IpcMain, IpcRenderer } from "electron";

export interface ExampleRPCMethods {
    helloWorld: () => Promise<string>;
}

export function createClient(ipcR: IpcRenderer) {
    let handler = {
        get(_obj: any, fnName: string) {
            return (...args: any): Promise<any> => {
                return ipcR.invoke(fnName, ...args);
            };
        }
    };
    return new Proxy({}, handler);
}

const getMethods = (obj: any, depth = 1): string[] => {
    let properties: string[] = [];
    let currentObj = obj;
    do {
        Object.getOwnPropertyNames(currentObj).map(item => properties.push(item))
    } while (depth-- > 0 && (currentObj = Object.getPrototypeOf(currentObj)))
    return properties.filter((item: string) => typeof obj[item] === 'function' && item !== "constructor");
}

export function serve(ipcM: IpcMain, maps: any) {
    const methods = getMethods(maps)

    for (const method of methods) {
        ipcM.handle(method, async (_event, args) => {
            const returns = await maps[method].apply(maps, args);
            return returns;
        })
    }
}