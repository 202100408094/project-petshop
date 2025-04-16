package com.spboot.app.mapper;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.spboot.app.pojo.Reservation;
import org.apache.ibatis.annotations.Mapper;

@Mapper
@TableName("服务预约")
public interface ReservationMapper extends BaseMapper<Reservation> {}
