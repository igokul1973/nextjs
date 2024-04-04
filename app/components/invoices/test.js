// you can write to stdout for debugging purposes, e.g.
// console.log('this is a debug message');

function solution(A) {
    // Implement your solution here
    let max = 0;
    const m = new Map();

    for (let i = 0; i < A.length - 1; i++) {
        const sum = A[i] + A[i + 1];
        const isAdjacent = m.has(sum) ? i === m.get(sum).lastIndex : false;

        !isAdjacent &&
            (m.has(sum)
                ? m.set(sum, { number: m.get(sum).number + 1, lastIndex: i + 1 })
                : m.set(sum, { number: 1, lastIndex: i + 1 }));

        if (max < m.get(sum).number) {
            max = m.get(sum).number;
        }
    }
    return max;
}

// must be 2
console.log(solution([10, 1, 10, 1, 2, 2, 1, 0, 4]));
// must be 3
console.log(solution([10, 1, 3, 1, 2, 2, 1, 0, 4]));
// must be 4
console.log(solution([1, 2, 1, 2, 1, 2, 1, 2, 1]));
// must be 2
console.log(solution([9, 9, 9, 9, 9]));
// must be 2
console.log(solution([19, -9, 19, -9, 9]));
