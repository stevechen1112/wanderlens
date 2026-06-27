// Web stub for react-native-maps（僅供 Expo Web 截圖/預覽使用；原生平台仍使用真實套件）
const React = require('react')
const { View } = require('react-native')

function MapView(props) {
  return React.createElement(View, props, props.children || null)
}
function Marker(props) {
  return React.createElement(View, props, props.children || null)
}
function Callout(props) {
  return React.createElement(View, props, props.children || null)
}
const PROVIDER_GOOGLE = 'google'

MapView.Marker = Marker
MapView.Callout = Callout
MapView.PROVIDER_GOOGLE = PROVIDER_GOOGLE

module.exports = MapView
module.exports.default = MapView
module.exports.Marker = Marker
module.exports.Callout = Callout
module.exports.PROVIDER_GOOGLE = PROVIDER_GOOGLE
