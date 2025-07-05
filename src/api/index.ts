import {request} from "@/api/request";

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
    })
}
