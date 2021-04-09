interface Window {
    setup: () => void;
    draw: () => void;
}

interface Config {
    elevator: number;
    floor: number;
}

type EnumDictionary<T extends string | symbol | number, U> = {
    [K in T]: U;
};
