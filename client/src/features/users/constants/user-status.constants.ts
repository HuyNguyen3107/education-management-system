export const USER_STATUS = {
  LECTURER: [
    { value: "Teaching", label: "Đang dạy", color: "success" },
    { value: "OnLeave", label: "Nghỉ phép", color: "warning" },
    { value: "Resigned", label: "Nghỉ việc", color: "error" },
    { value: "Retired", label: "Đã nghỉ hưu", color: "default" },
  ],
  STUDENT: [
    { value: "Studying", label: "Đang học", color: "success" },
    { value: "Reserved", label: "Bảo lưu", color: "warning" },
    { value: "Graduated", label: "Đã tốt nghiệp", color: "info" },
    { value: "Suspended", label: "Đình chỉ học", color: "error" },
    { value: "DroppedOut", label: "Thôi học", color: "default" },
  ],
  // Fallback for other roles or legacy statuses
  COMMON: [
    { value: "Active", label: "Hoạt động", color: "success" },
    { value: "Inactive", label: "Ngừng hoạt động", color: "error" },
  ]
};

export const ALL_STATUSES = [
  ...USER_STATUS.LECTURER,
  ...USER_STATUS.STUDENT,
  ...USER_STATUS.COMMON
];

export const getStatusLabel = (status: string) => {
  const found = ALL_STATUSES.find(s => s.value === status);
  return found ? found.label : status;
};

export const getStatusColor = (status: string) => {
  const found = ALL_STATUSES.find(s => s.value === status);
  return found ? found.color : "default";
};
