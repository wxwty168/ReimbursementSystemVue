<template>
	 <div class='footer'>
<!--        <p class="intro rflex">-->
<!--            <span>{{ $t('commons.xiaoai') }}Admin</span>-->
<!--            <a :href='github' target="_blank">-->
<!--               <icon-svg icon-class="iconGithub" />-->
<!--            </a>-->
<!--            <span>wdlhao2013({{ $t('commons.wechatNumber') }})</span>-->
<!--        </p>-->
        <p class="beian">鄂ICP备18001612号</p>
    </div>
</template>


<script>

export default {
    name: "footerNav",
	data(){
		return {
            // github:github
		}
	},
	methods:{

	}
}
</script>

<style>
.footer {
  width: 100%;
  padding: 10px 0;
  font-size: 12px;
  text-align: center;
  background: #fff;
}
.footer p {
  line-height: 30px;
}
.footer .intro {
  width: 240px;
  margin: 0 auto;
  justify-content: space-between;
  align-items: center;
}

</style>


