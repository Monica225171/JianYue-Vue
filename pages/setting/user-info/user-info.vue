<template>
	<view class="uni-flex uni-column container">
		<view class="list">
			<view class="list-nick">
				<navigator url="user-nickname">修改昵称</navigator>
				<view>{{ nickname }}</view>
			</view>
			
			<view class="item-hr"></view>

			<view class="list-avatar">
				<navigator @tap="showActionSheet">修改图像</navigator>
				<image :src="avatar" class="avatar" @tap="showActionSheet"></image>
			</view>
			
			<view class="item-hr"></view>

			<view class="list-nick">
				<navigator url="user-password">修改密码</navigator>
			</view>
			
			<view class="item-hr"></view>
		</view>

		<!-- <button @tap="logout" class="green-btn">退出当前账号</button> -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			nickname: uni.getStorageSync('login_key').nickname,
			avatar: uni.getStorageSync('login_key').avatar,
			userId: uni.getStorageSync('login_key').userId,
			mobile: uni.getStorageSync('login_key').mobile
		};
	},
	onLoad() {},
	onShow() {
		var _this = this;
		uni.request({
			// url: 'http://localhost:8080/api/user/' + uni.getStorageSync('login_key').userId,
			url: this.apiServer+ '/user/getUserByMobile',
			method: 'GET',
			data: {
				mobile: _this.mobile
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: res => {
				if (res.data.code === 0) {
					// console.log(res.data.data.avatar + '————————————');
					_this.avatar = res.data.data.avatar;
					_this.nickname = res.data.data.nickname1;
				}
			}
		});
	},
	methods: {
		logout: function() {
			console.log('log out');
			uni.removeStorageSync('login_key');
			uni.showToast({
				title: '已经退出当前账号'
			});
			uni.redirectTo({
				url:'../../signin/signin'
			})
		},
		showActionSheet: function() {
			console.log('show');
			var _this = this;
			uni.showActionSheet({
				itemList: ['拍照', '从相册选择'],
				success: function(res) {
					console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
					//选择的是拍照功能
					if (res.tapIndex == 0) {
						uni.chooseImage({
							count: 1,
							sourceType: ['camera'],
							success: function(res) {
								uni.saveImageToPhotosAlbum({
									filePath: res.tempFilePaths[0],
									success: function() {
										console.log('save success');
										uni.uploadFile({
											url: _this.apiServer+'/user/avatar',
											filePath: res.tempFilePaths[0],
											name: 'file',
											formData: {
												userId: _this.userId
											},
											success: uploadFileRes => {
												console.log(uploadFileRes.data);
												_this.avatar = uploadFileRes.data;
											}
										}).then(function() {
											alert('修改图像成功');
											_this.courses.splice(index, 1); //修改id为index的1条数据
										});
									}
								});
							}
						});
					}
					//从相册选择
					if (res.tapIndex == 1) {
						uni.chooseImage({
							count: 1, //默认9
							sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都
							sourceType: ['album'], //从相册选择
							success: function(res) {
								console.log(JSON.stringify(res.tempFilePaths));
								uni.uploadFile({
									url: _this.apiServer+'/user/avatar',
									filePath: res.tempFilePaths[0],
									name: 'file',
									formData: {
										userId: _this.userId
									},
									success: uploadFileRes => {
										console.log(uploadFileRes.data);
										_this.avatar = uploadFileRes.data;
									}
								});
							}
						});
					}
				},
				fail: function(res) {
					console.log(res.errMsg);
				}
			});
		}
	}
	// ,
// 	bindLogin(e) {
// 		try {
// 			uni.setStorageSync('login_key', {
// 				userId: this.userId,
// 				nickname: this.nickname,
// 				avatar: this.avatar,
// 				token: this.token,
// 				login: true
// 			});
// 		} catch (e) {
// 			// error
// 		}
// 		uni.navigateBack();
// 	}
};
</script>

<style>
.green-btn {
	background-color: #00b26a;
}

.list-avatar {
	display: flex;
	align-items: center;
	height: 100px;
	justify-content: space-between;
	/* border: 1px solid #8F8F94; */
}

.list-nick {
	display: flex;
	height: 70px;
	align-items: center;
	justify-content: space-between;
	/* border: 1px solid #8F8F94; */
}

.avatar {
	border-radius: 50%;
	align-items: center;
	height: 80px;
	width: 80px;
}

.item-hr{
	height: 1px;
    border-top: 1px solid #ddd;
    text-align: center;
}
</style>
