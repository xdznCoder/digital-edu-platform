function randomSplitHalf(data: number[]): [number[], number[]] {
    const copy = [...data]
    const result1: number[] = []
    const half = Math.floor(copy.length / 2)

    for (let i = 0; i < half; i++) {
        const index = Math.floor(Math.random() * copy.length)
        result1.push(copy[index])
        copy.splice(index, 1)
    }

    return [result1, copy]
}

export function blindBoxRandom(data: Array<number>): Array<{tileId: number, eventType: number}> {
    const split = randomSplitHalf(data)
    const output: Array<{tileId: number, eventType: number}> = []
    split[0].forEach(item => {
        output.push({tileId: item, eventType: 0})
    })
    const splitTwice = randomSplitHalf(split[1])
    splitTwice[0].forEach(item => {
        output.push({tileId: item, eventType: 1})
    })
    splitTwice[1].forEach(item => {
        output.push({tileId: item, eventType: 2})
    })
    return output
}

export function fortressRandom(data: Array<number>): Array<{tileId: number, gameType: number}> {
    const split = randomSplitHalf(data)
    const output: Array<{tileId: number, gameType: number}> = []
    split[0].forEach(item => {
        output.push({tileId: item, gameType: 0})
    })
    split[1].forEach(item => {
        output.push({tileId: item, gameType: 1})
    })
    return output
}

export function getOriginTileSet(): {
    blackSwampTiles: Array<number>,
    blindBoxTiles: Array<number>,
    fortressTiles: Array<number>,
    goldCenterTiles: Array<number>,
    opportunityTiles: Array<number>,
    origin: Array<number>
} {
    const blackSwampTiles: number[] = [22, 35, 53, 58, 120, 137, 138, 140, 141, 144, 157, 161, 191, 250, 257];
    const otIndex = Math.floor(Math.random() * blackSwampTiles.length);
    const opportunityTile = blackSwampTiles[otIndex];
    return {
        blackSwampTiles: blackSwampTiles.filter((_, i) => i !== otIndex),
        blindBoxTiles: [115, 135, 143, 162],
        fortressTiles: [51, 56, 219, 224],
        goldCenterTiles: [139],
        opportunityTiles: [opportunityTile],
        origin: [0, 6, 19, 21, 61, 62, 111, 165, 185, 228, 242, 266, 277, 279, 280, 282]
    }
}

export function splitThree(n: number): [number, number, number] {
    const base = Math.floor(n / 3)
    const remainder = n % 3

    const result = [base, base, base]

    for (let i = 0; i < remainder; i++) {
        result[i] += 1
    }

    return result as [number, number, number]
}
