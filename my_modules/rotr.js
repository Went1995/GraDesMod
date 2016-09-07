/*http路由分发
接口模式server/:app/:api
*/

var _rotr = {};

//http请求的路由控制
_rotr = new $router();

//访问的请求
_rotr.get('api', '/api/:apiname', apihandler);
_rotr.post('api', '/api/:apiname', apihandler);





/*所有api处理函数都收集到这里
必须是返回promise
各个api处理函数用promise衔接,return传递ctx
*/
_rotr.apis = {};

/*处理Api请求
默认tenk的api直接使用
每个app的独立api格式appname_apiname
*/
function * apihandler(next) {
    var ctx = this;
    var apinm = ctx.params.apiname;

    console.log('API RECV:', apinm);

    //匹配到路由函数,路由函数异常自动返回错误,创建xdat用来传递共享数据
    var apifn = _rotr.apis[apinm];
    ctx.xdat = {
        apiName: apinm
    };

    if (apifn && apifn.constructor == Function) {
        yield apifn.call(ctx, next).then(function() {

            //所有接口都支持JSONP,限定xx.x.xmgc360.com域名
            var jsonpCallback = ctx.query.callback || ctx.request.body.callback;
            if (jsonpCallback && ctx.body) {
                if (_cfg.regx.crossDomains.test(ctx.hostname)) {
                    ctx.body = ctx.query.callback + '(' + JSON.stringify(ctx.body) + ')';
                };
            };

        }, function(err) {
            ctx.body = __newMsg(__errCode.APIERR, [err.message, 'API proc failed:' + apinm + '.']);
            __errhdlr(err);
        });
    } else {
        ctx.body = __newMsg(__errCode.NOTFOUND, ['服务端找不到接口程序', 'API miss:' + apinm + '.']);
    };

    yield next;
};




/*测试接口,返回请求的数据
 */
_rotr.apis.test = function() {
    var ctx = this;
    var co = $co(function * () {

        var resdat = {
            query: ctx.query.nick,
            body: ctx.body,
        };

		var sqlstr="select * from users where id=1";
		_mysql.conn.query(sqlstr,function(err,rows,fields){
			resdat.nick=rows[0].nick;
			console.log('>>>>>mysql',rows);
		})

        ctx.body = __newMsg(1, 'ok', resdat);
        return ctx;
    });
    return co;
};




var db=[];



/*测试接口,返回请求的数据
 */
_rotr.apis.reg = function() {
    var ctx = this;
    var co = $co(function * () {

        //拿到和验证数据
        var name = ctx.query.name || ctx.request.body.name;
        if (!name ) throw Error('你的姓名格式不合法！');

        var pw = ctx.query.pw || ctx.request.body.pw;
        if (!pw ) throw Error('你的密码格式不合法！');

        //处理数据
        //创建一个用户，记录姓名密码
        var usr={
            id:db.length,
            name:name,
            pw:pw,
        };

        //加入数据库
        db.push(usr);
        console.log('>>>>push usr',db);

        //返回用户id
        var res={
            uid:usr.id,
        };

        //返回结果
        ctx.body = res;
        return ctx;
    });
    return co;
};


/*测试接口,返回请求的数据
 */
_rotr.apis.login = function() {
    var ctx = this;
    var co = $co(function * () {

        //拿到和验证数据
        var name = ctx.query.name || ctx.request.body.name;
        if (!name ) throw Error('你的姓名格式不合法！');

        var pw = ctx.query.pw || ctx.request.body.pw;
        if (!pw ) throw Error('你的密码格式不合法！');

        //处理数据
        var usr;
        for(var i=0;i<db.length;i++){
            var dbusr=db[i];
            if(dbusr.name==name){
                usr=dbusr;
            }
        };

        if(!usr) throw Error('找不到此用户！');

        var res={};

        if(usr.pw==pw){
            res.code=1;
        }else{
            res.code=0;
        };

        //返回结果
        ctx.body = res;
        return ctx;
    });
    return co;
};




//导出模块
module.exports = _rotr;
