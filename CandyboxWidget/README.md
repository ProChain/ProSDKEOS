糖果widget优势：
1.提高日活，促进用户dapp消费；
2.提高token日转账次数；
3.羊毛党过滤，无损耗投放；
4.灵活方便接入。

调用示例：
<script src="https://chain.pro/candybox/static/candybox.js"></script>
<script>
  var candyBox = new CandyBox();
  candyBox.init({
    element: "#my-candybox",//绑定的元素
    list: 'PROCHAIN般若',//自定义需要展示的糖果列表，多个糖果以逗号分割
    layout: '2' //布局方式，0 —— 2行1列，1 —— 2行2列，2 —— 3行1列，3 —— 3行2列，4 —— 4行1列，5 —— 4行两列
  });
</script>

