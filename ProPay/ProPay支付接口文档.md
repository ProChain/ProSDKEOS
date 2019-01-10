**ProPay支付接口文档**

时间：201901 版本：V0.3

**一、服务目的**

打通数字货币支付场景，为需求方提供数字货币支付接口。

流程如下：

![ProPay](https://static.chain.pro/website/propay.png)

**二、业务申请**

商户事先开通**AppCode(app_code)**和对应的**SecretKey(secret)**，声明需要调用的URL PATH或Body，方可调用相应接口。
加密算法采用RSA2。

签名（**sign**）生成方式为：

- 排序

将除sign之外的非空参数，按照名称的字典序进行排序，最后加上Secret

- GET方式: 将上述字符串做MD5并转小写，如 Secret为：7a86n391ADce

```
URL参数为app_code=demo&biz_content={"aa":11,"bb":22}&method=propay.pay&timestamp=1546416695000

得到sign为：MD5(‘demo{"aa":11,"bb":22}propay.pay15464166950007a86n391ADce’) = b76fe80a8e482b2bcd1cfae83f498d21

最后访问参数为：biz_content={"aa":11,"bb":22}&method=propay.pay&sign=b76fe80a8e482b2bcd1cfae83f498d21&app_code=demo&timestamp=1546416695000
```

- POST方式:

```json
{
"app_code":"demo",
"method":"propay.pay",
"timestamp":1546416695000,
"biz_content":"{\"aa\":11,\"bb\":22}"
}
```

加密过程,将除sign之外的参数，按照名称的字典序进行排序，最后加上Secret。

MD5(‘demo{"aa":11,"bb":22}propay.pay15464166950007a86n391ADce’) = b76fe80a8e482b2bcd1cfae83f498d21

```json
{
"app_code":"demo",
"biz_content":"{\"aa\":11,\"bb\":22}",
"method":"propay.pay",
"sign":"b76fe80a8e482b2bcd1cfae83f498d21",
"timestamp":1546416695000
}
```

**三、调用方式**

数据服务接口均采用https连接，以GET/POST的方式进行调用，各调用参数使用UTF-8编码，响应数据均为JSON格式。

超时时间：建议设置为10-30秒

测试地址：http://192.144.158.245/pay/openapi/gateway

生产地址：https://block.chain.pro/pay/openapi/gateway

**IP白名单：建议双方开通IP白名单** <span id="des"></span>

返回结果状态及含义：

code=10000：调用成功有数据

code=20000：服务不可用

code=20001：授权权限不足

code=40001：缺少必选参数

code=40002：非法的参数

code=40004：业务处理失败

code=40006：用户身份认证错误（签名不对）

**四、商户提供的接口**

公共请求参数

| 参数名称       | 参数类型 | 是否必选 |最大长度| 参数描述                                                     |
| -------------- | -------- | -------- | ---------|---------------------------------------------- |
| app_code    | String   | 是     | 16 | ProPay分配给开发者用code                                                      |
| method         | String   | 是   |  100  | 接口名称                         |
| timestamp         | Long   | 是   |  13  | 请求发起四件戳（ms)                         |
| biz_content         | String   | 是 |       | 请求参数                      |
| sign         | String   | 是 |   32    | 签名                      |

公共响应参数

| 参数名称 | 参数类型 | 是否必选 | 参数描述 |
| -------- | -------- | -------- | -------- |
| code   | Long       | 是       | 状态     |
| msg  | String   | 是       | 消息     |
| sub_msg  | String   | 是 |业务消息             |
| biz_content  | String   | 是 |响应参数             |
| sign  | String   | 是 |签名             |


**1 支付通知接口**

通过交易ID、支付方EOS账号、金额、时间、支付Memo等参数，通知商户；

接口调用方：ProPay

接口名称：method=propay.pay

方法：HTTP POST

接口输入参数：

| 参数名称       | 参数类型 | 是否必选 | 最大长度|参数描述                                                     |
| -------------- | -------- | -------- | -----|-------------------------------------- |
| trade_no    | String   | 是      | 36 | ProPay交易号                                                      |
| eos_account    | String   | 是    | 12  | EOS账号                                                      |
| asset    |    |        |   
| &emsp;&emsp;amount         | String   | 是     | 20,4 | 金额，如“10.0000”（一般保留4位小数）                         |
| &emsp;&emsp;symbol         | String   | 是    |  12 | 交易Token，如“EOS”                                           |
| &emsp;&emsp;symbol_account | String   | 是    |  12 | 交易Token的主账号，如“eosio.token” （通过symbol和symbol_account才能唯一确定一token，主链EOS Token的参数是EOS + eosio.token） |
| &emsp;&emsp;chain_type | Int   | 是    | 1  | 0(ethereum),1(eosio),2(tron)|
| timestamp      | Long   | 是    | 13  | 交易时间(时间戳ms)                                                     |
| memo           | String   | 是    |   | 格式：商户code+用户uid                                       |
| trx_id         | String   | 是    |  64 | EOS主链的transaction id （同一trx_id只对应一笔交易，不可重复入账） |
| chain_id         | String   | 是   |  64  | 区分EOS链(主网、测试、分叉链) |

