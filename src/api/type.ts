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
    '/class/{id}': {
        req: {id: number}
        resp: null
    }
}
