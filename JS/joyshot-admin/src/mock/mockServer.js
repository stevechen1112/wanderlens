import Mock from 'mockjs'
import city from './city.json'
import token from './token.json'
import photographer from './photographer.json'
import photographer_area from './photographer_area.json'
import photographer_feature from './photographer_feature.json'
import orders from './orders.json'


Mock.mock('/mock/get-city-data', city)
Mock.mock('/mock/get-capture-token', token)

Mock.mock('/mock/photographer/groupby', photographer_area)
Mock.mock('/mock/photographer/feature/1', photographer_feature)

Mock.mock('/mock/photographer/1/order', 'get', (options) => {
  return orders
})
Mock.mock('/mock/order/all', 'get', (options) => {
  return orders
})


Mock.mock('/mock/photographers', 'post', (options) => {
  return photographer
})
