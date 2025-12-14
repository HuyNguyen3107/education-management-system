export interface PrerequisiteSubject {
  id: string;
  registerCode: string;
  prerequisiteCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePrerequisiteSubjectRequest {
  registerCode: string;
  prerequisiteCode: string;
}

export interface UpdatePrerequisiteSubjectRequest {
  registerCode?: string;
  prerequisiteCode?: string;
}
