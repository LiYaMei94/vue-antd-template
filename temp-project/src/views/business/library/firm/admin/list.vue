<template>
  <div>
    <CustomDrawer :width="1210" placement="right" :visible="visible" title="分配管理员" v-bind="{ onOk: onSubmit, onCancel: close }">
      <div class="firm-admin-container">
        <div class="table-header">
          <div class="table-header-left">
            <span class="company-name">{{ currentCompant?.companyName || '' }}</span>
          </div>
          <div class="table-header-right">
            <!-- 刷新表格 -->
            <a-button type="primary" ghost @click="handleOpen({ type: CREATE })">
              <div style="display: flex; align-items: center">
                <IconSvg name="add-circle" style="width: 16px; height: 16px; margin-right: 5px; fill: var(--private-primary-color)"></IconSvg>
                新增人员
              </div>
            </a-button>
            <a-button type="primary" @click="handleOpenAppoint" class="margin-left-16">
              <div style="display: flex; align-items: center">
                <IconSvg name="table-setting" style="width: 16px; height: 16px; margin-right: 5px"></IconSvg>
                企业选人
              </div>
            </a-button>
          </div>
        </div>
        <a-table :dataSource="tableData" :columns="adminTableColumns" rowKey="userId" :pagination="false">
          <template #bodyCell="{ record, column, index }">
            <template v-if="column?.dataIndex === 'companyRoleList'">
              <a-tree-select
                :value="getValue(record)"
                style="width: 100%"
                placeholder="请选择"
                tree-checkable
                :max-tag-count="maxTagCount"
                :tree-data="record?.companyRoleList || []"
                :fieldNames="{ label: 'roleName', value: 'roleId', children: 'children' }"
                :treeDefaultExpandAll="true"
                :treeDefaultExpandedKeys="['0']"
                @change="handleChange($event, record, index)"
                @dropdownVisibleChange="dropdownVisibleChange($event, record, index, column)"
              >
                <template #maxTagPlaceholder="omittedValues">
                  <span style="color: red">+ {{ omittedValues.length }} ...</span>
                </template>
              </a-tree-select>
            </template>
            <template v-if="column?.dataIndex === 'action'">
              <ActionButtonCol v-bind="{ maxLength: 3 }">
                <DeleteButton v-bind="{ ...deleteButtonProps(record) }" style="width: 100%"></DeleteButton>
              </ActionButtonCol>
            </template>
          </template>
        </a-table>
      </div>
      <template #footer>
        <div class="ant-drawer-footer-custom">
          <a-button @click="close">关闭</a-button>
        </div>
      </template>
    </CustomDrawer>
    <Edit v-bind="{ ...unref(state), close: closeEdit }" v-if="state.type"></Edit>
    <AppointAdmin v-bind="{ ...unref(appointState), close: appointClose }" v-if="appointState.visible"></AppointAdmin>
  </div>
</template>

