import Mock from 'mockjs'
import city from './city.json'
import service from './service.json'
import photographers from './photographers.json'


Mock.mock('/mock/area/area1', city)
Mock.mock('/mock/service-cat', service)

Mock.mock('/mock/get-service-data', service)

Mock.mock('/mock/search/photographer', 'post', (options) => {
  return photographers
})

