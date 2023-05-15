import { UserState } from '@/store/modules/user'
import { DictState } from '@/store/modules/dict'
import { RouterState } from '@/store/modules/router'

export interface RootState {
    user: UserState
    dict: DictState
    
    router: RouterState
}
