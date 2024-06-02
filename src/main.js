"use strict";
function delay(time, value) {
    return new Promise((res) => setTimeout(() => res(value), time));
}
function getFile(name) {
    return delay(400, { name, body: "...", size: 100 });
}
async function concurrent(limit, fs) {
    const result = [];
    for (let i = 0; i < fs.length / limit; i++) {
        const tmp = [];
        for (let j = 0; j < limit; j++) {
            const f = fs[i * limit + j];
            if (f) {
                tmp.push(f());
            }
        }
        result.push(await Promise.all(tmp));
    }
    return result.flat();
}
function* take(length, iterable) {
    const iterator = iterable[Symbol.iterator]();
    while (length-- > 0) {
        const { value, done } = iterator.next();
        if (done) {
            break;
        }
        yield value;
    }
}
function* chunk(size, iterable) {
    const iterator = iterable[Symbol.iterator]();
    while (true) {
        const arr = [
            ...take(size, {
                [Symbol.iterator]() {
                    return iterator;
                },
            }),
        ];
        if (arr.length)
            yield arr;
        if (arr.length < size)
            break;
    }
}
function* map(f, iterable) {
    for (const a of iterable) {
        yield f(a);
    }
}
async function fromAsync(iterable) {
    const arr = [];
    for await (const a of iterable) {
        arr.push(a);
    }
    return arr;
}
async function concurrent2(limit, fs) {
    const result = await fromAsync(map((ps) => Promise.all(ps), map((fs) => fs.map((f) => f()), chunk(limit, fs))));
    return result.flat();
}
(async function main() {
    console.time();
    const files = await concurrent2(3, [
        () => getFile("file1.png"),
        () => getFile("file2.png"),
        () => getFile("file3.png"),
        () => getFile("file4.png"),
        () => getFile("file5.png"),
        () => getFile("file6.png"),
        () => getFile("file7.png"),
    ]);
    console.log(files);
    console.timeEnd();
})();
