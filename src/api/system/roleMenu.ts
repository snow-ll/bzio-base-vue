import request, { AjaxResponse } from "@/api/request";

export const queryMenuIds = (roleId: string | undefined) : Promise<AjaxResponse<any>> => {
    return request({
        url: '/system/roleMenu/queryMenuIds',
        params: {
            roleId: roleId
        }
    })
}
