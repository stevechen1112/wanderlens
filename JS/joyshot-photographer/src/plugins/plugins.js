// custom plugins

import dayjs from "dayjs";
import i18n from '@/i18n'

export default {
    install(Vue) {
        // 格式化訂單時間，預設格式 YYYY-MM-DD HH:MM
        Vue.filter('fmtDateTime', function (value, fmt = 'YYYY-MM-DD HH:mm') {
            if (value === '' || value === null || typeof value === 'undefined') {
                return ""
            }
            return dayjs(value).format(fmt)
        })
        Vue.filter('fmtDate', function (value, fmt = 'YYYY-MM-DD') {
            if (value === '' || value === null || typeof value === 'undefined') {
                return ""
            }
            return dayjs(value).format(fmt)
        })

        Vue.filter('fmtMultiLine', function (value) {
            if (value === '' || value === null || typeof value === 'undefined') {
                return ""
            }
            return value.replaceAll("\n", "<br/>")
        })

        Vue.filter('withDash', function (value) {
            if (value === '' || value === null || typeof value === 'undefined') {
                return ""
            }
            if (value.indexOf(",") === -1) {
                return value
            }
            return value.replaceAll(",", "--")
        })

        Vue.filter('fmtTodoType', function (value) {

            let job = ''
            switch (value) {
                case 'for_product_sales':
                    job = "建材部"
                    break;
                case 'for_painting':
                    job = "彩繪部"
                    break;
                case 'for_district_manager':
                    job = "區域經理"
                    break;
                case 'for_brand_sales':
                    job = "品牌業務"
                    break;
                case 'for_oa_acct':
                    job = "會計"
                    break;
                case 'for_oa_adm':
                    job = "行政"
                    break;
                case 'for_oa_planning':
                    job = "企劃"
                    break;
                case 'for_fin_manager':
                    job = "財務經理"
                    break;
                case 'req_pay':
                    job = "請款單"
                    break;
                case 'req_buy':
                    job = "請購單"
                    break;
                case 'patty-cash':
                    job = "零用金請購單"
                    break;
                case 'req_item':
                    job = "用品請領單"
                    break;
                default:
                    job = ""
            }
            return job
        })

        Vue.filter('fmtPaymentMethod', function (value) {
            let status = ''
            switch (value) {
                case 'wire':
                    status = "匯款"
                    break;
                case 'cash':
                    status = "現金"
                    break;
                case 'checks':
                    status = "支票"
                    break;
                default:
                    status = ""
            }
            return status
        })

        Vue.filter('fmtPayArea', function (value) {
            let status = ''
            switch (value) {
                case 'payHQ':
                    status = "全區"
                    break;
                case 'payDistrict':
                    status = "區域"
                    break;
                default:
                    status = ""
            }
            return status
        })

        Vue.filter('signResult', function (value) {
            if (value === '' || value === null || typeof value === 'undefined') {
                return ""
            }
            if (value === 'N') return '退回'
            if (value === 'Y') return '同意'
            if (value === 'cancel') return '取消'
            if (value === 'invalid') return '作廢'
        })



        Vue.filter('fmtSignResult', function (value) {
            let status = ''
            switch (value) {
                case 'draft':
                    status = "draft"
                    break;
                case 'review':
                    status = "waiting review"
                    break;
                case 'close':
                    status = "complete"
                    break;
                case 'reject':
                    status = "reject"
                    break;
                case 'invalid':
                    status = "invalid"
                    break;
                default:
                    status = "未知狀態?"
            }
            return status
        })

        // 訂單狀態數字轉成代表文字
        Vue.filter('transformStatus', function (value) {
            let status = ''
            switch (value) {
                case 1:
                    status = "待付款"
                    break;
                case 2:
                    status = "已付款"
                    break;
                case 3:
                    status = "退款"
                    break;
                case 9:
                    status = "取消"
                    break;
                default:
                    status = "未知狀態?"
            }
            return status
        })

        Vue.filter('poStatus', function (value) {
            let status = ''
            switch (value) {
                case 'confirm':
                    status = "已簽回"
                    break;
                case 'review':
                    status = "待客戶確認"
                    break;
                case 'draft':
                    status = "編輯中"
                    break;
                case 'cancel':
                    status = "註銷"
                    break;
                default:
                    status = "未知狀態?"
            }
            return status
        })


        Vue.mixin({
            methods: {

                isImageValid(file) {
                  const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
                  const isLt2M = file.size / 1024 / 1024 < 2;
                  if (!isJPG) {
                    this.$message.error( i18n.tc('message.not_valid_image') );
                    // this.$message.error('限上傳 jpg、png 格式');
                  }
                  if (!isLt2M) {
                    this.$message.error( i18n.tc('message.file_size_exceed_2M') );
                    // this.$message.error('圖片大小超過 2M');
                  }
                  return isJPG && isLt2M;
                },
                isImage(fileName) {
                    if (fileName.indexOf('jpg') !== -1) { return true }
                    if (fileName.indexOf('jpeg') !== -1) { return true }
                    if (fileName.indexOf('png') !== -1) { return true }
                    if (fileName.indexOf('PNG') !== -1) { return true }
                    return false
                },
                displayAvatar(avatar) {
                    // console.log('displayAvatar:', process.env.VUE_APP_AVATAR_URL + "/" + avatar)
                    return process.env.VUE_APP_AVATAR_URL + "/" + avatar
                },
                showImage(uuid) {
                    return process.env.VUE_APP_AVATAR_URL + "/show/" + uuid
                },
                // 顯示訊息框(引用element-ui)
                showResult(msgType, msg) {
                    // this.$message({
                    //     type: msgType,
                    //     message: msg,
                    //     showClose
                    // })
                    if (msgType === 'error') {
                        this.$notify.error({
                            title: this.$t('message.error'),
                            message: msg,
                            position: 'top-right',
                            duration: 2000
                        });
                    }
                    if (msgType === 'success') {
                        this.$notify.success({
                            title: this.$t('message.success'),
                            message: msg,
                            position: 'top-right'
                        });
                    }
                },

                selectedCity(val) {
                    return this.$store.state.city.cityList.find(city => {
                        return city.id === val
                    })
                },

                //數字轉星期
                convertDayToWeek(day) {
                    switch (day) {
                        case 1:
                            return '一'
                        case 2:
                            return '二'
                        case 3:
                            return '三'
                        case 4:
                            return '四'
                        case 5:
                            return '五'
                        case 6:
                            return '六'
                        case 7:
                            return '日'
                        default:
                            return 'Unknown'
                    }
                },

                fmtNotes(notes) {
                  //console.log('fmtNotes:', notes)
                  if (typeof notes !== 'undefined' &&  notes !== '' &&  notes !== null) {
                    let displayNotes = notes.split("\n")
                    let result = "";
                    for(var i=0 ; i<displayNotes.length ; i++) {
                        result += displayNotes[i] + "<br/>"
                    }
                    return result
                  } else {
                      return notes
                  }

                },

                //取得經緯度
                checkGeocoder(city, districtName, address, callback){
                   //console.log(`checkGeocoder:${city}${districtName}${address}`)

                   // eslint-disable-next-line
                   const geocoder = new google.maps.Geocoder();
                   // GeocoderRequest 物件
                   const addr = {
                     address: `${city}${districtName}${address}`,
                     region: "TW"
                   }

                   geocoder.geocode( addr, (results, status)=> {
                     console.log('status:', status)
                     if (status === 'OK') {
                       let lat = results[0].geometry.location.lat()
                       let lng = results[0].geometry.location.lng()
                       callback({lat,lng})
                     } else {
                       this.showResult('error', '無法取得此地址的經緯座標，請重新輸入地址')
                     }
                   });
                }


            }
        })


    }
}

