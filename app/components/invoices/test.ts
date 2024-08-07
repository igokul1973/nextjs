// you can write to stdout for debugging purposes, e.g.
// console.log('this is a debug message');

// function solution(A) {
//     // Implement your solution here
//     let max = 0;
//     const m = new Map();

//     for (let i = 0; i < A.length - 1; i++) {
//         const sum = A[i] + A[i + 1];
//         const isAdjacent = m.has(sum) ? i === m.get(sum).lastIndex : false;

//         !isAdjacent &&
//             (m.has(sum)
//                 ? m.set(sum, { number: m.get(sum).number + 1, lastIndex: i + 1 })
//                 : m.set(sum, { number: 1, lastIndex: i + 1 }));

//         if (max < m.get(sum).number) {
//             max = m.get(sum).number;
//         }
//     }
//     return max;
// }

// // must be 2
// console.log(solution([10, 1, 10, 1, 2, 2, 1, 0, 4]));
// // must be 3
// console.log(solution([10, 1, 3, 1, 2, 2, 1, 0, 4]));
// // must be 4
// console.log(solution([1, 2, 1, 2, 1, 2, 1, 2, 1]));
// // must be 2
// console.log(solution([9, 9, 9, 9, 9]));
// // must be 2
// console.log(solution([19, -9, 19, -9, 9]));

// interface MyInterface {
//     [key: string]: object | undefined | null | unknown;
// }

// function deNullifyObject<T extends Record<string, unknown>>(obj: T) {
//     let denullifiedEntity = obj;

//     if (typeof obj === 'object' && obj !== null) {
//         for (const key in obj) {
//             if (obj.hasOwnProperty(key)) {
//                 if (obj[key] === null) {
//                     denullifiedEntity = { ...denullifiedEntity, [key]: undefined };
//                 } else if (typeof obj[key] === 'object') {
//                     const subObj = obj[key] as T;
//                     if (!Object.values(subObj).length) continue;
//                     denullifiedEntity = { ...denullifiedEntity, [key]: deNullifyObject(subObj) };
//                 }
//             }
//         }
//     }

//     return denullifiedEntity;
// }

// const kk = {
//     l: null,
//     d: 'data',
//     k: {
//         p: null,
//         t: 't'
//     }
// };
// const denullifiedKK = deNullifyObject(kk);
// console.log(kk, denullifiedKK);

// function setValuesToUndefined<T>(obj: MyInterface<T>): MyInterface<T> {
//     if (typeof obj === 'object' && obj !== null) {
//         for (const key in obj) {
//             if (obj.hasOwnProperty(key)) {
//                 if (obj[key] === null) {
//                     obj[key] = undefined;
//                 } else if (typeof obj[key] === 'object') {
//                     const subObj = obj[key];
//                     setValuesToUndefined(subObj);
//                 }
//             }
//         }
//     }
//     return obj;
// }

// const denullifiedEntity = setValuesToUndefined(entity);

// const gett = (): { bla: { mua: string }; hua?: string } | null => {
//     return null;
// };

// const t = gett() ?? ({} as NonNullable<ReturnType<typeof gett>>);
// const {
//     bla: { mua },
//     ...z
// } = t;
// console.log(mua, z);
