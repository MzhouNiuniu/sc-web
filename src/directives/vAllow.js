import Vue from 'vue'
import store from '@/store'

export function hasPerms (key) {
    if (key === 'public') {
        return true
    }
    // return true

    const perms = store.state.user.info.perms
    if (Array.isArray(key)) {
        return key.some(v => perms.hasOwnProperty(v))
    }

    return perms.hasOwnProperty(key)
}

Vue.prototype.$hasPerms = hasPerms

Vue.directive('allow', {
    // bind (el, binding) {
    //     if (!hasPerms(binding.value)) {
    //         el.style.display = 'none'
    //     }
    // },
    inserted (el, binding) {
        if (!hasPerms(binding.value)) {
            el.parentNode.removeChild(el)
        }
    },
})

/**
 * 一般方式：v-allow="'controller-update'"
 * 推荐方式：v-if="$hasPerms('sfWork-set-operation')"
 * 暂时无法实现v-if这种内置指令
 * */

/*
这个好用一点。。
<Allow prop="role-save">
    <el-button type="primary" size="mini">保存</el-button>
</Allow>
*/
Vue.component('Allow', {
    functional: true,
    props: {
        prop: [String, Array],
    },
    render (h, { props, children }) {
        if (!hasPerms(props.prop)) {
            return null
        }

        return children
    },
})
