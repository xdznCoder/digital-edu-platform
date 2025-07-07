export interface ApiMap {
    '/user/sendCode': {
        req: {identifier: string},
        resp: null
    },
    '/user/login': {
        req: {username: string, password: string, email: string, emailCode: string, loginType: number},
        resp: {
            id: string
            username: string
            nickname: string
            avatar: string
            type: number
            token: string
        }
    },
    '/user/regist': {
        req: {
            username: string
            password: string
            nickname: string
            avatar: string
            email: string
            type: number
            code: string
        },
        resp: null
    },
    '/class/list': {
        req: {pageNum: number, pageSize: number, key: string},
        resp: {
            list: Array<{
                id: number
                classCode: string
                courseId: number
                currentStudents: number
                status: number
                gmtCreate: string
                gmtModified: string
                tid: number
            }>
            total: number
            current: number
            size: number
            sizes: number
        }
    }
    '/class': {
        req: {code: string}
        resp: null
    },
    '/class/:id': {
        req: {id: number}
        resp: {
            id: number
            classCode: string
            courseId: number
            currentStudents: number
            status: number
            gmtCreate: string
            gmtModified: string
            isDeleted: number
            tid: number
        }
    } | {
        req: {id: number}
        resp: null
    },
    '/class/student/list': {
        req: {pageNum: number, pageSize: number,cid: number, key: string },
        resp: {
            list: Array<{
                sno: string
                name: string
                cid: number
                id: number
            }>
            total: number
            current: number
            size: number
            sizes: number
        }
    },
    '/class/student': {
        req: Array<number>
        resp: null
    },
    '/class/upload': {
        req: {id: number,file: File}
        resp: null
    },
    '/class/upload/single': {
        req: { sno: string, name: string, cid: number}
        resp: null
    },
    '/game/upload': {
        req: {
            file: File,
            teamNum: number
            studentNum: number
            teamMemberCount: number
            cid: number
        },
        resp: {
            teamNum: number,
            studentNum: number,
            successTeamNum: number,
            failTeamNum: number,
            successStudentNum: number,
            failStudentNum: number,
            addStudentNum: number,
            gameId: number
        }
    },
    '/game/list/:cid': {
        req: {cid: number},
        resp: Array<{
            id: number
            cid: number
            studentCount: number
            teamCount: number
            teamMemberCount: number
            stage: number
            chessRound: number
            chessPhase: number
            proposalStage: number
            proposalRound: number
            status: number
            lastSavedAt: string
            gmtCreate: string
            gmtUpdate: string
        }>
    },
    '/team/game/:id': {
        req: {id: number},
        resp: {
            teams: Array<{
                studentId:   number;
                studentName: string;
                studentSno:  string;
                isLeader:   boolean;
                }>;
            freeStudents: Array<{
                teamId:       number;
                leaderName:   string;
                leaderId:     number;
                totalMembers: number;
                members:      Array<{
                    studentId:   number;
                    studentName: string;
                    studentSno:  string;
                    isLeader:   boolean;
                }>;
                leaderSno:    string;
            }>;
        }
    },
    '/game/board/init': {
        req: {
            gameId:           number
            totalTiles:       number
            blackSwampTiles:  number[]
            blindBoxTiles:    {tileId: number, eventType: number}[]
            fortressTiles:    {tileId: number,gameType: number}[]
            goldCenterTiles:  number[]
            opportunityTiles: number[]
        }
        resp: null
    },
    '/game/status/:id': {
        req: {id: number},
        resp: {
            id:              number
            cid:             number
            studentCount:    number
            teamCount:       number
            teamMemberCount: number
            stage:           number
            chessRound:      number
            chessPhase:      number
            proposalStage:   number
            proposalRound:   number
            status:          number
            lastSavedAt:     string
            gmtCreate:       string
            gmtUpdate:       string
        }
    },
    '/game/upload/chess': {
        req: {gameId: number, file: File},
        resp: Array<{
            teamId:         number
            teamName:       string
            thisRoundScore: number
            submitTime:     string
        }>
    },
    '/game/rank/team/:id': {
        req: {id: number},
        resp: Array<{
            teamId:     number
            leaderName: string
            totalTile:  number
            leaderSno:  string
            totalScore: number
        }>
    },
    '/game/upload/assign': {
        req: {gameId: number, teamAssignCount: Record<number, number>},
        resp: null
    },
    '/game/xxt/rank/:id': {
        req: {id: number},
        resp: Array<{
            teamId:         number;
            teamName:       string;
            thisRoundScore: number;
            submitTime:     string;
        }>
    },
    '/game/unselected/:gameId': {
        req: {gameId: number},
        resp: Array<{
            teamId:      number
            leaderName:  string
            leaderId:    number
            sno:         string
            assignCount: number
        }>
    },
    '/game/occupyStatus/:gameId': {
        req: {gameId: number}
        resp: {
            totalTiles:       number
            blackSwampTiles:  number[]
            blindBoxTiles:    number[]
            fortressTiles:    number[]
            goldCenterTiles:  number[]
            opportunityTiles: number[]
            teams:            Array<{
                teamId:        number
                occupiedTiles: number[]
            }>
        }
    },
    '/game/tile/occupy': {
        req: {
            gameId: number
            teamId: number
            tileIds: number[]
            triggerBlindBox: boolean
            blindBoxTileIds: number[]
            triggerGoldCenter: boolean
            goldCenterTileId: number
            triggerChanceLand: boolean
            chanceLandTileId: number
            challengeSuccess: boolean
        }
        resp: null
    },
    '/game/special/list': {
        req: {gameId: number},
        resp: Array<{
            teamId: number
            unTriggeredTiles: Array<{
                tileId: number
                tileType: number
                eventType: number
                eventName: string
            }>
        }>
    },
    '/game/special/blind-box/settle': {
        req: {
            gameId: number
            teamId: number
            tileId: number
            eventType: number
            involvedTeamIds: number[]
            winnerTeamId: number
        },
        resp: null
    },
    '/game/special/fortress/settle': {
        req: {
            gameId: number
            tileId: number
            attackerTeamId: number
            defenderTeamId: number
            winnerTeamId: number
            gameType: number
        },
        resp: null
    }
}
