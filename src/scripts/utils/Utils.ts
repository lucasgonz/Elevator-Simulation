import Floor from "../environement/Floor";

export enum OrdonencementState {
    FCFS,
    SSTF,
}

export enum PolitiqueR {
    Millieu,
    Inferieur,
}

// First Come First Serd
export function FCFS(ArrFloor: Array<Floor>): Array<Floor> {
    return ArrFloor;
}

// Shortest Seek Time First : return arr closest from previus in first position
export function SSTF(previus: Floor, Arr: Array<Floor>): Array<Floor> {
    if (Arr.length <= 1) return Arr;

    const closest = Arr.reduce((prev, curr) => {
        return Math.abs(curr.floorNumber - previus.floorNumber) < Math.abs(prev.floorNumber - previus.floorNumber)
            ? curr
            : prev;
    });

    swapArrEl(0, Arr.indexOf(closest), Arr);

    var p = Arr.map((el) => el.floorNumber);
    console.log(`In ${p} closest is ${closest.floorNumber}`);
    return Arr;
}

// range function from python
export function range(n: number): Array<number> {
    return Array(n)
        .fill(0)
        .map((e, i) => i + 1);
}

// randome int interval
export function randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// randome with expotential distribution
export function random_exponential(lambda: number) {
    var random = Math.random();
    return -Math.log(1 - random) / lambda;
}

// poisson process generation
export function gen_poisson(lambda: number, T: number) {
    var t = 0;
    var q = new Array();

    while (t < T) {
        t += random_exponential(lambda);
        if (t < T) q.push(t);
    }
    return q;
}

// swap element in arr
export function swapArrEl(a: any, b: any, Arr: Array<any>): void {
    var tmp = Arr[a];
    Arr[a] = Arr[b];
    Arr[b] = tmp;
}

// return bool even
export function isEven(n: number): boolean {
    return n % 2 == 0;
}

// return number in interval with given ration
export function posFractionInterval(start: number, end: number, fraction: number): number {
    var arr = new Array<number>();
    for (var i = start; i < end; i++) arr.push(i);
    var index = Math.round(arr.length * fraction);
    return arr[index];
}
