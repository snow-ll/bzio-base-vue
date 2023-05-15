<template>
  <el-dialog
      :model-value="dialogVisible"
      :title="$t(`operate.${props.type}`) + $t('table.user')"
      width="40%"
      @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
      <el-row>
        <el-col :span="12" hidden="hidden">
          <el-form-item :label="$t('table.userId')" prop="userId">
            <el-input v-model="form.userId"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('table.username')" prop="username">
            <el-input v-model="form.username" v-bind:readonly="props.type !== 'add'"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="$t('table.nickname')" prop="nickname">
            <el-input v-model="form.nickname"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="props.type === 'add'">
        <el-col :span="12">
          <el-form-item :label="$t('table.password')" prop="password">
            <el-input type="password" v-model="form.password"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="$t('table.cPassword')" prop="cPassword">
            <el-input type="password" v-model="form.cPassword"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('table.birthday')" prop="birthday">
            <el-date-picker
                type="date"
                v-model="form.birthday"
                style="width: 100%"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="$t('table.sex')" prop="sex">
            <el-select v-model="form.sex">
              <el-option
                  v-for="dict in toRaw(store.getters.dict).get('sex_type')"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="Number(dict.dictValue)"
              >
                {{ dict.dictLabel }}
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('table.certificateType')">
            <el-input v-model="form.certificateType"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="$t('table.certificateNum')">
            <el-input v-model="form.certificateNum"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('table.mobileNumber')">
            <el-input v-model="form.mobileNumber"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="$t('table.phoneNumber')">
            <el-input v-model="form.phoneNumber"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('table.email')">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="$t('table.role') + $t('table.status')" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio
                  v-for="dict in toRaw(store.getters.dict).get('enable_type')"
                  :key="dict.dictValue"
                  :label="Number(dict.dictValue)"
              >
                {{ dict.dictLabel }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">
          {{ $t('operate.cancel') }}
        </el-button>
        <el-button type="primary" @click="handleSave">
          {{ $t('operate.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { save, info } from '@/api/system/user'
import { toRaw } from '@vue/reactivity'
import { isNull } from '@/util/object'
import { ElMessageBox } from 'element-plus'
import store from '@/store'

interface UserInfo {
  userId: string | undefined,
  username: string | undefined,
  nickname: string | undefined,
  password: string | undefined,
  cPassword: string | undefined,
  birthday: string | undefined,
  sex: string | undefined,
  certificateType: string | undefined,
  certificateNum: string | undefined,
  mobileNumber: string | undefined,
  phoneNumber: string | undefined,
  email: string | undefined,
  fax: string | undefined,
  status: number,
}

const props = defineProps({
  username: {
    type: String
  },
  type: {
    type: String
  }
})
const emits = defineEmits(['update:modelValue', 'init', 'reset'])
const formRef = ref<any>(null)
const form = ref<UserInfo>({
  userId: undefined,
  username: undefined,
  nickname: undefined,
  password: undefined,
  cPassword: undefined,
  birthday: undefined,
  sex: undefined,
  certificateType: undefined,
  certificateNum: undefined,
  mobileNumber: undefined,
  phoneNumber: undefined,
  email: undefined,
  fax: undefined,
  status: 0,
})
const rules = ref({
  username: [
    {required: true, trigger: "blur", message: "请输入您的账号"}
  ],
  nickname: [
    {required: true, trigger: "blur", message: "请输入您的昵称"}
  ],
  password: [
    {required: true, trigger: "blur", message: "请输入您的密码"}
  ],
  cPassword: [
    {required: true, trigger: "blur", message: "请确认您的密码"}
  ],
})

const initUser = async (username: string) => {
  const res = await info(username)
  if (!isNull(res.data)) {
    form.value = res.data
  }
}

const handleClose = () => {
  emits('reset')
  resetForm()
  emits('update:modelValue', false)
}

const handleSave = () => {
  formRef.value!.validate((valid: any) => {
    if(valid) {
      save(form.value).then(res => {
        handleClose()
        emits('init')
        ElMessageBox.alert(res.msg)
      })
    } else {
      return false
    }
  })
}

const resetForm = () => {
  form.value = {
    userId: undefined,
    username: undefined,
    nickname: undefined,
    password: undefined,
    cPassword: undefined,
    birthday: undefined,
    sex: undefined,
    certificateType: undefined,
    certificateNum: undefined,
    mobileNumber: undefined,
    phoneNumber: undefined,
    email: undefined,
    fax: undefined,
    status: 0,
  }
}

watch(
    () => props.username,
    () => {
      initUser(props.username!)
    },
    { deep: true, immediate: true }
)
</script>

<style scoped>
</style>
