
export default {
    init: function () {
        return new Promise((resolve, reject) => {
            // debugger
            // 如果已加载直接返回
            // 如果已加载直接返回
            if (typeof window.T !== 'undefined') {
                resolve(window.T)
                return true
            }
            window.onload = function () {
                console.log('地图脚本初始化成功...')
                // eslint-disable-next-line
                resolve(window.T)
            }

            // // 插入script脚本   el-icon-map-location

            // const scriptNode = document.createElement('script')
            // scriptNode.setAttribute('type', 'text/javascript')
            // scriptNode.setAttribute('src', TMapURL)
            // document.body.appendChild(scriptNode)
        })
    }
}