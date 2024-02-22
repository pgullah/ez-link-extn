interface AppContext {
    toggle?: boolean
}

interface LinkParameter {
    key?: string
    value?: string
    desc?: string
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

enum mm {
    GET,
    POST,
    PUT,
    DELETE,
    PATCH
}

interface Link {
    id?: string,
    title?: string,
    url?: string,
    method?: HttpMethod
    params?: LinkParameter[]
}

interface Option {
    get key(): string;

    get value(): string;

    
}

class KeyOption implements Option {
    private opt
    constructor(opt: string) {
        this.opt = opt
    }

    get key() {
        return this.opt

    }

    get value() {
        return this.opt

    }

    static from_array(...args: string[]) {
        return args.map(a => new KeyOption(a))
    }
}

class KeyValueOption implements Option {
    private k: string
    private v: string
    constructor(k: string, v: string) {
        this.k = k
        this.v = v
    }

    get key() { return this.k };

    get value(): string {
        return this.v;
    }
}