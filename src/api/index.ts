import request from '@/request'

const { post, get } = request

export const login = post('/login')
export const getAreaOptions = get('/getAreaOptions')
export const getVegetableOptions = get('/getVegetableOptions')
export const getPriceRangeOptions = get('/getPriceRangeOptions')
export const getAreaRangeOptions = get('/getAreaRangeOptions')
export const getBallOptions = get('/getBallOptions')