package com.spboot.app.mapper;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.spboot.app.pojo.Cancelmerchbill;
import org.apache.ibatis.annotations.Mapper;

@Mapper
@TableName("取消订单商品信息")
public interface CancelmerchbillMapper extends BaseMapper<Cancelmerchbill> {}
