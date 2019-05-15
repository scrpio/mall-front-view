exports.formatMoney = (value) => {
  if (value) {
    value = Number(value)
    return '￥ ' + value.toFixed(2)
  }
}

exports.getOrderStatusName = (val) => {
  let statusName = ''
  switch (val) {
    case 0: {
      statusName = '未付款'
      break
    }
    case 1: {
      statusName = '已付款'
      break
    }
    case 2: {
      statusName = '未发货'
      break
    }
    case 3: {
      statusName = '已发货'
      break
    }
    case 4: {
      statusName = '交易成功'
      break
    }
    case 5: {
      statusName = '交易关闭'
      break
    }
    case 6: {
      statusName = '交易失败'
      break
    }
  }
  return statusName
}

exports.getPaymentType = (val) => {
  if (val === 1) {
    return '在线支付'
  } else if (val === 2) {
    return '货到付款'
  }
}
