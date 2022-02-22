const path = require('path')
const db = require('../db/index.js')

exports.add = (req, res) => {
  console.log(req.file)
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数')
  const articleInfo = {
    ...req.body,
    cover_img: path.join('/uploads', req.file.filename),
    pub_date: new Date(),
    author_id: req.user.uid
  }
  const sql = 'insert into article set ?'
  db.query(sql, articleInfo, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('发布文章失败')
    res.cc('发布文章成功', 0)
  })
}

exports.list = (req, res) => {
  const { pagenum, pagesize } = req.query
  let sql = 'select SQL_CALC_FOUND_ROWS a.aid, a.title, a.state, a.cover_img, a.pub_date, c.name cate_name, u.username author_name from article a left join category c on a.cate_id=c.cid left join user u on a.author_id=u.uid where a.is_delete=0'
  if (req.query.cate_id) {
    sql += ' and a.cate_id=' + req.query.cate_id
  }
  if (req.query.state) {
    sql += ' and a.state="' + req.query.state + '"'
  }
  sql += ' limit ?,?; select FOUND_ROWS() total;'
  db.query(sql, [(pagenum - 1) * pagesize, pagesize], (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '获取文章列表成功',
      data: results
    })
  })
}

exports.delete = (req, res) => {
  const sql = 'update article set is_delete=1 where aid=?'
  db.query(sql, req.params.aid, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) res.cc('删除文章失败')
    res.cc('删除文章成功', 0)
  })
}

exports.activate = (req, res) => {
  const sql = 'update article set is_delete=0 where aid=?'
  db.query(sql, req.params.aid, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) res.cc('激活文章失败')
    res.cc('激活文章成功', 0)
  })
}

exports.detail = (req, res) => {
  const sql = 'select * from article where aid=?'
  db.query(sql, req.params.aid, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('获取文章详情失败')
    res.send({
      status: 0,
      message: '获取文章详情成功',
      data: results[0]
    })
  })
}

exports.update = (req, res) => {
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数')
  const articleInfo = {
    ...req.body,
    cover_img: path.join('/uploads', req.file.filename)
  }
  const sql = 'update article set ? where aid=?'
  db.query(sql, [articleInfo, req.body.aid], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('更新文章失败')
    res.cc('更新文章成功', 0)
  })
}