import { Module } from 'vuex';

const snackBarModule: Module<{ snackBar: SnackBar }, any> = {
    namespaced: true,
    state: () => ({
        snackBar: new SnackBar()
    }),
    mutations: {
        SHOW_SUCCESS(state, message: string) {
            state.snackBar.showSuccessMessage(message);
        },
        SHOW_ERROR(state, message: string) {
            state.snackBar.showErrorMessage(message);
        }
    },
    actions: {
        showSuccess({ commit }, message: string) {
            commit('SHOW_SUCCESS', message);
        },
        showError({ commit }, message: string) {
            commit('SHOW_ERROR', message);
        }
    },
    getters: {
        snackBar: (state) => state.snackBar
    }
};

export default snackBarModule;

class SnackBar {
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


