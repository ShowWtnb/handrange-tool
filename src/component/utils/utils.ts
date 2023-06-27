import React from "react";

export function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
}

/// https://tech-blog.s-yoshiki.com/entry/144#%E7%B5%84%E3%81%BF%E5%90%88%E3%82%8F%E3%81%9B---combination
export function combinations(list: any, k: number): any {
    let res = [];
    if (list.length < k) {
        return [];
    }
    if (k === 1) {
        for (let i = 0; i < list.length; i++) {
            res[i] = [list[i]];
        }
    } else {
        for (let i = 0; i < list.length - k + 1; i++) {
            let row = combinations(list.slice(i + 1), k - 1);
            for (let j = 0; j < row.length; j++) {
                res.push([list[i]].concat(row[j]));
            }
        }
    }
    return res;
};
export function permutation(list: any, k: number): any {
    let res = [];
    if (list.length < k) {
        return [];
    }
    if (k === 1) {
        for (let i = 0; i < list.length; i++) {
            res[i] = [list[i]];
        }
    } else {
        for (let i = 0; i < list.length; i++) {
            let parts = list.slice(0);
            parts.splice(i, 1)[0];
            let row = permutation(parts, k - 1);
            for (let j = 0; j < row.length; j++) {
                res.push([list[i]].concat(row[j]));
            }
        }
    }
    return res;
};

export function nCr(n: number, r: number): number {
    if (r == 0 || r == n) {
        return 1;
    } else if (r == 1) {
        return n;
    }

    return nCr(n - 1, r) + nCr(n - 1, r - 1);
}
export function nPr(n: number, r: number): number {
    if (r == 0) {
        return 1;
    }

    return n * nPr(n - 1, r - 1);
}
export function factorial(n: number): number {
    if (n == 0) {
        return 1;
    }
    return n * factorial(n - 1);
}