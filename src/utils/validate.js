export const mobilePhone = (rule, value, callback) => {

    if (value === '') {
        return callback(new Error('文本框不能为空'));

    } else {
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(value)) {
            callback(new Error('请输入正确的手机号'));;
        } else {
            callback();
        }
    }
    //   setTimeout(() => {
    //     if (!Number.isInteger(value)) {
    //       callback(new Error('请输入数字值'));
    //     } else {
    //       if (value < 18) {
    //         callback(new Error('必须年满18岁'));
    //       } else {
    //         callback();
    //       }
    //     }
    //   }, 1000);
};

export const noEmpty = (rule, value, callback) => {
    if (!Boolean(value)) {
        callback(new Error('文本框不能为空'));
    } else {
        callback();
    }
};

export const num = (rule, value, callback) => {
    if (value == '') {
        callback(new Error('文本框不能为空'))
    } else if (!/^[0-9]+$/g.test(value) && !/^[0-9]+\.?[0-9]+?$/g.test(value)) {
        callback(new Error('请输入正确的数字'))
    } else {
        callback()
    }
}

export const chinese = (rule, value, callback) => {

    if (!Boolean(value)) {
        callback(new Error('文本框不能为空'));
    }
    // else if (!/^[\u4e00-\u9fa5]+$/i.test(value)) {
    //     callback(new Error('请输入中文'))
    // }
    else {

        callback();
    }
};

export const validatePass = (rule, value, callback) => {
    // console.log(value, 'value');
    if (value == '') {
        callback(new Error('请输入密码'));
    } else {
        callback();
    }
    // console.log(callback, 'callback');
};