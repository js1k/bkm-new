<template>
	<view class="detail-page">
		<view class="head">
			<view class="itm-logo" :class="item['名称拼音']"></view>
			<view class="info">
				<view class="name">{{item['名称']}}</view>
				<view class="order-num">帕底亚图鉴: {{item['帕底亚图鉴']<10?('00'+item['帕底亚图鉴']):item['帕底亚图鉴']<100?('0'+item['帕底亚图鉴']):item['帕底亚图鉴']}}</view>
			</view>
		</view>
		<view class="section">
			<view class="common-info">
				<view class="colum1">
					<view class="clm">
						<view class="c-name">
							属	性：
						</view>
						<view class="c-value prop-bx" >
							  <view class="prop" 
								    v-for="(p, x) in getProp(item['属性'])" 
									:key="x" 
									:style="{'background-color': p.color}">
							  	{{p.name}}
							  </view>
						</view>
					</view>
					<view class="clm">
						<view class="c-name">
							蛋	群：
						</view>
						<view class="c-value">
							{{item['蛋群']}}
						</view>
					</view>
				</view>
				<view class="colum1">
					<view class="clm">
						<view class="c-name">
							全国图鉴：
						</view>
						<view class="c-value">
							{{item['全国图鉴']}}
						</view>
					</view>
					<view class="clm">
						<view class="c-name">
							孵化周期：
						</view>
						<view class="c-value">
							{{item['孵化周期']}}
						</view>
					</view>
				</view>
				<view class="colum1">
					<view class="clm">
						<view class="c-name">
							捕获率：
						</view>
						<view class="c-value">
							{{item['捕获率']}}
						</view>
					</view>
					<view class="clm">
						<view class="c-name">
							初始亲密度：
						</view>
						<view class="c-value">
							{{item['初始亲密度']}}
						</view>
					</view>
				</view>
				<view class="colum1" v-if="item['特性']">
					<view class="clm">
						<view class="c-name">
							特	性：
						</view>
						<view class="c-value">
							{{item['特性']}}
						</view>
					</view>
				</view>
			</view>
			<view class="zhongzu">
				<view class="flx">
					<view class="lm nlm lm-spe">种族值</view>
					<view class="lm nlm">HP</view>
					<view class="lm nlm">攻击</view>
					<view class="lm nlm">防御</view>
					<view class="lm nlm">特攻</view>
					<view class="lm nlm">特防</view>
					<view class="lm nlm">速度</view>
				</view>
				<view class="flx">
					<view class="lm lm-spe">310</view>
					<view class="lm val1">40</view>
					<view class="lm val2">61</view>
					<view class="lm val3">54</view>
					<view class="lm val4">45</view>
					<view class="lm val5">45</view>
					<view class="lm val6">65</view>
				</view>
			</view>
		</view>
		<view class="property-box">
			<view class="title">
				属性相克
			</view>
			<view class="prop-wrap">
				<view class="prop-itm" 
					  v-for="(im, ix) in item['属性相克'].split(';')" 
					  :key="ix">
					<view class="prop-img" 
						  :style="{'backgroundColor': bgArr[ix]['color']}">
						<view class="img-bg" 
							  :style="{'background-position': bgArr[ix]['position']}">
						</view>
						<view class="img-txt">
							{{bgArr[ix]['name']}}
						</view>
					</view>
					<view class="prop-value">
						{{im}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default{
data(){
	return {
		item: {},
		bgArr: [
			{
				color: '#9fa19f',
				position: '0 0',
				name: '一般'
			},
			{
				color: '#ff8000',
				position: '0 -20px',
				name: '格斗'
			},
			{
				color: '#81b9ef',
				position: '0 -40px',
				name: '飞行'
			},
			{
				color: '#9141cb',
				position: '0 -60px',
				name: '毒'
			},
			{
				color: '#915121',
				position: '0 -80px',
				name: '地面'
			},
			{
				color: '#afa981',
				position: '0 -100px',
				name: '岩石'
			},
			{
				color: '#91a119',
				position: '0 -120px',
				name: '虫'
			},
			{
				color: '#704170',
				position: '0 -140px',
				name: '幽灵'
			},
			{
				color: '#60a1b8',
				position: '0 -160px',
				name: '钢'
			},
			{
				color: '#e62829',
				position: '0 -180px',
				name: '火'
			},
			{
				color: '#2980ef',
				position: '0 -200px',
				name: '水'
			},
			{
				color: '#3fa129',
				position: '0 -220px',
				name: '草'
			},
			{
				color: '#fac000',
				position: '0 -240px',
				name: '电'
			},
			{
				color: '#ef4179',
				position: '0 -260px',
				name: '超能力'
			},
			{
				color: '#3fd8ff',
				position: '0 -280px',
				name: '冰'
			},
			{
				color: '#5060E3',
				position: '0 -300px',
				name: '龙'
			},
			{
				color: '#50413f',
				position: '0 -320px',
				name: '恶'
			},
			{
				color: '#ef70ef',
				position: '0 -340px',
				name: '妖精'
			}
		],
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
	}
},
created(){
	this.item = uni.getStorageSync('item')
	console.log('this.item', this.item)
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
}

}
</script>

<style lang="scss" scoped>
.detail-page{
	padding-top: 30rpx;
	overflow: hidden;
}
.head{
	display: flex;
	flex-direction: column;
	align-items: center;
	.info{
		display: flex;
		flex-direction: column;
		align-items: center;
		.name{
			font-size: 40rpx;
			font-weight: bold;
		}
		.order-num{
			margin-top: 10rpx;
			font-size: 30rpx;
		}
	}
}
.prop-bx{
	display: flex;
	align-items: center;
	justify-content: flex-start;
}
.prop{
	padding: 3rpx 10rpx;
	color: #fff;
	margin-right: 5rpx;
	font-size: 24rpx;
}
.itm-logo{
	width: 64px;
	height: 64px;
	margin-right: 10px;
	background-image: url(//636c-cloud1-8gxep97n51873-4bo66862e73-1316653034.tcb.qcloud.la/bkm/msp-sv.webp?sign=e0229137f2890fa57d0ca50a0f1a45f6&t=1674967884);
	background-repeat: no-repeat;
	vertical-align: middle;
	background-size: 1600px 1600px;
	margin-bottom: 15px;
}
.section{
	padding: 30rpx 0 0;
}
.common-info{
	padding-left: 20rpx;
	display: flex;
	flex-direction: column;
}
.colum1{
	display: flex;
	align-items: center;
	margin-bottom: 15rpx;
	
	.clm{
		padding: 10rpx 0;
		display: flex;
		align-items: center;
		margin-right: 20rpx;
	}
	.c-name{
		width: 180rpx;
		font-size: 30rpx;
		font-weight: bold;
		text-align: left;
	}
	.c-value{
		text-align: left;
		padding-left: 30rpx;
		min-width: 140rpx;
		font-size: 28rpx;
	}
}
.zhongzu{
	padding: 0 10rpx;
	margin-top: 30px;
	.flx{
		display: flex;
		align-items: center;
		.nlm{
			font-weight: bold;
			border-bottom: none !important;
		}
		.lm{
			// flex-grow: 1;
			width: 100rpx;
			text-align: center;
			padding: 10px 5px;
			border: 1px solid #ececec;
			border-right: none;
		}
		.lm:last-child{
			border-right: 1px solid #ececec;
		}
		.lm-spe{
			width: 110rpx !important;
			flex-grow: none !important;
		}
		.val1{
			background: #97c87a;
		}
		.val2{
			background: #fae192;
		}
		.val3{
			background: #fbb977;
		}
		.val4{
			background: #a2d4da;
		}
		.val5{
			background: #89a9cd;
		}
		.val6{
			background: #c39cd8;
		}
	}
}
.property-box{
	width: 100%;
	margin-top: 40rpx;
	border: 1px solid #ececec;
	.title{
		width: 100%;
		text-align: center;
		padding: 15rpx 0;
		background: #eaecf0;
		font-weight: bold;
	}
}
.prop-wrap{
	display: flex;
	align-items: center;
	flex-wrap: wrap;
}
.prop-itm{
	// width: 41.9rpx;
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.prop-img{
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	height: 130rpx;
	padding: 20px 0;
}
.prop-value{
	padding: 20rpx 0;
}
.img-bg{
	width: 20px;
	height: 20px;
	margin-bottom: 15rpx;
	background-image: url(//cdn.jsdelivr.net/npm/pkm-sv-maps@latest/assets/images/MST_SV.webp);
	background-repeat: no-repeat;
	vertical-align: middle;
	background-size: 125.6px auto;
	// margin-bottom: 5px;
}
.img-txt{
	writing-mode: tb-rl
}
</style>