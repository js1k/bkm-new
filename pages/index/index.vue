<template>
  <view class="page">
	<view class="section">
		<scroll-view v-if="list && list.length >0"
					 :scroll-y="true"
					 :lower-threshold="100"
					 :scroll-with-animation="true"
					 class="scl"
					 @scrolltolower="onScroll2bottom">
			<view class="itm" 
				  v-for="(itm, idx) in list" 
				  :key="idx" 
				  @click="goDetail(itm)">
				<view class="itm-logo" 
					  :class="itm['名称拼音']"></view>
				<view class="cotxt">
					<view class="main-info">
						<view class="name">{{itm['名称']}}</view>
						<view class="cty-graph gry">全国图鉴：{{itm['全国图鉴']}}</view>
						<view class="property gry">属性：
							<view class="pro-spe">{{itm['属性']}}</view>
						</view>
						<view class="character gry">特性：{{itm['特性']}}</view>
					</view>
					<view class="nom">No.{{itm['帕底亚图鉴']}}</view>
				</view>
			</view>	
		</scroll-view>
	</view>
  </view>
</template>
<script>

export default {
data() {
	const hour = new Date().getHours();
	const isAm = hour < 12;
	return {
		db: wx.cloud.database(),
		list: [],
		pageSize: 20,
		pageIndex: 0
	};
},
created() {
	this.getNotice();
},
methods: {
	getNotice() {
	  this.db.collection('pm_v2')
		.skip(this.pageIndex * this.pageSize)
		.limit(this.pageSize)
		.orderBy('帕底亚图鉴', 'asc')
		.get({
			success: res => {
				this.list.push(...res.data)
			},
			fail(err) {
				console.log('error', err);
			}
		});
	},
	onScroll2bottom(e){
		this.pageIndex++
		console.log('pageIndex', this.pageIndex)
		this.getNotice()
	},
	goDetail(item){
		console.log('item', item)
		uni.setStorageSync('item', item)
		uni.navigateTo({
			url: '/pages/detail/detail',
			animationType: 'pop-in'
		})
	}
},
onShareAppMessage() {
	return {
	  path: `/pages/index/index`,
	  imageUrl: 'https://cdn.thinkdiffs.com/static/rise/share2.jpeg',
	};
},
onShareTimeline() {
	return {
	  title: '宝可梦',
	  imageUrl: 'https://cdn.thinkdiffs.com/static/rise/share.jpeg',
	};
}
};

</script>
<style lang="scss" scoped>
$bgColorAm: #020702;
$bgColorPm: #140d15;
.page {
	overflow-x: hidden;
}
.blur {
	background: $bgColorAm;
	filter: blur(50rpx);
}
.bg-image {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	z-index: 0;
	transform: scale(1);
	opacity: 0;
	transition: transform 0.3s, opacity 0.3s;
	&.animate {
		opacity: 0;
		transform: scale(1.1);
	}
}
.bg-image-placeholder {
	top: 280rpx;
	z-index: 1;
}
.poster {
	width: 100vw;
	opacity: 0.8;
}
.logo {
	top: 66rpx;
	width: 538rpx;
}

.notice {
	padding: 30rpx;
}

.section{
	padding: 0 10px;
	height: 100%;
}
.itm{
	display: flex;
	align-items: flex-start;
	.itm-logo{
		width: 64px;
		height: 64px;
		margin-right: 10px;
		background-image: url(//636c-cloud1-8gxep97n51873d9b-1316607286.tcb.qcloud.la/bkm/icon-1999.png?sign=ea09b806c61b2dbc77c19ff6f73d81d5&t=1674622470);
		background-repeat: no-repeat;
		vertical-align: middle;
		background-size: 1600px 1600px;
		// background-position: -448px -1280px;
	}
}
.cotxt::after{
	display: block;
	content: ' ';
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 1px;
	transform: scaleY(0.5);
	background: #c6c6c6;
}
.cotxt{
	flex-grow: 1;
	padding: 10px 0;
	display: flex;
	align-items: flex-start;
	position: relative;
	// border-bottom: 0.5px solid #c6c6c6;
	.name{
		font-size: 14px;
	}
	.main-info{
		flex-grow: 1;
		font-size: 12px;
	}
	.nom{
		width: 60px;
		font-size: 18px;
	}
	.gry{
		color: #b1b1b1;
	}
}
.scl{
	height: 100%;
}
.property{
	display: flex;
	align-items: center;
}
.pro-spe{
	// width: 30px;
	min-width: 50px;
	padding: 3px 15px;
	background-color: #38b336;
	border-radius: 15px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-weight: bold;
	font-size: 14px;
}

</style>
