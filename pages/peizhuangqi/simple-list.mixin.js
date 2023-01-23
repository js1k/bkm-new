export default {
  props: {
    type: String,
    current: { type: Object, default: () => ({}) },
    selectedList: { type: Array, default: () => [] },
    filters: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      keywords: '',
      db: wx.cloud.database(),
      list: [],
      loading: false,
      ended: false,
      pageNo: 0,
      pageSize: 20,
      status: 'loadmore',
      loadText: this.$constants.loadText,
    };
  },
  watch: {
    type: {
      immediate: true,
      handler(nv, ov) {
        if (nv && nv !== ov) {
          this.initialGetList();
        }
      },
    },
  },
  methods: {
    doSelect(item) {
      this.$emit('select', { ...item });
      console.log({ ...item });
      this.keywords = '';
    },
    onScroll2bottom() {
      !this.ended && this.getList();
    },
    doSearch(keywords) {
      this.keywords = keywords;
      this.initialGetList();
    },
    initialGetList() {
      this.pageNo = 0;
      this.loading = true;
      this.status = 'loading';
      this.list = [];
      this.getList();
    },
  },
};
