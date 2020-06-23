export function isAllSpace (str) { //判断字符串是否全是空格
    if (str == "") return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
}