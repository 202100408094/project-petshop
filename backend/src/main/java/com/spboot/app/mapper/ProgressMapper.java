package com.spboot.app.mapper;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.spboot.app.pojo.Progress;
import org.apache.ibatis.annotations.Mapper;

@Mapper
@TableName("订单")
public interface ProgressMapper extends BaseMapper<Progress> {}
