export class eventTip {
    show: boolean
    title: string
    time: number

    constructor(time?: number) {
        this.show = false
        this.title = ""
        this.time = time ?? 2000
    }

    showEventTip(title: string): void {
        this.show = true
        this.title = title
        setTimeout(() => {
            this.show = false
        }, this.time)
    }
}
