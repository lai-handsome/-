// import { Message } from 'element-ui'
export const toDecimals = (value) => {
    value = value.replace(/[^\d.]/g, "")
    value = value.replace(/\.{2,}/g, ".")
    let index = value.indexOf(".")
    if (index < 0 && value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额    
        value = parseFloat(value);
    } else if (index > 0 && value.indexOf('.', index + 1) > 0) {
        let i = value.indexOf('.', index) - 1
        value = value.substring(0, value.length - 1)
    }
    if (typeof value === 'string' && value.split('.').length > 2) {
        value = value.split('.')[0]
        // Message({
        //     message: '请输入或复制正确的格式的数字',
        //     type: 'error',
        //     showClose: true,
        // })
    }
    return value
}

export const toInt = (value) => {
    value = value.replace(/[^\d]/g, '')
    if (value != '') {
        value = parseFloat(value);
    }
    return value
}