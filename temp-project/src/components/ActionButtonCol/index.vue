<template>
  <a-space :size="8" class="action-button-col">
    <div :ref="divButtonRef" class="a-space-custom">
      <!-- :style="{ 'grid-template-columns': `repeat(${len <= maxLength ? maxLength : maxLength - 1}, 1fr)` }" -->
      <slot />
    </div>
    <a-popover title="" :placement="placement" overlayClassName="action-button-col-dropdown">
      <template #content>
        <div :ref="popoverRef" class="action-button-col-popover-content">
          <slot />
        </div>
      </template>
      <a-button v-show="isFold" type="link" @click.prevent class="action-more-button">
        <IconSvg name="ellipsis" class="ellipsis-icon"></IconSvg>
      </a-button>
    </a-popover>
  </a-space>
</template>
<script setup lang="jsx">
import { ref, onMounted, reactive, watch } from 'vue';
import _ from 'lodash';

const props = defineProps({
  maxLength: {
    type: Number,
    default: 3
  },
  placement: {
    type: String,
    default: 'bottomRight'
  },
  rowNumber: {
    type: Number,
    default: 3
  }
});

const isFold = ref(false);
const refDom = reactive({});
const popoverItemRef = ref([]);
const buttonItemRefs = [];
const len = ref(0);

onMounted(() => {
  domInit();
});

const popoverRef = (el) => {
  if (el) {
    popoverItemRef.value = el.children;
  }
};

watch(popoverItemRef, (val) => {
  popoverRender(val);
});

const divButtonRef = (el) => {
  if (el) {
    buttonItemRefs.push(el);
  }
};

const domInit = () => {
  // 所有的子元素
  const allChildren = buttonItemRefs?.length > 0 ? buttonItemRefs[0]?.children : [];
  // 在外层展示的元素
  const showChildren = _.filter(allChildren, (item) => item.style.display != 'none');
  len.value = showChildren?.length;

  if (props.maxLength) {
    isFold.value = showChildren?.length > props.maxLength;
    const isLen = showChildren?.length === props.maxLength ? props.maxLength : props.maxLength - 1;
    for (let i = 0; i < showChildren?.length; i++) {
      const child = showChildren[i];
      child.style.display = i >= isLen ? 'none' : 'inline-block';
    }
  }
};

const popoverRender = (children) => {
  // 在外层展示的元素
  const showChildren = _.filter(children, (item) => item.style.display != 'none');
  const isLen = showChildren?.length === props.maxLength ? props.maxLength : props.maxLength - 1;
  for (let i = 0; i < showChildren?.length; i++) {
    const child = showChildren[i];
    child.style.display = i < isLen ? 'none' : 'inline-block';
  }
};
</script>

<style lang="less">
.action-button-col {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  .a-space-custom {
    // display: grid;
    // grid-gap: 0px 8px; //行间距 列间距
    display: flex;
    justify-content: space-between;
  }
  .ant-btn,
  .a-button {
    padding: 0px 4px;
    height: 20px;
    line-height: 20px;
  }
  .action-more-button {
    display: flex;
    align-items: center;
    padding: 4px 0px;
  }
  .ellipsis-icon {
    width: 12px;
    height: 16px;
    fill: var(--ant-primary-color);
  }
}
.action-button-col-popover-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.action-button-col-dropdown {
  width: var(--action-button-col-dropdown);
  .ant-popover-inner-content {
    padding: 5px 0px;
  }
  .ant-btn:hover,
  .a-button:hover {
    background-color: var(--private-primary-color-1);
    color: var(--private-primary-color);
  }
  .a-button,
  .ant-btn {
    text-align: left;
    width: 100%;
    padding: 4px 16px 4px 4px;
    box-sizing: border-box;
  }
  .a-button {
    svg {
      margin-top: 4px;
    }
  }
}
.action-button-col-dropdown.ant-popover-placement-bottom,
.action-button-col-dropdown.ant-popover-placement-bottomLeft,
.action-button-col-dropdown.ant-popover-placement-bottomRight {
  padding-top: 0;
}
</style>
