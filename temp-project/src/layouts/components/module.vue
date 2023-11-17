<template>
  <div class="module-modal" :style="{ height: visible ? 'calc(100% - 65px)' : '0' }" v-if="visible">
    <div class="module-modal-content">
      <div class="module-content">
        <div
          v-for="item in moduleData"
          :key="item?.name"
          @click="handleClick($event, item)"
          :class="{ 'module-item': true, 'module-item-active': state?.global?.menuModel === item?.name }"
        >
          <div class="left"><IconSvg :name="item?.meta?.icon" class="module-icon"></IconSvg></div>
          <div class="right">
            <div>{{ item?.meta?.title }}</div>
            <div>{{ item?.subTitle || item?.meta?.title }}</div>
          </div>
        </div>
      </div>
      <div class="mask"></div>
    </div>
  </div>
</template>
<script setup>
import { useStore } from 'vuex';
import { computed, unref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { isNull } from '@/utils/utils';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  close: {
    type: Function,
    default: null
  }
});
const { push, currentRoute } = useRouter();
const { state, dispatch } = useStore();
const moduleData = computed(() => {
  return state?.user?.menuData?.module || [];
});

onMounted(() => {
  document.addEventListener('click', (e) => {
    const DOM = document.getElementsByClassName('module-content');
    const moduleIcon = document.getElementsByClassName('mode-home-icon');
    if ((!isNull(DOM) && DOM.length > 0) || (!isNull(moduleIcon) && moduleIcon.length > 0)) {
      if (DOM[0]?.contains(e.target) || moduleIcon[0]?.contains(e.target)) {
      } else {
        props.close && props.close();
      }
    }
  });
});

const handleClick = (event, route) => {
  const modelName = unref(currentRoute)?.meta?.modelName;
  if (modelName !== route?.name) {
    const sideMenu = state?.user?.menuData?.side[route?.name];
    dispatch('setMenuModel', route?.name);
    (!state?.user?.menuData?.top[route?.name]?.length || isNull(sideMenu)) && dispatch('setMenuTopModel', null);
    push({ name: route?.name });
  }
  props.close && props.close();
};
</script>
<style lang="less" scoped>
.module-modal {
  position: fixed;
  top: @headerHeight;
  right: 0;
  z-index: 666;
  width: 100%;
  transition: all 0.3s;
  border-top: 1px solid var(--private-line-color-2);
  .module-modal-content {
    width: 100%;
    height: 100%;
    .module-content {
      padding: 40px 80px;
      box-sizing: border-box;
      background-color: var(--private-content-bg);
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr); //分成三栏，每栏均等分
      grid-gap: 40px 10px; //行间距 列间距
      position: absolute;
      top: 0;
      z-index: 555;

      .module-item {
        display: flex;
        align-items: center;
        cursor: pointer;
        .left {
          width: 56px;
          height: 56px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          background-color: var(--private-primary-color);
          .module-icon {
            width: 32px;
            height: 32px;
            fill: var(--private-primary-color);
          }
        }
        .right {
          div:nth-of-type(1) {
            font-weight: 500;
            font-size: 16px;
            color: var(--private-first-text-color);
          }
          div:nth-of-type(2) {
            font-weight: 400;
            font-size: 14px;
            color: var(--private-second-text-color);
          }
        }
      }
      .module-item:hover {
        div:nth-of-type(1) {
          color: var(--private-primary-color) !important;
        }
        div:nth-of-type(2) {
          color: var(--private-primary-color) !important;
        }
      }
      .module-item-active {
        div:nth-of-type(1) {
          color: var(--private-primary-color) !important;
        }
        div:nth-of-type(2) {
          color: var(--private-primary-color) !important;
        }
      }
    }
    .mask {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: var(--private-mask-bg);
    }
  }
}
</style>
<style lang="less">
#model-4 {
  fill: var(--private-primary-color);
  path:nth-of-type(3) {
    fill: white;
  }
  path:nth-of-type(4) {
    fill: white;
  }
}
</style>
