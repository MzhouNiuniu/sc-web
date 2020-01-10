
import api from '@/utils/api.js';
import http from '@/utils/http.js'
export function setOptionLog(operateObj, operateType) {
      http.postJson(api.system.savelog, {
        module: 'PC',
        operateObj,
        operateType
      })
}