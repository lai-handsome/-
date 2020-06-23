export default function deepClone(obj, hash = new WeakMap()) { //深拷贝

    if (obj == undefined) return undefined //这里判定了obj是null，或undefined

    if (typeof obj !== 'object') return obj //这里判定了obj不是对象，可能只是数字或字符串

    if (obj instanceof Date) return new Date(obj)

    if (obj instanceof RegExp) return new RegExp(obj)
        //通过以上判断 obj就是 Array 或 object

    let val = hash.get(obj) //如果有这个obj,直接返回，如果没有会返回undefined
    if (val) { //如果有这个值，说明这个对象被拷贝过了，直接返回，递归的终止条件
        return val
    }
    let cloneObj = new obj.constructor
    hash.set(obj, cloneObj) // 创建一个键值对，把拷贝过的对象存起来

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) { // 只要实例上的属性，不包括prototype里的属性和方法
            cloneObj[key] = deepClone(obj[key], hash) //传个hash,每次都用一个表，用来检测是否重复拷贝； 防止obj={ a: 1}, obj.b = obj，这样会报Maximum call stack size exceeded，超过最大调用堆栈大小
        }
    }
    return cloneObj

}