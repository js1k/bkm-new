<script>
export default {
	globalData: {
		maps: [],
		mapIdMaps: {},
	},
	onLaunch() {
		// #ifndef H5
		wx.cloud.init({
			env: 'cloud1-8gxep97n51873-4bo66862e73'
		});
		// #endif
	},
	methods: {
		getMapIdMaps(maps) {
		  return maps.reduce((map, item) => {
			map[item._id] = item;
			return map;
		  }, {});
		}
	}
};
</script>

<style lang="scss">
@import 'common/bkm.css'
</style>
