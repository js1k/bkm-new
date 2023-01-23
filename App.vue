<script>
export default {
  globalData: {
    maps: [],
    mapIdMaps: {},
  },
  onLaunch() {
    // #ifndef H5
    wx.cloud.init({
      env: 'prod-8gj6ilx469840d94',
      traceUser: true,
    });
    this.$scope.globalData.maps = [
      { _id: 'b00064a76063a5330ca7158242d57bac', name: '废神社', value: 'fss' },
      { _id: '17453ede6063a54100115d9a2bf86035', name: '冰封群岛', value: 'bfqd' },
      { _id: '28ee4e3e6063a54e0d80e283766f9d97', name: '沙原', value: 'sy' },
      { _id: 'b00064a76063a5610ca716c73d78cf7e', name: '水没林', value: 'sml' },
      { _id: '17453ede6063a56d00115e4b6b86e710', name: '熔岩洞', value: 'ryd' },
    ];
    this.$scope.globalData.mapIdMaps = this.getMapIdMaps(this.$scope.globalData.maps);
    // #endif
  },
  methods: {
    getMapIdMaps(maps) {
      return maps.reduce((map, item) => {
        map[item._id] = item;
        return map;
      }, {});
    },
  },
};
</script>

<style lang="scss">
@import 'uview-ui/index.scss';
@import 'common/demo.scss';
</style>
