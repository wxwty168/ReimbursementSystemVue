<template>
    <div class="">
      <div style="height: 1000px;width: 2000px"></div>
        <transition name="fade">

            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
    export default {
        name: 'myContent',
        data () {
            return {

            }
        },
        methods:{

        },
        created(){

        },
        mounted(){

        }
    }
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}

</style>
