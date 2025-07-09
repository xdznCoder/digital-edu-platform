import {BaseURL, request} from "@/api/request";
import axios from "axios";
import {ApiMap} from "@/api/type";

export const user = {
    PasswordLogin: (email: string, password: string) => request({
        url: '/user/login',
        method: 'POST',
        data: {username: email, password: password, email: '', emailCode: '', loginType: 1}
    }),
    CaptchaLogin: (email: string, code: string) => request({
        url: '/user/login',
        method: 'POST',
        data: {username: '', password: '', email: email, emailCode: code, loginType: 0}
    }),
    SendEmail: (email: string) => request({
        url: '/user/sendCode',
        method: 'GET',
        data: {identifier: email}
    }),
    Register: (input: {username: string, password: string, nickname: string, avatar: string, email: string, type: number, code: string}) => request({
        url: '/user/regist',
        method: 'POST',
        data: input
    }),
    GetUserInfo: () => {
        const info = window.localStorage.getItem('user')
        if (!info) return null
        return JSON.parse(info) as { id: string, username: string, nickname: string, avatar: string, type: number, token: string }
    }
}

export const classes = {
    ClassList: (pageNum: number, pageSize: number, key: string) => request({
        url: '/class/list',
        method: 'GET',
        data: {pageNum, pageSize, key},
        withToken: true
    }),
    NewClass: (code: string) => request({
        url: '/class',
        method: 'GET',
        data: {code},
        withToken: true
    }),
    ClassDetail: (id: number) => request({
        url: "/class/:id",
        method: 'GET',
        pathParam: {id},
        withToken: true
    }),
    DeleteClass: (id: number) => request({
       url: '/class/:id',
       method: 'DELETE',
       pathParam: {id},
       withToken: true
    }),
    StudentList: (cid: number, pageNum: number, pageSize: number, key: string) => request({
        url: '/class/student/list',
        method: 'GET',
        data: {cid, pageNum, pageSize, key},
        withToken: true
    }),
    DeleteStudent: (ids: Array<number>) => request({
        url: '/class/student',
        method: 'DELETE',
        data: ids,
        withToken: true
    }),
    UploadStudent: (id: number, file: File) => request({
        url: '/class/upload',
        method: 'POST',
        data: {id, file},
        withToken: true,
        withFormData: true,
    }),
    UploadStudentSingle: (cid: number, sno: string, name: string) => request({
        url: '/class/upload/single',
        method: 'POST',
        data: {cid, sno, name},
        withToken: true
    }),
}

export const team = {
    DownloadTeamFile: (memberCount: number) => axios.get(BaseURL + '/team/template', {
        responseType: 'blob',
        method: 'GET',
        params: {memberCount},
    }) as Promise<{data: Blob}>,
    TeamList: (id: number) => request({
        url: '/team/game/:id',
        method: "GET",
        pathParam: {id},
        withToken: true
    })
}

