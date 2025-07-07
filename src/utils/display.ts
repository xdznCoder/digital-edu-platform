const displayMap = {
    'stage': ['未初始化状态', '棋盘赛', '提案赛'],
    'chessPhase': ['上传成绩阶段', '上传领地阶段', '走棋', '结算']
}

const colorMap = {
    'stage': ['orange', 'red', 'green'],
    'chessPhase': ['blue', 'orange', 'red', 'green']
}

const teamColorMap = [
    '#6675ce',
    '#99CCFF',
    '#FFCC99',
    '#FF9999',
    '#96bb70',
    '#b6b653',
    '#CC99FF',
    '#69b08c',
    '#FFB266',
    '#FF99CC',
    '#B2FF66',
    '#FFE699',
    '#99FFFF',
    '#CCCCFF',
    '#FFCCE5'
]

export function displayTrans(type: 'stage' | 'chessPhase', code: number): string {
    return displayMap[type][code]
}

export function colorTrans(type: 'stage' | 'chessPhase', code: number): string {
    return colorMap[type][code]
}

export function teamColorTrans(teamId: number): string {
    return teamColorMap[teamId - 1]
}
