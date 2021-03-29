export function range(n: number): Array<number> {
    return Array(n)
        .fill(0)
        .map((e, i) => i + 1);
}
