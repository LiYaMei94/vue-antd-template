<template>
  <div>鹰眼监控</div>
  <a-button style="margin-top: 30px; display: block" type="primary" @click="handleClick">查看监控</a-button>
</template>
<script setup>
const handleClick = () => {
  window.open(
    'https://10.0.88.150/#/thirdOAuth?username=iccUser&password=Admin123&redirect=https%3A%2F%2F10.0.88.150%2Fvss%2F%23%2FvideoPlay%2Freal'
  );
};
</script>
