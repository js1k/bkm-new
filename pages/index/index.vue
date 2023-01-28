<template>
  <view class="page">
<!-- 	<view class="search-cot">
		<input type="text" 
			   class="search-iput" 
			   placeholder="支持名称搜索" 
			   v-model="searchVal">
		<img src="../../static/search.png" 
			 class="search-icon" 
			 @click="search">
	</view>
 -->	<view class="section">
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
				<view class="pic-cot">
					<view class="itm-logo" 
						  :class="itm['名称拼音']"></view>
				</view>
				<view class="cotxt">
					<view class="main-info">
						<view class="name">{{itm['名称']}}</view>
						<view class="cty-graph gry">全国图鉴：{{itm['全国图鉴']}}</view>
						<view class="property gry">属性：
							<view class="pro-spe" 
								  v-for="(p, x) in getProp(itm['属性'])" 
								  :key="x" 
								  :style="{'background-color': p.color}">{{p.name}}</view>
						</view>
						<view class="character gry">特性：{{itm['特性']}}</view>
					</view>
					<view class="nom">No.{{itm['帕底亚图鉴']<10?('00'+itm['帕底亚图鉴']):(itm['帕底亚图鉴']<100?('0'+itm['帕底亚图鉴']):itm['帕底亚图鉴'])}}</view>
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
		pageSize: 50,
		pageIndex: 0,
		isBgload: false,
		searchVal: '',
		propt: [
			{
				name: '草',
				color: '#3fa129'
			},
			{
				name: '恶',
				color: '#50413f'
			},
			{
				name: '火',
				color: '#e62829'
			},
			{
				name: '幽灵',
				color: '#704170'
			},
			{
				name: '水',
				color: '#2980ef'
			},
			{
				name: '格斗',
				color: '#ff8000'
			},
			{
				name: '一般',
				color: '#9fa19f'
			},
			{
				name: '虫',
				color: '#91a119'
			},
			{
				name: '飞行',
				color: '#81b9ef'
			},
			{
				name: '钢',
				color: '#60a1b8'
			},
			{
				name: '妖精',
				color: '#ef70ef'
			},
			{
				name: '毒',
				color: '#9141cb'
			},
			{
				name: '地面',
				color: '#915121'
			},
			{
				name: '岩石',
				color: '#afa981'
			},
			{
				name: '超能力',
				color: '#ef4179'
			},
			{
				name: '电',
				color: '#fac000'
			},
			{
				name: '冰',
				color: '#3fd8ff'
			}
		]
	};
},
created() {
	this.getNotice();
	let _this = this
	uni.downloadFile({
	    url: 'http:////636c-cloud1-8gxep97n51873d9b-1316607286.tcb.qcloud.la/bkm/msp-sv.webp?sign=c3a02a602dbdb9307ea8b50c73971bb7&t=1674728284',
	    success: function (image) {
			_this.isBgload = true
	    }
	});
},
methods: {
	getProp(val){
		let tmp = []
		for(let i =0; i< this.propt.length; i++){
			if(val.includes(this.propt[i].name)){
				tmp.push(this.propt[i])
			}
		}
		return tmp
	},
	search(){
		if(!this.searchVal || this.searchVal === ' ') {
			this.pageIndex = 0
			this.list = []
			this.getNotice()
		}else{
			this.pageIndex = 0
			this.list = []
			this.db.collection('pm_v2')
				.where({
					"name": this.searchVal
				})
				.limit(10)
				.orderBy('name', 'asc')
				.get({
					success: res => {
						this.list.push(...res.data)
					},
					fail(err) {
						console.log('error', err);
					}
			});
		}
	},
	getNotice() {
	  this.db.collection('pm_v2')
	  .where({})
		.skip(this.pageIndex * this.pageSize)
		.limit(this.pageSize)
		.orderBy('帕底亚图鉴', 'asc')
		.get({
			success: res => {
				console.log('res', res)
				this.list.push(...res.data)
			},
			fail(err) {
				console.log('error', err);
			}
		});
	},
	onScroll2bottom(e){
		this.pageIndex++
		this.getNotice()
	},
	goDetail(item){
		wx.vibrateShort({
			type: 'light'
		})
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
	  imageUrl: 'http://imgcloud.uuucu.com/Alone/345500551300/smallDetails/1.jpg',
	};
},
onShareTimeline() {
	return {
	  title: '宝可梦',
	  imageUrl: 'http://imgcloud.uuucu.com/Alone/345500551300/smallDetails/1.jpg',
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


.section{
	padding: 0 15rpx;
	height: 100%;
}
.itm{
	display: flex;
	align-items: flex-start;
	.pic-cot{
		width: 64px;
		height: 64px;
		margin-right: 15rpx;
	}
	.itm-logo{
		width: 64px;
		height: 64px;
		background-image: url(//636c-cloud1-8gxep97n51873d9b-1316607286.tcb.qcloud.la/bkm/msp-sv.webp?sign=c3a02a602dbdb9307ea8b50c73971bb7&t=1674728284);
		background-repeat: no-repeat;
		vertical-align: middle;
		background-size: 1600px 1600px;
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
	padding: 15rpx 0;
	display: flex;
	align-items: flex-start;
	position: relative;
	// border-bottom: 0.5px solid #c6c6c6;
	.name{
		font-size: 32rpx;
	}
	.main-info{
		flex-grow: 1;
		font-size: 24rpx;
	}
	.nom{
		width: 100rpx;
		font-size: 26rpx;
	}
	.gry{
		color: #b1b1b1;
		margin: 5rpx 0;
		font-sie: 24rpx;
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
	min-width: 50rpx;
	padding: 5rpx 15rpx;
	background-color: #38b336;
	border-radius: 15px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-weight: bold;
	font-size: 24rpx;
	margin-right: 5rpx;
}
.default-img{
	width: 40rpx;
	height: 40rpx;
}
.search-cot{
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 10px 15px;
	height: 40px;
	border-radius: 20px;
	padding: 0 15px;
	border: 1px solid #ececec;
}
.search-iput{
	height: 40px;
	flex-grow: 1;
	list-style: none;
	margin: 0;
	padding: 0;
}
.search-icon{
	width: 18px;
	height: 18px;
	margin-left: 15px;
}
</style>
