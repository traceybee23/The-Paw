const LOAD_USER = 'users/LOAD_USER'
const LOAD_USER_IMAGES = 'users/LOAD_USER_IMAGES'


export const loadUser = (user) => (
    // console.log("hitting action"),
    {
    type: LOAD_USER,
    user
})

export const loadUserPhotos = (userImages) => (
    console.log("hitting action"),
    {
    type: LOAD_USER,
    userImages
})


// THUNK

export const getUser = (userId) => async (dispatch) => {
    const res = await fetch(`/api/users/${userId}`)
    // console.log("hitting thunk in users")

    if(!res.ok) {
        return res;
    } else if (res.ok) {
        const user = await res.json();
        dispatch(loadUser(user))
        return user;
    }
}

export const getUserImages = (userId) => async (dispatch) => {
    const res = await fetch(`/api/users/${userId}/images/all`)
    console.log("hitting thunk in users")

    if(!res.ok) {
        return res;
    } else if (res.ok) {
        const userImages = await res.json();
        dispatch(loadUser(userImages))
        return userImages;
    }
}


// REDUCER

const userReducer = (state = {}, action) => {
    console.log("hitting reducer")
    switch (action.type) {
        case LOAD_USER: {
            return {...state, [action.user.id]: action.user }
            // const userState = {};
            // userState[user.id]
        }
        case LOAD_USER_IMAGES: {
            // console.log("hittin images reducer case")
            return {...state, [action.user['images'].id] : action.userImages}
            // const userState = {};
            // userState[user.id]
        }
        default:
            return { ...state }
    }
}

export default userReducer;
