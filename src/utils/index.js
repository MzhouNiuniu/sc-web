import baseURL from './baseURL'

/**
 * 获取uuid
 */
export function getUUID () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
    })
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
    return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
    var res = []
    var temp = {}
    for (var i = 0; i < data.length; i++) {
        temp[data[i][id]] = data[i]
    }
    for (var k = 0; k < data.length; k++) {
        if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
            if (!temp[data[k][pid]]['children']) {
                temp[data[k][pid]]['children'] = []
            }
            if (!temp[data[k][pid]]['_level']) {
                temp[data[k][pid]]['_level'] = 1
            }
            data[k]['_level'] = temp[data[k][pid]]._level + 1
            temp[data[k][pid]]['children'].push(data[k])
        } else {
            res.push(data[k])
        }
    }
    return res
}

export function checkPageLimit (selectArray = [], allArray = [], pageNo, totle) {
    if (pageNo <= 0) {
        console.error('pageNo is not less than 1')
    }
    if (pageNo === 1) {
        return 1
    }
    if (Array.isArray(selectArray) && Array.isArray(allArray)) {
        const totlePage = Math.ceil(totle / 8)
        if (selectArray.length === allArray.length && pageNo === totlePage) {
            return --pageNo
        } else {
            return pageNo
        }
    } else {
        console.error(' selectArray or allArray is not Array type')
    }
}

function add0 (m) {
    return m < 10 ? '0' + m : m
}

export function formatDate (needTime) {
    //needTime是整数，否则要parseInt转换
    var time = new Date(needTime)
    var y = time.getFullYear()
    var m = time.getMonth() + 1
    var d = time.getDate()
    var h = time.getHours()
    var mm = time.getMinutes()
    var s = time.getSeconds()
    return y + '年' + add0(m) + '月' + add0(d) + '日 ' + add0(h) + '时' + add0(mm) + '分' + add0(s) + '秒'
}

export function formatAfterTime (time) {
    // let timeS = time / 1000; // 秒
    let timeS = +time // 秒
    let tempString = ''
    // 多少年
    // if(timeS >= 31536000) {
    //   tempString = Math.floor(timeS/31536000) + '年';
    //   timeS = Math.floor(timeS % 31536000); // 除去年倍数的剩余秒数
    // } else {
    //   tempString = '00年'
    // }

    // if(timeS >= 2592000) {
    //   tempString += Math.floor(timeS/2592000) + '月';
    //   timeS = Math.floor(timeS % 2592000); // 除去月倍数的剩余秒数
    // } else {
    //   tempString += '00月'
    // }

    if (timeS >= 86400) {
        tempString += Math.floor(timeS / 86400) + '天'
        timeS = Math.floor(timeS % 86400) // 除去天数倍数的剩余秒数
    } else {
        tempString += '00天'
    }

    if (timeS >= 3600) {
        tempString += Math.floor(timeS / 3600) + '小时'
        timeS = Math.floor(timeS % 3600) // 除去时数倍数的剩余秒数
    } else {
        tempString += '00小时'
    }
    if (timeS >= 60) {
        tempString += Math.floor(timeS / 60) + '分钟'
        timeS = Math.floor(timeS % 60) // 除去时数倍数的剩余秒数
    } else {
        tempString += '00分钟'
    }
    tempString += timeS + '秒'
    return tempString
}

export function debounce (fn, wait = 300) {
    var timeout = null
    return function () {
        var args = arguments
        if (timeout !== null) clearTimeout(timeout)
        timeout = setTimeout(() => {
            fn.apply(this, args)
        }, wait)
    }
}

// copy 对应 `${baseURL.jky}/pc/menu/getAllMenusByOrganizationID`,
/**
 * @param {string} menuId - id是哪个字段
 * @param {boolean} isOnlyRouterMenu - 是否只展示路由级别的菜单
 * */
export function translateToTreeData (list, idField = 'menuId', isOnlyRouterMenu = false) {
    list = list.filter(item => item)  // todo 临时修复接口返回的null..

    // 在原数据上进行修改
    const idMapOfList = {}
    const idMapOfOperateList = {}
    list.forEach(item => {
        // 按钮集权限（只能通过perms字段存储）
        if (isOnlyRouterMenu && item.type === 2) {
            idMapOfOperateList[item.perms] = item
            return
        }
        idMapOfList[item[idField]] = item
    })

    // 页面排序
    for (let k in idMapOfList) {
        const item = idMapOfList[k]
        if (!idMapOfList[item.parentId]) {
            continue
        }
        idMapOfList[item.parentId].children ? idMapOfList[item.parentId].children.push(item) : idMapOfList[item.parentId].children = [item]
    }

    // 分配按钮
    for (let k in idMapOfOperateList) {
        const item = idMapOfOperateList[k]
        if (idMapOfList[item.parentId]) {
            const parent = idMapOfList[item.parentId]
            if (!parent) {
                continue
            }
            parent.children ? parent.children.push(item) : parent.children = [item]
        }
    }
    return list.filter(item => item.type === 0) // 返回0级的
}

export function showConvert (value) {
    let result = ''
    switch (value) {
        case 0:
            result = true
            break
        case 1:
            result = false
            break
        case true:
            result = 0
            break
        case false:
            result = 1
            break
        default:
            result = ''
            break
    }
    return result
}

export function checkIsAdmin (code = '') {
    return code.slice(-6) === '_admin'
}



