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
  border-top: 1px solid var(--ant-line);
}
</style>
