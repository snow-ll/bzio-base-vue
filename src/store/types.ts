import { UserState } from '@/store/modules/user'
import { DictState } from '@/store/modules/dict'
import { RouterState } from '@/store/modules/router'
import { ComponentsState } from '@/store/modules/components'

export interface RootState {
    user: UserState
    dict: DictState
    router: RouterState
    components: ComponentsState
}
