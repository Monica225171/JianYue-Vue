<template>
	<view class="uni-flex uni-column container">
		<input class="uni-input" type="number" placeholder="请输入手机号" v-model="userDTO.mobile" required="required" />
		<input class="uni-input" password type="text" placeholder="请输入密码" v-model="userDTO.password" required="required" />
		<view class="reg">
			<checkbox-group class="remmberPassword" @change="checkboxChange">
			<checkbox :checked="remmberPsw" @tap="remmberPsw = !remmberPsw">记住密码</checkbox>
			</checkbox-group>
			<navigator class="list-item" url="../register/register"><text class="setting-txt">还没有账号？点我注册</text></navigator>
		</view>
		<button class="green-btn" @tap="signIn(userDTO)">登录</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userDTO: {
					mobile: '',
					password: '',
				},
				remmberPsw: true
			};
		},
		onLoad() {
			// 		uni.setNavigationBarTitle({
			// 			title: '登录'
			// 		});
		},
		mounted() {
			var that = this;
			let Base64 = require("js-base64").Base64;
			//缓存的账号
			const syncMobile = uni.getStorageSync('remMobile');
			//缓存的密码
			const syncPsw = Base64.decode(uni.getStorageSync('remPsw'));
			//                  console.log(HCpassw+"缓存的密码")
			// console.log(syncPsw);
			if (syncMobile && syncPsw) {
				that.userDTO.mobile = syncMobile;
				that.userDTO.password = syncPsw;
			} else {
				that.userDTO.mobile = "";
				that.userDTO.password = "";
			}
		},
		methods: {
			signIn: function(userDTO) {
				var _this = this;
				// console.log(userDTO.mobile + ',' + userDTO.password);
				uni.request({
					url: this.apiServer+'/user/sign_in',
					// url: 'http://172.20.10.4:8080/api/user/sign_in',
					method: 'POST',
					data: {
						mobile: userDTO.mobile,
						password: userDTO.password
					},
					header: {
						'content-type': 'application/json'
					},
					success: res => {
						console.log(res.data.code);
						if (res.data.code == 0) {
							//将用户数据记录在本地存储
							uni.setStorageSync('login_key', {
								userId: res.data.data.id,
								nickname: res.data.data.nickname,
								avatar: res.data.data.avatar,
								token: res.data.data.token,
								login: true
							});
							// console.log(_this.remmberPsw);
							if ( _this.remmberPsw == true) {
								uni.setStorageSync('remMobile', res.data.data.mobile);
								uni.setStorageSync('remPsw', res.data.data.password);
							} else{
								uni.removeStorageSync('remMobile');
								uni.removeStorageSync('remPsw');
							}
							
							uni.showToast({
								title: '登录成功'
							});
							uni.navigateBack();
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
			},
			//复选框
			checkboxChange: function(e) {
				console.log(e.detail.value.length);
				if (e.detail.value.length == 1) {
					uni.getStorageSync('remMobile',this.uname);
					uni.getStorageSync('remPsw',this.passw);
				} else {
					uni.removeStorageSync('remMobile');
					uni.removeStorageSync('remPsw');
				}
			}
		}
	};
</script>

<style scoped>
	input {
		height: 50px;
		border-bottom: 1px solid #eee;
		margin-bottom: 5px;
	}

	.green-btn {
		background-color: #00B26A;
		margin-top: 10px;
	}

	.reg {
		display: flex;
		flex-flow: row nowrap;
	}

	.remmberPassword {
		margin-top: 10px;
		width: 40%;
		justify-content: flex-start;
		align-items: center;
		text-align: center;
	}

	.list-item {
		margin-top: 10px;
		width: 60%;
		justify-content: space-between;
		align-items: center;
		text-align: center;
	}
</style>
