import request from '@/request'

const { post, get } = request

export const login = post('/login')
export const getAreaOptions = get('/getAreaOptions')