<template>
	<view class="uni-flex uni-column container">
		<view class="list">
			<navigator class="list-item" url="article"><text class="setting-txt">文章推送</text></navigator>
			<navigator class="list-item" url="newMessage"><text class="setting-txt">新消息推送</text></navigator>
			<navigator class="list-item" url="user-info/user-info"><text class="setting-txt">个人资料</text></navigator>
		</view>
		<button @tap="logout" class="green-btn">退出当前账号</button>
	</view>
</template>

<script>
// import uniList from '@/components/uni-list/uni-list.vue';
// import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
export default {
	// components: { uniList, uniListItem },
	data() {
		return {};
	},
	onLoad() {},
	methods: {
		logout: function() {
			console.log('log out');
			uni.removeStorageSync('login_key');
			uni.showToast({
				title: '已经退出当前账号'
			});
			uni.navigateBack();
		}
	}
};
</script>

<style>
	.green-btn{
		background-color: #00B26A;
		margin-top: 10px;
	}
	
	.list-item{
		display: flex;
		/* justify-content: center; */
		align-items: center;
		height: 50px;
	}
</style>
