package com.example.server.dto;

/**
 * DTO cho mỗi mục lịch học
 * dayOfWeek: Thứ trong tuần (2-7 cho Thứ 2 - Thứ 7, 0 hoặc 8 cho Chủ nhật)
 * startPeriod: Tiết bắt đầu
 * numberOfPeriods: Số tiết
 * startDate: Ngày bắt đầu (yyyy-MM-dd)
 * endDate: Ngày kết thúc (yyyy-MM-dd)
 */
public class ScheduleItemDto {
    
    private String dayOfWeek;      // Thứ (2, 3, 4, 5, 6, 7, CN)
    private Integer startPeriod;   // Tiết bắt đầu
    private Integer numberOfPeriods; // Số tiết
    private String startDate;      // Ngày bắt đầu (yyyy-MM-dd)
    private String endDate;        // Ngày kết thúc (yyyy-MM-dd)
    private String room;           // Phòng học (tùy chọn, có thể khác phòng chung)

    public ScheduleItemDto() {
    }

    public ScheduleItemDto(String dayOfWeek, Integer startPeriod, Integer numberOfPeriods, 
                          String startDate, String endDate, String room) {
        this.dayOfWeek = dayOfWeek;
        this.startPeriod = startPeriod;
        this.numberOfPeriods = numberOfPeriods;
        this.startDate = startDate;
        this.endDate = endDate;
        this.room = room;
    }

    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public Integer getStartPeriod() {
        return startPeriod;
    }

    public void setStartPeriod(Integer startPeriod) {
        this.startPeriod = startPeriod;
    }

    public Integer getNumberOfPeriods() {
        return numberOfPeriods;
    }

    public void setNumberOfPeriods(Integer numberOfPeriods) {
        this.numberOfPeriods = numberOfPeriods;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }
}

