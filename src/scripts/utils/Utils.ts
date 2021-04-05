import Floor from "../environement/Floor";

export enum OrdonencementState {
    FCFS,
    SSTF,
}

export enum PolitiqueR {
    Millieu,
    Inferieur,
}

export function FCFS(ArrFloor: Array<Floor>): Array<Floor> {
    return ArrFloor;
}

export function SSTF(previus: Floor, Arr: Array<Floor>) {
    const closest = Arr.reduce((a, b) => {
        return Math.abs(b.floorNumber - previus.floorNumber) < Math.abs(a.floorNumber - previus.floorNumber)
            ? b
            : a;
    });

    swapArrEl(Arr[0], Arr.indexOf(closest), Arr);
    return Arr;
}

export function range(n: number): Array<number> {
    return Array(n)
        .fill(0)
        .map((e, i) => i + 1);
}

export function randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function random_exponential(lambda: number) {
    var random = Math.random();
    return -Math.log(1 - random) / lambda;
}

export function gen_poisson(lambda: number, T: number) {
    var t = 0;
    var q = new Array();

    while (t < T) {
        t += random_exponential(lambda);
        if (t < T) q.push(t);
    }
    return q;
}

export function swapArrEl(a: any, b: any, Arr: Array<any>): void {
    var b = Arr[a];
    Arr[a] = Arr[b];
    Arr[b] = b;
}

export function isEven(n: number): boolean {
    return n % 2 == 0;
}

export function posFractionInterval(start: number, end: number, fraction: number): number {
    var arr = new Array<number>();
    for (var i = start; i < end; i++) arr.push(i);
    var index = Math.round(arr.length * fraction);
    return arr[index];
}
