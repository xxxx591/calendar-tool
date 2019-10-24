<template>
  <div class="calendar-box" ref="calendar_list">
    <ul class="calendar-head">
      <li v-for="(item, index) in weekList" :key="index">{{item}}</li>
    </ul>
    <calendarContent
      ref="calendar_swiper"
      :checkDate="current_day"
      :isWeek="onWeek"
      @on-change="changeIndex"
    >
      <div v-for="(month,index) in monthList" :key="index" class="month swiper-item">
        <ul>
          <li
            v-for="(week,weekindex) in month"
            :key="weekindex"
            @click="chooseDay(week.year,week.month,week.day,week.othermonth,week.mode)"
            :data-day="week.day"
          >
            <div class="week-day" :class="{othermonth:week.othermonth}">
              <span style="padding-top:2px;display:block;">
                <i
                  class="day"
                  :class="{ischecked:checkedDay==week.date,othermonth:week.othermonth,istoday:week.istoday,weekend:week.nongli.ncWeek=='星期日'||week.nongli.ncWeek=='星期六'}"
                >{{week.day}}</i>
                <i v-if="week.nongli.old_str != ''" class="festival">{{week.nongli.old_str}}</i>
                <i v-if="week.hasRicheng" class="hasRicheng"></i>
              </span>
              <div class="thing">
                <a
                  :style="{color:thing.color}"
                  v-for="(thing,index) in week.thing"
                  :key="index"
                >{{thing.title}}</a>
              </div>
              <div class="remind-top">
                <i
                  v-for="(remind, remindindex) in week.remind"
                  :key="remindindex"
                  :class="remind.color"
                >{{remind.title}}</i>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </calendarContent>
  </div>
</template>
<script>
import calendarContent from "../test_canlen/swiper-monthorweek.vue";
import format from "../test_canlen/format";
export default {
  data() {
    return {
      disp_date: new Date(),
      today: new Date(),
      current_day: new Date(),
      monthList: [],
      checkedDay: "0000-00-00",
      can_click: true,
      test: [],
      onWeek: this.isWeek,
      weekList: ["日", "一", "二", "三", "四", "五", "六"]
    };
  },
  props: {
    calendarList: {
      type: Array,
      default: () => {
        return [{ title: "嘻嘻" }];
      }
    },
    isWeek: {
      type: Boolean,
      default: () => {
        return true;
      }
    }
  },
  created() {
    this.get3week();
  },
  mounted() {
    console.log("calendar_swiper", this.$refs.calendar_swiper._data);
  },
  methods: {
    chooseDay(year, month, day, othermonth, mode) {
      //        为了PC端点击事件和移动冲突
      if (!this.can_click) return;
      this.current_day = new Date(year, month, day);
      this.checkedDay = this.format(year, month, day);
      if (othermonth && mode == "month") {
        var _tmpdt = new Date(
          this.disp_date.getFullYear(),
          this.disp_date.getMonth() - othermonth,
          0
        );
        var maxday = _tmpdt.getDate();
        var _day = maxday < day ? maxday : day;
        this.disp_date = new Date(year, month - othermonth, _day);
        // this.changeIndex(othermonth, false, true);
      } else if (othermonth && mode == "week") {
        this.disp_date = this.current_day;
      } else {
        this.disp_date = this.current_day;
      }
    },
    format(year, month, day) {
      month++;
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }

      return year + "-" + month + "-" + day;
    },
    getWeek(year, month, day) {
      var dt = new Date(year, month, day);
      var weekArr = [];
      var dt_first = new Date(year, month, day - ((dt.getDay() + 7) % 7));
      var week = [];
      console.log(year, month, day);
      for (var j = 0; j < 7; j++) {
        var newdt = new Date(
          dt_first.getFullYear(),
          dt_first.getMonth(),
          dt_first.getDate() + j
        );
        var _year = newdt.getFullYear();
        var _month = newdt.getMonth();
        var _day = newdt.getDate();
        week.push({
          mode: "week",
          day: _day,
          year: _year,
          month: _month,
          date: this.format(_year, _month, _day),
          thing: "",
          // day == 22 || day == 4 ? [{ title: "生日", color: "red" }] : [],
          remind:
            _day == 15 || _day == 1
              ? [{ title: "班", color: "midea-blue" }]
              : _day == 10 || _day == 31
              ? [{ title: "休", color: "midea-red" }]
              : [],
          nongli: format.solar2lunar(_year, _month + 1, _day),
          istoday:
            this.today.getFullYear() == _year &&
            this.today.getMonth() == _month &&
            this.today.getDate() == _day
              ? true
              : false,
          ischecked: false,
          othermonth: _month != month,
          isWeekend: false,
          hasRicheng: _day == 8 ? true : false
        });
      }
      // weekArr.push(week);
      return week;
    },
    getMonth(year, month) {
      //创建单月历
      var monthArr = [];
      var dt_first = new Date(year, month, 1); //每个月第一天
      var dt_last = new Date(year, month + 1, 0); //每个月最后一天
      var monthLength = dt_last.getDate() - dt_first.getDate() + 1;
      var daylist = [];
      var space = (dt_first.getDay() + 7) % 7; //月历前面空格
      for (var i = -space; i < monthLength; i++) {
        var week = [];
        var day = i + 1;
        if (day > 0 && day <= monthLength) {
          monthArr.push({
            mode: "month",
            day: day,
            year: year,
            month: month,
            date: this.format(year, month, day),
            //                日历要显示的其他内容
            thing: "",
            remind:
              day == 15 || day == 1
                ? [{ title: "班", color: "midea-blue" }]
                : day == 10 || day == 31
                ? [{ title: "休", color: "midea-red" }]
                : [],
            nongli: format.solar2lunar(year, month + 1, day),
            istoday:
              this.today.getFullYear() == year &&
              this.today.getMonth() == month &&
              this.today.getDate() == day
                ? true
                : false,
            ischecked: false,
            hasRicheng: day == 8 ? true : false
          });
        } else {
          //其它月份
          var newdt = new Date(year, month, day);
          var _year = newdt.getFullYear();
          var _month = newdt.getMonth();
          var _day = newdt.getDate();
          monthArr.push({
            mode: "month",
            day: "",
            year: "",
            month: "",
            date: "",
            nongli: "",
            istoday:
              this.today.getFullYear() == _year &&
              this.today.getMonth() == _month &&
              this.today.getDate() == _day
                ? true
                : false,
            ischecked: false,
            othermonth: day <= 0 ? -1 : 1,
            hasRicheng: day == 8 ? true : false
          });
        }
      }
      return monthArr;
    },
    get3month() {
      var year = this.disp_date.getFullYear();
      var month = this.disp_date.getMonth();
      this.monthList = [];
      this.monthList.push(this.getMonth(year, month - 1));
      this.monthList.push(this.getMonth(year, month));
      this.monthList.push(this.getMonth(year, month + 1));
    },
    get3week() {
      var year = this.disp_date.getFullYear();
      var month = this.disp_date.getMonth();
      var day = this.disp_date.getDate();
      this.monthList = [];
      this.monthList.push(this.getWeek(year, month, day - 7));
      this.monthList.push(this.getWeek(year, month, day));
      this.monthList.push(this.getWeek(year, month, day + 7));
      console.log(this.monthList);
    },
    changeIndex(index, is_week, is_click = false) {
      if (index) {
        if (is_week) {
          this.disp_date = new Date(
            this.disp_date.getFullYear(),
            this.disp_date.getMonth(),
            this.disp_date.getDate() + 7 * index
          );
          this.checkedDay = this.format(
            this.disp_date.getFullYear(),
            this.disp_date.getMonth(),
            this.disp_date.getDate()
          );
          this.current_day = this.disp_date;
          this.get3week();
        } else {
          var _tmpdt = new Date(
            this.disp_date.getFullYear(),
            this.disp_date.getMonth() + index,
            0
          );
          var maxday = _tmpdt.getDate();
          var _day =
            maxday < this.disp_date.getDate()
              ? maxday
              : this.disp_date.getDate();
          console.log(_day);

          this.disp_date = new Date(
            this.disp_date.getFullYear(),
            this.disp_date.getMonth() + index,
            _day
          );
          if (!is_click) {
            this.checkedDay = this.format(
              this.disp_date.getFullYear(),
              this.disp_date.getMonth(),
              this.disp_date.getDate()
            );
            console.log(this.checkedDay);
          }
          this.get3month();

          console.log("move_change");
        }
        this.$refs.calendar_swiper.move_change();
      }
    }
  },
  components: {
    calendarContent
  }
};
</script>