```json
{
"app_code":"demo",
"method":"propay.pay",
"timestamp":1547095612121,
"biz_content":"{\"asset\":{\"amount\":0.0605,\"chain_type\":1,\"symbol\":\"EOS\",\"symbol_account\":\"EOSIO.TOKEN\"},\"chain_id\":\"cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f\",\"eos_account\":\"bidnameu1121\",\"memo\":\"bid,dddd123.pra,2,\",\"timestamp\":1542269635000,\"trade_no\":\"f9347e1d-9931-45d3-bbad-45c57bdc3ce3\",\"trx_id\":\"99eb005aa99bebf1ae406f0440be57d32a14f7b7d56f75e483b930ea430af32f\"}",
"sign":"18730f64c2ccee807f91911fed2fba91"
}
```

返回结果：

| 参数名称 | 参数类型 | 是否必选 | 参数描述 |
| -------- | -------- | -------- | -------- |
| code   | Long      | 是       | 状态     |
| msg  | String   | 是       | 消息     |
| biz_content   | String   | 是       | 响应参数     |

**五、ProPay提供的接口**

**1 提现/退款通知接口**

商户确认用户的提现/退款金额、EOS账号等信息后，提交提现/退款通知；

接口调用方：商户

接口名称：method=propay.withdraw

方法：HTTP POST

接口输入参数：

| 参数名称       | 参数类型 | 是否必选 | 最大长度|参数描述                                                     |
| -------------- | -------- | -------- | -----|----------------------------------------------- |
| order_id    | String   | 是    |  36 | 商家订单Id                                                      |
| eos_account    | String   | 是    |  12 | EOS账号                                                      |
| asset    |    |        |   
| &emsp;&emsp;amount         | String   | 是 |  20,4    | 金额，如“10.0000”（一般保留4位小数）                         |
| &emsp;&emsp;symbol         | String   | 是  |  12   | 交易Token，如“EOS”                                           |
| &emsp;&emsp;symbol_account | String   | 是   |  12  | 交易Token的主账号，如“eosio.token” （通过symbol和symbol_account才能唯一确定一token，主链EOS Token的参数是EOS + eosio.token） |
| &emsp;&emsp;chain_type | Int   | 是   |  1  | 0(ethereum),1(eosio),2(tron)|

返回结果：

biz_content:

| 参数名称    | 参数类型 | 是否必选 | 最大长度|参数描述                           |
| ----------- | -------- | -------- | --|-------------------------------- |
| trade_no | String   | 否    |36   | 订单id，商户经订单查询接口获取结果 |

**2 订单状态查询接口**

商户根据订单id，查询订单状态；

接口调用方：商户

接口名称：method=propay.orderinfo

方法：HTTP POST

trade_no为propay.withdraw生成的流水号,order_id由商家定义,两个参数至少填一个

接口输入参数：

| 参数名称   | 参数类型 | 是否必选 | 参数描述              |
| ---------- | -------- | -------- | --------------------- |
| trade_no   | String   | 是       | ProPay交易号           |
| order_id   | String   | 是       | 订单id                |
| order_type | Int      | 是       | 订单类型： 1 withdraw |

```json
例子
{
"biz_content":"{\"order_id\":\"123456789\"}",
"method":"propay.orderinfo",
"sign":"726f1e289fab65ad4e431e0c55c8f468",
"timestamp":123123123123,
"app_code":"demo"
}
```
返回结果：

| 参数名称 | 参数类型 | 是否必选 | 参数描述 |
| -------- | -------- | -------- | -------- |
| code     | Long      | 是       | 状态     |
| msg  | String   | 是       | 消息     |
| biz_content     | String     | 是       | 返回结果 |
| sign     | String     | 是       | 签名 |

biz_content

数组

