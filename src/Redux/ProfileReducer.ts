import { GetProfileUserType, profileAPI, usersAPI } from '../Api/Api';
import { PostType, ProfilePageType } from './React_Redux_StoreType/types/StateType';
import { ActionsTypes } from './Redux_Store';
import { v1 } from 'uuid';
import { Dispatch } from 'redux';


const initialState: ProfilePageType = {
    postData: [
        {
            id: '1',
            message: 'hello how are you',
            likesCount: 12,
            img: '',
        },
    ],
    profileUsers: {
        aboutMe: '',
        contacts: {
            facebook: '',
            website: '',
            vk: '',
            twitter: '',
            instagram: '',
            youtube: '',
            github: '',
            mainLink: '',
        },
        lookingForAJob: false,
        lookingForAJobDescription: '',
        fullName: '',
        userId: 0,
        photos: {
            small: '',
            large: ''
        },
    },
    status: '',
}


export function ProfileReducer(state = initialState, action: ActionsTypes): ProfilePageType {
    switch (action.type) {
        case 'PROFILE/ADD-POST':
            const postNew: PostType = {
                id: v1(),
                message: action.newMessage,
                likesCount: 0,
                img: state.profileUsers?.photos?.small
            }
            return {...state, postData: [postNew,...state.postData]}

        case 'PROFILE/SET-PROFILE-USER':
            return {...state, profileUsers: action.profile}

        case 'PROFILE/SET-PROFILE-STATUS':
            return {...state, status: action.status}

        case 'PROFILE/DEL-POST-PROFILE':
            return {...state, postData: state.postData.filter((f) => f.id !== action.id)}

        case 'PROFILE/UPDATE-PHOTO-USER':
            return {...state, profileUsers: {...state.profileUsers , photos: action.photo}}
        default:
            return state
    }
}

export const addPost = (newMessage: string) => ({type: 'PROFILE/ADD-POST', newMessage} as const)

export const setProfileUser = (profile: GetProfileUserType) => ({type: 'PROFILE/SET-PROFILE-USER', profile} as const)

export const setProfileStatus = (status: string) => ({type: 'PROFILE/SET-PROFILE-STATUS', status} as const)

export const deletePost = (id: string) => ({type: 'PROFILE/DEL-POST-PROFILE', id} as const)

export const updatePhoto = (photo: {small:string,large:string}) => ({type: 'PROFILE/UPDATE-PHOTO-USER', photo} as const)

export const getUserProfileThunk = (userId: number) => {
    return (dispatch: Dispatch) => {
        usersAPI.userIdAPI(userId)
            .then(response => {
                dispatch(setProfileUser(response.data))
            })
    }
}


export const updProfileDataThunk = (data:GetProfileUserType) => {
    return (dispatch: Dispatch) => {
        profileAPI.updateProfileData(data)
            .then(response => {
                if (response.resultCode === 0) {
                    dispatch(setProfileUser(response.data))
                }
            })
    }
}
export const getStatusThunk = (userId: number) => {
    return (dispatch: Dispatch) => {
        profileAPI.getStatus(userId)
            .then(response => {
                    dispatch(setProfileStatus(response.data))
            }).catch( () => {
                alert('err status')
        })
    }
}

export const updateStatusThunk = (status: string) => {
    return (dispatch: Dispatch) => {
        profileAPI.updateStatus(status)
            .then(response => {
                if (response.data.resultCode === 0) {
                    dispatch(setProfileStatus(status))
                }
            })
    }
}
export const updatePhotoThunk = (photo:string) => (dispatch:Dispatch) => {
    profileAPI.updPhoto(photo)
        .then(response => {
            if (response.data.resultCode === 0) {
                dispatch(updatePhoto(response.data.data.photos))
            }
        }).catch(err => {
            alert(err.data.message)
    })
}