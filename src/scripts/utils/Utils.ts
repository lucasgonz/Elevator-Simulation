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
