const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const config = getDefaultConfig(__dirname)

// 僅在 Web 平台將原生專用的 react-native-maps 替換為輕量 stub，
// 讓 Expo Web 可順利打包以供預覽/截圖；原生 (iOS/Android) 不受影響。
const defaultResolveRequest = config.resolver.resolveRequest
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'react-native-maps') {
    return {
      type: 'sourceFile',
      filePath: path.resolve(__dirname, 'web-stubs/react-native-maps.js'),
    }
  }
  const resolver = defaultResolveRequest || context.resolveRequest
  return resolver(context, moduleName, platform)
}

module.exports = config
