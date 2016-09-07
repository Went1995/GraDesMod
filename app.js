/**
 * Created by 姜文韬 on 2016/9/7.
 */
var koa = require('koa');
var app = koa();

app.use(function *(){
    this.body = 'Hello word';
});

app.listen(3001);
