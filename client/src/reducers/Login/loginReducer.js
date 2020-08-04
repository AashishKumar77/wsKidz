// let user = JSON.parse(localStorage.getItem('user'))
// const initialState = user ? { isLogin: true, user } : {}

export function loginReducer(state = {}, action) {
    switch (action.type) {
        case 'LOGIN_REQUEST':
            return { loggingIn: true };
        case 'LOGIN_SUCCESS':
            return { isLogin: true };
        case 'LOGIN_FAILURE':
            return {};
        default:
            return state
    }
}