| 参数名称       | 参数类型 | 是否必选 | 最大长度|参数描述                                                     |
| -------------- | -------- | -------- | ---|--------------------------------------------------- |
| trade_no    | String   | 否    | 36   | ProPay交易号                                                       |
| eos_account    | String   | 是   |12    |                     |
| asset    |    |        |   
| &emsp;&emsp;amount         | String   | 是    |20,4   | 金额，如“10.0000”（一般保留4位小数）                         |
| &emsp;&emsp;symbol         | String   | 是    |12   | 交易Token，如“EOS”                                           |
| &emsp;&emsp;symbol_account | String   | 是    |12   | 交易Token的主账号，如“eosio.token” （通过symbol和symbol_account才能唯一确定一token，主链EOS Token的参数是EOS + eosio.token） |
| &emsp;&emsp;chain_type | Int   | 是   |1    | 0(ethereum),1(eosio),2(tron)|
| timestamp      | Long   | 是  |13     | 交易时间                                                     |
| trx_id         | String   | 是     |64  | EOS主链的transaction id （同一trx_id只对应一笔交易，不可重复入账） |
| status         | Int      | 是      |1 | 状态：0. 待发起交易 1. 交易处理中 2. 交易成功 3. 交易失败    |
| reason         | String   | 否     |  | 原因            |   

```json
{
"code":10000,
"msg":"操作成功",
"sign":"91a658bc84e2eaf827a4ea7c4ba0e77f",
"biz_content":"[{\"asset\":{\"amount\":1000.0000,\"chain_type\":1,\"symbol\":\"eos\",\"symbol_account\":\"eosio.token\"},\"eos_account\":\"praisperfect\",\"status\":0,\"trade_no\":\"50304679-3b8c-4f92-9400-35ea836000b4\"}]",
"sub_msg":null
}
```

**3 对账接口：查询商户信息接口**

根据商户code，查询商户信息接口；

接口调用方：商户

接口名称：method=propay.accountinfo

方法：HTTP POST

接口输入参数：

| 参数名称   | 参数类型 | 是否必选 | 参数描述              |
| ---------- | -------- | -------- | --------------------- |
|  method   | String   | 是       | 固定为query      |

```json
接口输入例子
{
"app_code":"demo",
"biz_content":"{\"method\":\"query\"}",
"method":"propay.accountinfo",
"sign":"958159b2bd821f401c1a11cc2341ae6f",
"timestamp":1546416695000
}
```

返回结果：

| 参数名称 | 参数类型 | 是否必选 | 参数描述 |
| -------- | -------- | -------- | -------- |
| code     | Long      | 是       | 状态     |
| msg  | String   | 是       | 消息     |
| biz_content     | String     | 是       | 返回结果 |
| sign     | String     | 是       | 签名 |

biz_content

数组

| 参数名称       | 参数类型 | 是否必选 | 最大长度|参数描述                                 |
| -------------- | -------- | -------- | ---|--------------------------------------------------- |
| name           | String   | 是   | 32   | 商户名称                   |
| email          | String   | 否   | 32   | 商户邮件                   |
| phone          | String   | 否   | 32   | 商户电话                   |
| phone          | String   | 否   | 32   | 商户电话                   |
| note          | String   | 否   | 256   | 商户备注               |
| created_at        | String   | 否   | 32   | 创建时间          |
| updated_at          | String   | 否   | 32   | 更新时间             |

```json
接口返回例子
{
    "code": 10000,
    "msg": "操作成功",
    "sign": "3c8f23a22bb52a44c3dce2ddd2245a5a",
    "biz_content": "{\"note\":\"用户测试，如验签场景\",\"updated_at\":\"2019-01-10T11:21:59Z\",\"phone\":\"(+86)13800138000\",\"name\":\"demo测试\",\"created_at\":\"2018-10-16T09:47:32Z\",\"email\":\"admin@demo.com\",\"app_code\":\"demo\"}",
    "sub_msg": null
}
```

**4 对账接口：用户**

商户查询用户相关数据，如汇总历史用户数、汇总当日、当月用户数，以及每用户的首次使用时间、历史交易次数、历史交易金额等，支持分页和排序；

接口调用方：商户

**5 对账接口：交易汇总**

商户查询交易相关数据，如总交易数和金额、当日当月交易数和金额，以及按照Token类型分类的历史交易次数、交易金额等，支持分页和排序；

接口调用方：商户

**六、ProPay网关异常处理**

http-status通信正常均返回200, 未捕获的异常会返回40*,50*等未知异常
通信成功,code=10000时,业务处理成功,其他均为失败.[点击查看编码](#des)

```json
{
"code": 40004,
"msg": "业务处理失败",
"sub_msg": "订单号123456789已存在，不能重复执行"
}

{
"code": 40006,
"msg": "API Code未授权或签名不正确",
"sub_msg": ""
}
```

