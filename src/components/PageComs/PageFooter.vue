<template>
  <div class="page-footer">
    <div><slot name="pageFooterLeft"></slot></div>
    <div><slot name="pageFooterRight"></slot></div>
  </div>
</template>
<style lang="less" scoped>
.page-footer {
  display: flex;
  padding: 15px 20px;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--private-border-color);
  pointer-events: all !important;
  position: fixed;
  bottom: 0;
  right: 12px;
  width: calc(100% - 200px - 24px);
  background-color: var(--private-content-bg);
  z-index: 666;
}
</style>
