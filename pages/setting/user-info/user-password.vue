<template>
	<view class="uni-flex uni-column container">
		<view class="item-newNN">
			<input
				class="uni-input"
				password
				type="text"
				placeholder="请输入新密码"
				v-model="password"
				required="required"
			/>
			<input
				class="uni-input"
				password
				type="text"
				placeholder="请再次输入新密码"
				v-model="repassword"
				required="required"
			/>

			<button class="green-btn" @tap="updateNickName(user)">确认</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			user: {
				id: uni.getStorageSync('login_key').userId,
				password:'',
				repassword:''
			}
		};
	},
	methods: {
		updateNickName: function(user) {
			// const loginKey = uni.getStorageSync('login_key');
			var _this = this;
			uni.request({
				url: this.apiServer+'/user/updatePassword',
				method: 'PUT',
				data: {
					password:_this.user.password,
					id:_this.user.id
				},
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				success: res => {
// 					console.log(user.nickname1);
// 					console.log(user.id);
					console.log(res.data.code);
					if (res.data.code == 0) {
						// _this.user.splice(index,1);//删除id为index的1条数据
						uni.showToast({
							title: '修改昵称成功',
							icon: 'succes',
							duration: 1000,
							mask: true
						});
						// uni.navigateBack();
						uni.redirectTo({
							url: "user-info"
						});
					}
					//登录失败，弹出各种原因
					else {
						uni.showModal({
							title: '提示',
							content: res.data.msg
						});
					}
				}
			});
		}
	}
	// 	methods:{
	// 		updateNickName: function(id,modifyNickName) {
	// 			var _this = this;
	// 			this.$http({
	// 				method: 'PUT',
	// 				url: 'http://47.102.201.109:8080/api/user/updateNickName'
	// 			}).then(function() {
	// 				alert('班课修改成功');
	// 				 _this.courses.splice(index,1);//删除id为index的1条数据
	// 			});
	// 		}
	// 	}
};
</script>

<style>
.item-nick {
	margin-top: 10px;
}

.item-newNN {
	margin-top: 20px;
}

input {
	height: 50px;
	border-bottom: 1px solid #eee;
	margin-bottom: 5px;
}

.green-btn {
	background-color: #00b26a;
	margin-top: 20px;
}
</style>