<style scoped >
.calendar-box {
  /*background: #4188d8;*/
  position: relative;
  height: 100%;
  z-index: 99;
}
.calendar-head {
  display: flex;
  height: 30px;
  line-height: 30px;
  padding: 0 20px;
  color: #3f3f3f;
  font-size: 13px;
  box-sizing: border-box;
  border-bottom: 1px solid #edf0f2;
}
.calendar-head li {
  flex-grow: 1;
  text-align: center;
}
.swiper-item {
  padding: 0 20px;
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
}
.swiper-item:nth-child(1) {
  left: -100%;
}
.swiper-item:nth-child(2) {
  left: 0;
}
.swiper-item:nth-child(3) {
  left: 100%;
}
.month ul {
  display: flex;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  min-height: 40px;
  padding-top: 5px;
  flex-wrap: wrap;
}
.month li {
  overflow: hidden;
  position: relative;
  width: 14.28%;
  height: 55px;
}
.week-day {
  position: relative;
  margin: auto;
  font-size: 12px;
  text-align: center;
  border: 0;
  line-height: 10px;
  overflow: hidden;
  z-index: 1;
  height: 100%;
}
.week-day i {
  display: block;
  text-align: center;
  font-size: 12px;
  font-style: normal;
  line-height: 14px;
  height: 14px;
}
.week-day .hasRicheng {
width: 5px;
    height: 5px;
    background: #b0b9bf;
    border-radius: 50%;
    margin: 5px auto;
}
.week-day .day {
  line-height: 26px;
  height: 26px;
  width: 26px;
  margin: 0 auto;
  border-radius: 50%;
}
.thing a {
  cursor: pointer;
  display: block;
  width: 100%;
  overflow: hidden;
  word-break: break-all;
  line-height: 16px;
  height: 16px;
}
.othermonth {
  opacity: 0.5;
}
.weekend {
  color: #b0b9bf;
}
.istoday {
  background: #919ca3 !important;
  color: #fff !important;
}
.ischecked {
  background-color: #1d78f4 !important;
  color: #fff;
}
.remind-top {
  position: absolute;
  top: 0;
  right: 0;
}
.midea-blue {
  color: #1d78f4;
}
.midea-red {
  color: #f25555;
}
.festival {
  color: #6c7880;
}
</style>
