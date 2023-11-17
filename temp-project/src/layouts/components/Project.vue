<template>
  <div class="header-project" id="header-project">
    <div
      class="project-selected"
      :style="{ color: !isNull(selectInfo) ? 'var(--private-first-text-color)' : 'var(--private-not-optional-text-color)' }"
      @click="visible = !visible"
    >
      <IconSvg name="dropdown" class="dropdown-icon"></IconSvg>
      <div class="text-ellipsis">{{ !isNull(selectInfo) ? selectInfo?.title : '请选择项目' }}</div>
    </div>
  </div>
  <div id="selected-dropdown">
    <div class="fadeIn project-selected-dropdown" :style="{ left: `${selectedDropdownLeft}px`, display: visible ? 'block' : 'none' }">
      <div style="padding: 0 14px 10px 14px; box-sizing: border-box">
        <a-input v-model:value="searchValue" style="margin-bottom: 8px" placeholder="搜索" @pressEnter="handleSearch" @blur="handleSearch">
          <template #prefix>
            <SearchOutlined style="color: var(--private-third-text-color)" />
          </template>
        </a-input>
      </div>
      <a-tree
        :defaultExpandAll="true"
        :tree-data="treeData"
        v-model:selectedKeys="selectedKeys"
        :fieldNames="{ children: 'children', title: 'title', key: 'id' }"
        @select="handleSelect"
      >
        <template #title="{ title, id }">
          <div class="tree-node-content-wrapper">
            <div style="width: calc(100% - 40px)">
              <span v-if="title.indexOf(searchValue) > -1">
                {{ title.substr(0, title.indexOf(searchValue)) }}
                <span style="color: var(--ant-primary-color); background-color: var(--private-primary-color-1)">{{ searchValue }}</span>
                {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else>{{ title }}</span>
            </div>
            <CheckOutlined class="tree-node-selected-icon" v-show="id === selectedKeys[0]" />
          </div>
        </template>
      </a-tree>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue';
import { isNull, filterEnum } from '@/utils/utils';
import { useStore } from 'vuex';

const { dispatch } = useStore();
const selectedDropdownLeft = ref(340);
const selectedDropdown = ref(null);
const visible = ref(false);
const searchValue = ref(null);
const selectInfo = ref(null);
const selectedKeys = ref([]);

// TODO:数据
const treeData = ref([
  {
    id: 1,
    title: '分包商哈哈哈哈哈1',
    children: []
  },
  {
    id: 2,
    title: '分包商哈哈哈哈哈2',
    children: []
  },
  {
    id: 3,
    title: '分包商哈哈哈哈哈3',
    children: []
  },
  {
    id: 4,
    title: '分包商哈哈哈哈哈4',
    children: []
  },
  {
    id: 5,
    title: '分包商哈哈哈哈哈5'
  }
]);

onMounted(() => {
  try {
    const headerProjectNode = document.getElementById('header-project');
    const selectedDropdownNode = document.getElementById('selected-dropdown');
    const model = document.querySelector('.project-selected-dropdown');
    const projectSelected = document.querySelector('.project-selected');

    selectedDropdownLeft.value = headerProjectNode?.getBoundingClientRect()?.left;
    selectedDropdownNode && document.body.appendChild(selectedDropdownNode);

    // FIXME:点击弹窗外部区域关闭
    window.addEventListener('click', (event) => {
      if (!model?.contains(event.target) && !projectSelected.contains(event.target)) {
        model.style.display = 'none';
        visible.value = false;
      }
    });
  } catch (error) {
    console.error('layout-project-onMounted', error);
  }
});

// TODO:数据
const handleSearch = (event) => {
  console.log('event', event.target.value);
};

const handleSelect = (selectedKeys, event) => {
  // TODO:数据
  const project = filterEnum(selectedKeys[0], treeData.value, { value: 'id', label: 'title' }, 'group');
  selectInfo.value = project;
  dispatch('setProjectInfo', project);
};
</script>
<style lang="less">
.header-project {
  position: relative;
  .project-selected {
    display: flex;
    height: 30px;
    align-items: center;
    padding: 4px 8px;
    box-sizing: border-box;
    background-color: var(--private-bg-2);
    font-size: 14px;
    font-weight: 500;
    border-radius: 2px;
    cursor: pointer;
    border: 1px solid var(--private-form-border);
  }
  .dropdown-icon {
    width: 14px;
    height: 14px;
    margin-right: 8px;
    fill: var(--private-third-text-color);
  }
}
.project-selected-dropdown {
  position: absolute;
  background-color: var(--private-content-bg);
  top: 65px;
  min-width: 300px;
  max-width: 500px;
  border-radius: 2px;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  padding: 14px 0;
  box-sizing: border-box;
  z-index: 1050;
  display: none;

  .ant-tree .ant-tree-node-content-wrapper:hover {
    background-color: transparent;
    color: var(--private-primary-color);
  }
  .ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background-color: transparent;
    color: var(--private-primary-color);
  }
  .ant-tree-treenode.ant-tree-treenode-switcher-open {
    align-items: center;
    padding: 8px 24px 8px 0;
    width: 100%;
  }
  .ant-tree-treenode.ant-tree-treenode-switcher-open.ant-tree-treenode-selected {
    background-color: var(--private-primary-color-1);
    color: var(--private-primary-color);
  }
  .ant-tree .ant-tree-node-content-wrapper {
    width: 100%;
  }
  .tree-node-content-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;
    .tree-node-selected-icon {
      width: 40px;
      text-align: right;
    }
  }
  .ant-tree-list-holder-inner {
    max-height: 600px;
    overflow-y: scroll;
  }
}
</style>
