<template>
  <div class="module-modal" :style="{ height: visible ? 'calc(100% - 80px)' : '0' }">
    <div class="module-modal-content">
      <div class="module-content" :style="{ height: visible ? '232px' : '0' }" v-if="visible">
        <div class="module-item" v-for="item in moduleData" :key="item?.name" @click="handleClick($event, item)">
          <div class="left"><IconSvg :name="item?.meta?.icon" class="module-icon"></IconSvg></div>
          <div class="right">
            <div>{{ item?.meta?.title }}</div>
            <div>{{ item?.meta?.title }}</div>
          </div>
        </div>
      </div>
      <div class="mask" @click="close"></div>
    </div>
  </div>
</template>
<script setup>
import { useStore } from 'vuex';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

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
const { push } = useRouter();
const { state, dispatch } = useStore();
const moduleData = computed(() => {
  return state?.user?.menuData?.module || [];
});

const handleClick = (event, route) => {
  dispatch('setMenuModel', route?.name);
  push({ name: route?.name });
  props.close && props.close();
};
</script>
<style lang="less" scoped>
.module-modal {
  position: absolute;
  top: 64px;
  right: 0;
  z-index: 666;
  width: 100%;
  .module-modal-content {
    width: 100%;
    height: 100%;
    position: relative;
    .module-content {
      padding: 40px 80px;
      box-sizing: border-box;
      background-color: var(--private-content-bg);
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr); //分成三栏，每栏均等分
      grid-gap: 40px 10px; //行间距 列间距
      height: 232px;
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
          background-color: var(--ant-primary-color);
          .module-icon {
            width: 32px;
            height: 32px;
            fill: var(--private-primary-color-hover);
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
          color: var(--private-primary-color-hover) !important;
        }
        div:nth-of-type(2) {
          color: var(--private-primary-color-hover) !important;
        }
      }
    }
    .mask {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.25);
    }
  }
}
</style>
