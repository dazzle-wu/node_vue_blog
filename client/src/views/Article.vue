<template>
  <div class="md:px-14">
    <div class="md:h-96">
      <img class="block w-full h-full object-cover" :src="$store.state.baseURL + articleInfo.cover_img" alt="">
    </div>
    <div class="p-4 md:p-16">
      <h2 class="font-bold text-xl md:text-4xl">{{ articleInfo.title }}</h2>
      <div class="pt-6 pb-2 border-b text-xs md:text-base">
        <span class="font-bold">Written by {{ articleInfo.author_name }}</span>
        <span class="text-gray-500 ml-6">{{ articleInfo.pub_date }}</span>
      </div>
      <div class="md：pt-12 md:pb-14 text-justify" v-html="articleInfo.content"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    aid: {}
  },
  data () {
    return {
      queryInfo: {
        pagenum: 1,
        pagesize: 10
      },
      articleInfo: {},
      commentList: [],
      newComment: '',
      total: 0
    }
  },
  methods: {
    async getArticleDetail (aid) {
      const { data: res } = await this.$http.get(`article/detail/${aid}`)
      if (res.status !== 0) return this.$message.error(res.message)
      this.articleInfo = res.data
    },
    async getCommentList (aid) {
      const { data: res } = await this.$http.get('comment/list', { params: { article_id: aid, ...this.queryInfo } })
      if (res.status !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.commentList = res.data[0]
      this.total = res.data[1][0].total
    },
    async addComment () {
      const { data: res } = await this.$http.post('comment/add', { content: this.newComment, article_id: this.aid })
      if (res.status !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.newComment = ''
      this.getCommentList(this.aid)
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCommentList(this.aid)
    }
  },
  created () {
    this.getArticleDetail(this.aid)
    // this.getCommentList(this.aid)
  }
}
</script>

<style>

</style>
