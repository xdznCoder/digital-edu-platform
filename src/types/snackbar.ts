export class SnackBar {
    message: string;
    color: string;
    show: boolean;

    constructor() {
        this.message = '';
        this.color = 'info';
        this.show = false;
    }

    showSuccessMessage(message: string): void {
        this.show = true;
        this.message = message;
        this.color = 'green-lighten-1';
    }

    showErrorMessage(message: string): void {
        this.show = true;
        this.message = message;
        this.color = 'red-lighten-2';
    }
}
