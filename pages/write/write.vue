<template>
	<view class="container">
		<view class="logo">
			<view class="left"></view>
			<view class="right">
				<button type="button" class="button" @click="postArticle()">发布</button>
			</view>
		</view>
		<view class="text">
			<input type="text" v-model="title" placeholder="请输入标题" class="title" />

			<hr size="1" style="color: gray;border-style:dashed ;width:100%" />

			<button class="add-btn" @tap="chooseImg()">添加图片</button>

			<hr size="1" style="color: gray;border-style:dashed ;width:100%" />

			<textarea v-model="content1" placeholder="请输入正文" class="content" />

			<text>预览</text>
			<!-- 使用graceUI的富文本解析功能，来预览文章内容 -->
			<view class="grace-text">
				<view>{{title}}</view>
				<view>{{content1}}</view>
				<rich-text :nodes="content" bindtap="postArticle"></rich-text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: '',
			content1:'',
			content: '',
			userId: uni.getStorageSync('login_key').userId,
			imgs: []
		};
	},
	onLoad() {},
	methods: {
		chooseImg: function() {
			var _this = this;
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'],
				sourceType: ['album'],
				success: function(res) {
					console.log(JSON.stringify(res.tempFilePaths));
					uni.uploadFile({
						url: _this.apiServer + '/avatar/upload',
						filePath: res.tempFilePaths[0],
						name: 'file',
						success: uploadFileRes => {
							//图片上传成功，回显图片地址
							console.log(uploadFileRes.data);
							//将图片地址加入imgs数组
							_this.imgs.push(uploadFileRes.data);
							//将图片地址拼接HTML标签，加入文章内容
							_this.content += '<img src="' + uploadFileRes.data + '" width = "100%"/>';
							// console.log("上传的文章源码："+_this.content);
						}
					});
				}
			});
		},
		postArticle: function() {
			var _this = this;
			uni.request({
				url: this.apiServer + '/article/add',
				method: 'POST',
				header: { 'content-type': 'application/x-www-form-urlencoded' },
				data: {
					uId: _this.userId,
					title: _this.title,
					content: '<div>' + _this.content +_this.content1 + '</div>'
				},
				success: res => {
					if (res.data.code === 0) {
						//获得发布文章成功返回的文章id
						var aId = res.data.data;
						console.log(aId);
						uni.showToast({
							title: '发布成功'
						});
						//将文章id和文章对应的图片地址数组传到后台，存入数据库
						uni.request({
							url: this.apiServer + '/img/add',
							method: 'POST',
							header: { 'content-type': 'application/x-www-form-urlencoded' },
							data: {
								aId: aId,
								imgs: JSON.stringify(_this.imgs)  //序列化imgs数组
							},
							success: res => {
								if (res.data.code === 0) {
									console.log('文章图片地址已写入数据库');
								}
							}
						});
						uni.switchTab({
							url: '../index/index'
						});
					}
				}
			});
		}
	}
};
</script>

<style>
.button {
	height: 40px;
	width: 100px;
	text-align: right;
	background-color: #ffffff;
	font-family: 'STSong';
	font-weight: bold;
	color: #de533a;
	font-size: 16px;
	border: none;
	border: 1px #ffffff solid;
}
.logo {
	display: flex;
	justify-content: space-between;
}
.content {
	margin-top: 10px;
	width: 100%;
}
.title {
	height: 50px;
}
.add-btn {
	margin-top: 10px;
	margin-bottom: 10px;
}

</style>