export const game = {
    UploadTeam: (file: File, teamNum: number, studentNum: number, teamMemberCount: number, cid: number) => request({
        url: '/game/upload',
        method: 'POST',
        data: {file, teamNum, studentNum, teamMemberCount, cid},
        withFormData: true,
    }),
    GameList: (cid: number) => request({
        url:'/game/list/:cid',
        method: 'GET',
        pathParam: {cid},
        withToken: true
    }),
    InitGame: (gameId: number,totalTiles: number,blackSwampTiles: number[],blindBoxTiles: {tileId: number, eventType: number}[],fortressTiles: {tileId: number,gameType: number}[],goldCenterTiles: number[],opportunityTiles: number[]) => request({
        url: '/game/board/init',
        method: 'POST',
        data: {gameId, totalTiles, blackSwampTiles, blindBoxTiles, fortressTiles, goldCenterTiles, opportunityTiles},
        withToken: true
    }),
    GameStatus: (id: number) => request({
        url: '/game/status/:id',
        method: 'GET',
        pathParam: {id: id},
        withToken: true
    }),
    UploadGrade: (gameId: number, file: File) => request({
        url: '/game/upload/chess',
        method: 'POST',
        data: {gameId, file},
        withToken: true,
        withFormData: true,
    }),
    TileRank: (id: number) => request({
        url: '/game/rank/team/:id',
        method: 'GET',
        pathParam: {id},
        withToken: true
    }),
    UploadAssign: (gameId: number, teamAssignCount: Record<number, number>) => request({
        url: '/game/upload/assign',
        method: 'POST',
        data: {gameId, teamAssignCount},
        withToken: true
    }),
    GradeRank: (id: number) => request({
        url: '/game/xxt/rank/:id',
        method: 'GET',
        pathParam: {id},
        withToken: true
    }),
    UnselectedList: (gameId: number) => request({
        url: '/game/unselected/:gameId',
        method: 'GET',
        pathParam: {gameId},
        withToken: true
    }),
    TileSets: (gameId: number) => request({
        url: '/game/occupyStatus/:gameId',
        method: 'GET',
        pathParam: {gameId},
        withToken: true
    }),
    TileOccupy: (data: ApiMap['/game/tile/occupy']['req']) => request({
        url: '/game/tile/occupy',
        method: 'POST',
        data: data,
        withToken: true,
    }),
    SpecialList: (gameId: number) => request({
        url: '/game/special/list',
        method: 'GET',
        data: {gameId},
        withToken: true
    }),
    SubmitBlindBox: (data: ApiMap['/game/special/blind-box/settle']['req']) => request({
        url: '/game/special/blind-box/settle',
        method: 'POST',
        data: data,
        withToken: true
    }),
    SubmitFortress: (data: ApiMap['/game/special/fortress/settle']['req']) => request({
        url: '/game/special/fortress/settle',
        method: 'POST',
        data: data,
        withToken: true
    }),
    IndividualRank: (id: number) => request({
        url: '/game/rank/student/:id',
        method: 'GET',
        pathParam: {id},
        withToken: true
    })
}

export const proposal = {
    ProposalInit: (data: ApiMap['/proposal/init']['req']) => request({
        url: '/proposal/init',
        method: 'POST',
        data: data,
        withToken: true
    }),
    SubmitOrder: (data: ApiMap['/proposal/order']['req']) => request({
        url: '/proposal/order',
        method: 'POST',
        data: data,
        withToken: true
    }),
    ProposalList: (gameId: number, round: number) => request({
        url: '/proposal/list',
        method: 'GET',
        data: {gameId, round},
        withToken: true
    }),
    FirstProposal: (data: ApiMap['/proposal/upload/first']['req']) => request({
        url: '/proposal/upload/first',
        method: 'POST',
        data: data,
        withToken: true
    }),
    SecondProposal: (data: ApiMap['/proposal/upload/second']['req']) => request({
        url: '/proposal/upload/second',
        method: 'POST',
        data: data,
        withToken: true
    }),
    SubmitVote: (data: ApiMap['/proposal/vote']['req']) => request({
        url: '/proposal/vote',
        method: 'POST',
        data: data,
        withToken: true
    }),
    FirstUploadGrade: (gameId: number, file: File) => request({
        url: '/proposal/upload/first/xxt',
        method: 'POST',
        data: {gameId, file},
        withToken: true,
        withFormData: true
    }),
    KnockoutTeam: (gameId: number, teamIds: number[]) => request({
        url: '/proposal/outTeam',
        method: 'POST',
        data: {gameId, teamIds},
        withToken: true
    }),
    NeedScoreList: (gameId: number) => request({
        url: '/proposal/second/need',
        method: 'GET',
        data: {gameId},
        withToken: true
    }),
    EvaluateDebate: (data: ApiMap['/proposal/debate/evaluate']['req']) => request({
        url: '/proposal/debate/evaluate',
        method: 'POST',
        data: data,
        withToken: true
    }),
    ThirdProposal: (data: ApiMap['/proposal/upload/third']['req']) => request({
        url: '/proposal/upload/third',
        method: 'POST',
        data: data,
        withToken: true
    }),
    ThirdRank : (gameId: number) => request({
        url: '/proposal/rank/third',
        method: 'GET',
        data: {gameId},
        withToken: true
    }),
    SubmitBuzz: (gameId: number) => request({
        url: '/proposal/settle',
        method: 'GET',
        data: {gameId},
        withToken: true,
    }),
    BuzzSetScore: (data: ApiMap['/proposal/buzzed']['req']) => request({
        url: '/proposal/buzzed',
        method: 'POST',
        data: data,
        withToken: true
    }),
    AllRank: (gameId: number) => request({
        url: '/proposal/rank/all',
        method: 'GET',
        data: {gameId},
        withToken: true
    })
}