<script lang="jsx" setup>
import { ref, watch, reactive, unref, toRefs, computed, onMounted } from 'vue';
import { CREATE, EDIT, DETAIL } from '@/utils/const';
import { deleteCallBack, isNull } from '@/utils/utils';
import { companyDetail } from '@/api/business/company';
import { companyAdminList, companyAdminDelete, companyRolelList, companyAdminAssignRole } from '@/api/business/companyAdmin';
import { adminTableColumns } from './config/column';
import Edit from './edit.vue';
import AppointAdmin from './appoint.vue';
import _ from 'lodash';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  close: {
    type: Function,
    default: null
  },
  companyId: {
    type: [String, Number] //companyId
  }
});
// 新增管理员
const state = reactive({
  type: '',
  companyId: props.companyId,
  visible: false
});
// 企业选人
const appointState = reactive({
  companyId: props.companyId,
  visible: false
});
const maxTagCount = ref(1);
const currentCompant = ref({});
const tableData = ref([]);
const onSubmit = () => {};
const deleteButtonProps = (record) => {
  const { userName, userId } = record || {};
  return {
    title: `您确定删除“${userName}”管理员?`,
    content: `请确保所选人员是否存在【管理员角色】，移除企业管理人员不会影响该人员角色`,
    deleteRequest: () => handleDelete(userId)
  };
};
const getValue = (record) => {
  let selectEd;
  if (record?.companyRoleList[0]?.children) {
    //初次请求管理员列表拿到的record?.companyRoleList[0]是一个没有children属性的对象，点击下来动态请求某个user的角色列表后修改了record?.companyRoleList[0]
    selectEd = _.filter(record?.companyRoleList[0]?.children, (item) => {
      return !isNull(item.isTick) ? item?.isTick : true;
    });
  } else {
    selectEd = _.filter(record?.companyRoleList, (item) => {
      return !isNull(item.isTick) ? item?.isTick : true;
    });
  }
  return _.map(selectEd, 'roleId');
};
const handleChange = (event, record, index) => {
  assignRoleToAdmin(event, record, index);
};
const assignRoleToAdmin = async (event, record, index) => {
  try {
    await companyAdminAssignRole({ userId: record?.userId, roleIds: event });
    companyRolelList({ userId: record.userId }).then((detail) => {
      const totalData = [
        {
          roleName: '公司角色',
          roleId: '0',
          children: detail?.data?.length ? detail?.data : []
        }
      ];
      tableData.value.splice(index, 1, { ...tableData.value[index], companyRoleList: totalData || [] });
    });
  } catch (error) {
    console.error('firm-admin-role-assign', error);
  }
};
const dropdownVisibleChange = (event, record, index, column) => {
  console.log('event', event);
  if (event) {
    getCompanyRolelList(record, index);
  }
};
//新增管理人员
const handleOpen = ({ type }) => {
  state.visible = true;
  state.type = type;
  //companyId默认就有，不需要再赋值
};
const handleOpenAppoint = () => {
  appointState.visible = true;
};
const closeEdit = (refresh = false) => {
  state.visible = false; //关闭子组件抽屉
  state.type = '';
  // props.close && props.close(); //如果关闭父级大抽屉，下次手动再打开，会重新请求管理员列表
  refresh && getCompanyAdminList(); //如果不关闭父级抽屉，就需要刷新管理员列表
};
const appointClose = (refresh = false) => {
  appointState.visible = false; //关闭子组件抽屉
  // props.close && props.close(refresh); //关闭父级大抽屉，下次手动再打开，会重新请求管理员列表
  refresh && getCompanyAdminList(); //如果不关闭父级抽屉，就需要刷新管理员列表
};
// 获取公司详情，后面也可以改成直接从父组件中传递record过来
const getDetail = async () => {
  try {
    const detail = await companyDetail({ companyId: props.companyId });
    currentCompant.value = detail?.data;
  } catch (error) {
    console.error('firm-getDetail', error);
  }
};
const treeDataMap = ref({});
// 获取公司管理员列表
const getCompanyAdminList = async () => {
  try {
    const detail = await companyAdminList({ companyId: props.companyId });
    tableData.value = detail?.data || [];
    // await getCompanyRolelList(detail?.data);
  } catch (error) {
    console.error('firm-admin-getAdminList', error);
  }
};
// 获取公司角色
const getCompanyRolelList = async (record, index) => {
  try {
    if (record.userId) {
      companyRolelList({ userId: record.userId }).then((detail) => {
        const totalData = [
          {
            roleName: '公司角色',
            roleId: '0',
            children: detail?.data?.length ? detail?.data : []
          }
        ];
        tableData.value.splice(index, 1, { ...tableData.value[index], companyRoleList: totalData || [] });
        // tableData.value[index]?.companyRoleList = totalData;
      });
    }
  } catch (error) {
    console.error('firm-admin-role-getFirmRoleList', error);
  }
};

/**
 * 删除并刷新列表
 * @param {*} id Array|Number|String
 * @returns
 */
const handleDelete = async (userId) => {
  try {
    let params = {
      companyId: props.companyId,
      userId
    };
    const result = await companyAdminDelete(params);
    deleteCallBack(result, '不能删除此数据').then((res) => props.companyId && getCompanyAdminList());
  } catch (error) {
    console.error('firm-admin-handleDelete', error);
  }
};
onMounted(async () => {
  try {
    props.companyId && (await getDetail());
    props.companyId && (await getCompanyAdminList());
  } catch (error) {
    console.error('firm-getDetail-onMounted', error);
  }
});
</script>
<style lang="less" scoped>
.firm-admin-container {
  padding: 16px;
  border: 1px solid var(--private-bg-2);
}
.table-header {
  width: 100%;
  padding-bottom: 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  .table-header-left {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex: 1;
    .company-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--private-first-text-color);
    }
  }
  .table-header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
