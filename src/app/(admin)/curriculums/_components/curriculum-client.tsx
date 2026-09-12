"use client";

import { useState, useTransition, useMemo, type ChangeEvent } from "react";
import {
  BookOpen,
  BookMarked,
  Plus,
  Pencil,
  Trash2,
  Layers,
  AlertCircle,
  GraduationCap,
  CheckCircle2,
  Award,
  Search,
  BookCheck,
  FolderTree,
  Building2,
  X,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useT, useLocale } from "@/shared/lib/i18n/client";
import {
  LiyonCard,
  DataTable,
  StatusPill,
  LiyonDialog,
  LiyonDialogHeader,
  LiyonDialogBody,
  LiyonDialogFooter,
  LiyonDialogCloseButton,
  LiyonField,
  LiyonSelect,
  LiyonSwitch,
  RowMenuItem,
  type DataTableColumn,
} from "@/shared/components/liyon";
import { Button } from "@/components/ui/button";
import type {
  CurriculumDto,
  CurriculumDetailDto,
  CurriculumStatsDto,
  SubjectDto,
  DepartmentDto,
} from "@/features/curriculum";
import {
  getCurriculumStatsAction,
  getCurriculumsAction,
  getCurriculumDetailAction,
  createCurriculumAction,
  updateCurriculumAction,
  deleteCurriculumAction,
  getSubjectsAction,
  createSubjectAction,
  updateSubjectAction,
  deleteSubjectAction,
  assignSubjectAction,
  removeSubjectAction,
  getDepartmentsAction,
  createDepartmentAction,
  updateDepartmentAction,
  deleteDepartmentAction,
} from "@/features/curriculum/actions";

interface Props {
  initialStats: CurriculumStatsDto;
  initialCurriculums: CurriculumDto[];
  initialSubjects: SubjectDto[];
  initialDepartments: DepartmentDto[];
  canManage: boolean;
}

const DEFAULT_CATEGORIES = [
  "หมวดวิชาศึกษาทั่วไป",
  "หมวดวิชาเฉพาะ / พื้นฐานวิชาชีพ",
  "หมวดวิชาเอก / บังคับ",
  "หมวดวิชาเอกเลือก",
  "หมวดวิชาเลือกเสรี",
  "หมวดวิชาฝึกงาน / สหกิจศึกษา",
];

export function CurriculumClient({
  initialStats,
  initialCurriculums,
  initialSubjects,
  initialDepartments,
  canManage,
}: Props) {
  const t = useT();
  const locale = useLocale();

  const [stats, setStats] = useState<CurriculumStatsDto>(initialStats);
  const [curriculums, setCurriculums] = useState<CurriculumDto[]>(initialCurriculums);
  const [subjects, setSubjects] = useState<SubjectDto[]>(initialSubjects);
  const [departments, setDepartments] = useState<DepartmentDto[]>(initialDepartments);
  const [activeTab, setActiveTab] = useState<"curriculums" | "subjects" | "departments">("curriculums");
  const [isPending, startTransition] = useTransition();

  // Search & Filter
  const [curriculumSearch, setCurriculumSearch] = useState("");
  const [curriculumDeptFilter, setCurriculumDeptFilter] = useState("ALL");
  const [curriculumStatus, setCurriculumStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  const [subjectSearch, setSubjectSearch] = useState("");
  const [subjectStatus, setSubjectStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  const [deptSearch, setDeptSearch] = useState("");
  const [deptStatus, setDeptStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  // Curriculum Dialogs
  const [curriculumModalOpen, setCurriculumModalOpen] = useState(false);
  const [editingCurriculum, setEditingCurriculum] = useState<CurriculumDto | null>(null);
  const [deleteCurriculumItem, setDeleteCurriculumItem] = useState<CurriculumDto | null>(null);

  // Curriculum Form state
  const [cCode, setCCode] = useState("");
  const [cNameTh, setCNameTh] = useState("");
  const [cNameEn, setCNameEn] = useState("");
  const [cDegreeTh, setCDegreeTh] = useState("");
  const [cDegreeEn, setCDegreeEn] = useState("");
  const [cFaculty, setCFaculty] = useState("คณะวิทยาการจัดการ");
  const [cDepartmentId, setCDepartmentId] = useState("");
  const [cTotalCredits, setCTotalCredits] = useState(120);
  const [cRevisionYear, setCRevisionYear] = useState(2567);
  const [cStatus, setCStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  // TQF 2 Additional Form States
  const [cDurationYears, setCDurationYears] = useState(4);
  const [cStudyType, setCStudyType] = useState("ปริญญาตรีทางวิชาการ (หลักสูตร ๔ ปี) ภาษาไทยและภาษาอังกฤษ");
  const [cCampusLocation, setCCampusLocation] = useState("");
  const [cPhilosophy, setCPhilosophy] = useState("");
  const [cObjectives, setCObjectives] = useState("");
  const [cCareerPaths, setCCareerPaths] = useState("");
  const [cAdmissionReq, setCAdmissionReq] = useState("");
  const [cTuitionFees, setCTuitionFees] = useState("");
  const [cGraduationCriteria, setCGraduationCriteria] = useState("");
  const [cPlosText, setCPlosText] = useState("");
  const [curriculumFormTab, setCurriculumFormTab] = useState<"general" | "philosophy" | "careers" | "plos">("general");

  // Subject Dialogs
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectDto | null>(null);
  const [deleteSubjectItem, setDeleteSubjectItem] = useState<SubjectDto | null>(null);

  // Subject Form state
  const [sCode, setSCode] = useState("");
  const [sNameTh, setSNameTh] = useState("");
  const [sNameEn, setSNameEn] = useState("");
  const [sCredits, setSCredits] = useState(3);
  const [sCreditInfo, setSCreditInfo] = useState("3(3-0-6)");
  const [sDescription, setSDescription] = useState("");
  const [sStatus, setSStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  // Department Dialogs
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentDto | null>(null);
  const [deleteDeptItem, setDeleteDeptItem] = useState<DepartmentDto | null>(null);

  // Department Form state
  const [dCode, setDCode] = useState("");
  const [dNameTh, setDNameTh] = useState("");
  const [dNameEn, setDNameEn] = useState("");
  const [dDescription, setDDescription] = useState("");
  const [dStatus, setDStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  // Structure Modal
  const [structureCurriculum, setStructureCurriculum] = useState<CurriculumDetailDto | null>(null);
  const [structureLoading, setStructureLoading] = useState(false);
  const [assignSubjectId, setAssignSubjectId] = useState("");
  const [assignCategory, setAssignCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [assignCompulsory, setAssignCompulsory] = useState(true);

  // Refresh helper
  const refreshAll = async () => {
    const [st, cur, sub, dept] = await Promise.all([
      getCurriculumStatsAction(),
      getCurriculumsAction(),
      getSubjectsAction(),
      getDepartmentsAction(),
    ]);
    if (st.ok) setStats(st.data);
    if (cur.ok) setCurriculums(cur.data);
    if (sub.ok) setSubjects(sub.data);
    if (dept.ok) setDepartments(dept.data);
  };

  // ----------------------------------------------------
  // Curriculum Handlers
  // ----------------------------------------------------
  const openCreateCurriculum = () => {
    setEditingCurriculum(null);
    setCCode("");
    setCNameTh("");
    setCNameEn("");
    setCDegreeTh("");
    setCDegreeEn("");
    setCFaculty("คณะวิทยาการจัดการ");
    setCDepartmentId("");
    setCTotalCredits(120);
    setCRevisionYear(2567);
    setCStatus("ACTIVE");
    setCDurationYears(4);
    setCStudyType("ปริญญาตรีทางวิชาการ (หลักสูตร ๔ ปี) ภาษาไทยและภาษาอังกฤษ");
    setCCampusLocation("");
    setCPhilosophy("");
    setCObjectives("");
    setCCareerPaths("");
    setCAdmissionReq("");
    setCTuitionFees("");
    setCGraduationCriteria("");
    setCPlosText("");
    setCurriculumFormTab("general");
    setCurriculumModalOpen(true);
  };

  const openEditCurriculum = (c: CurriculumDto) => {
    setEditingCurriculum(c);
    setCCode(c.code);
    setCNameTh(c.nameTh);
    setCNameEn(c.nameEn);
    setCDegreeTh(c.degreeTh ?? "");
    setCDegreeEn(c.degreeEn ?? "");
    setCFaculty(c.faculty ?? "คณะวิทยาการจัดการ");
    setCDepartmentId(c.departmentId ?? "");
    setCTotalCredits(c.totalCredits);
    setCRevisionYear(c.revisionYear);
    setCStatus(c.status as "ACTIVE" | "INACTIVE");
    setCDurationYears(c.durationYears ?? 4);
    setCStudyType(c.studyType ?? "ปริญญาตรีทางวิชาการ (หลักสูตร ๔ ปี) ภาษาไทยและภาษาอังกฤษ");
    setCCampusLocation(c.campusLocation ?? "");
    setCPhilosophy(c.philosophy ?? "");
    setCObjectives(c.objectives ?? "");
    setCCareerPaths(c.careerPaths ?? "");
    setCAdmissionReq(c.admissionReq ?? "");
    setCTuitionFees(c.tuitionFees ?? "");
    setCGraduationCriteria(c.graduationCriteria ?? "");
    if (Array.isArray(c.plos)) {
      setCPlosText(
        c.plos
          .map((p: unknown) => {
            if (typeof p === "string") return p;
            if (typeof p === "object" && p !== null) {
              const item = p as Record<string, unknown>;
              return `${String(item.code ?? "")}: ${String(item.titleTh ?? item.title ?? "")}`;
            }
            return "";
          })
          .filter(Boolean)
          .join("\n")
      );
    } else if (typeof c.plos === "string") {
      setCPlosText(c.plos);
    } else {
      setCPlosText("");
    }
    setCurriculumFormTab("general");
    setCurriculumModalOpen(true);
  };

  const fillMcuSample = () => {
    setCCode("25611851100597");
    setCNameTh("หลักสูตรพุทธศาสตรบัณฑิต สาขาวิชาพระพุทธศาสนา");
    setCNameEn("Bachelor of Arts Program in Buddhist Studies");
    setCDegreeTh("พุทธศาสตรบัณฑิต (พระพุทธศาสนา) / พธ.บ. (พระพุทธศาสนา)");
    setCDegreeEn("Bachelor of Arts (Buddhist Studies) / B.A. (Buddhist Studies)");
    setCFaculty("วิทยาเขตอุบลราชธานี");
    setCTotalCredits(132);
    setCRevisionYear(2570);
    setCDurationYears(4);
    setCStudyType("หลักสูตรปริญญาตรีทางวิชาการ (หลักสูตร ๔ ปี) ภาษาไทยและภาษาอังกฤษ รับนิสิตไทยและนิสิตต่างประเทศ");
    setCCampusLocation("มหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย วิทยาเขตอุบลราชธานี หมู่ที่ ๑ ตำบลกระโสบ อำเภอเมืองอุบลราชธานี จังหวัดอุบลราชธานี ๓๔๐๐๐");
    setCPhilosophy("จัดการศึกษาพระพุทธศาสนาบูรณาการกับศาสตร์สมัยใหม่ ผลิตบัณฑิตให้มีความรู้ดี มีศีลธรรม นำสังคมสู่สันติสุข");
    setCObjectives(`๑. เพื่อผลิตบัณฑิตมีความรอบรู้ในหลักพระพุทธศาสนาและศาสตร์ที่เกี่ยวข้อง สามารถประยุกต์องค์ความรู้กับศาสตร์สมัยใหม่ได้อย่างเหมาะสม
๒. เพื่อผลิตบัณฑิตให้มีทักษะการถ่ายทอดหลักพุทธธรรมกับศาสตร์สมัยใหม่ เพื่อการเผยแผ่และการแก้ไขปัญหาสังคมในยุคปัจจุบันได้
๓. เพื่อผลิตบัณฑิตสามารถปฏิบัติตนตามหลักคุณธรรม จริยธรรม ยึดมั่นในหลักพระพุทธศาสนา มีความรับผิดชอบต่อสังคม และเป็นแบบอย่างที่ดีในการดำเนินชีวิต
๔. เพื่อผลิตบัณฑิตให้มีภาวะผู้นำ สามารถทำงานร่วมกับผู้อื่นและปฏิบัติงานเป็นทีมได้อย่างเหมาะสม พร้อมทั้งมีทักษะการเรียนรู้ตลอดชีวิตและสามารถปรับตัวต่อการเปลี่ยนแปลงของสังคมในศตวรรษที่ ๒๑
๕. เพื่อผลิตบัณฑิตสามารถใช้เทคโนโลยีดิจิทัล สารสนเทศ พุทธนวัตกรรม เพื่อการสื่อสาร การเผยแผ่พระพุทธศาสนา การจัดการศึกษา และการบริหารองค์กรได้อย่างเหมาะสม`);
    setCCareerPaths(`๑. สายงานภาครัฐและรัฐวิสาหกิจ: นักวิชาการศาสนา (สำนักงานพระพุทธศาสนาแห่งชาติ และกระทรวงวัฒนธรรม), เจ้าหน้าที่กองศาสนพิธี, อนุศาสนาจารย์ (กองทัพบก กองทัพเรือ กองทัพอากาศ สำนักงานตำรวจแห่งชาติ), นักพัฒนาสังคม/นักสังคมสงเคราะห์ (กรมราชทัณฑ์ กรมสุขภาพจิต พม.), ครูผู้สอนกลุ่มสาระสังคมศึกษา ศาสนา และวัฒนธรรม / พระสอนศีลธรรม
๒. สายงานการส่งเสริมสุขภาพจิต สุขภาวะ และสังคมสงเคราะห์: นักจัดกระบวนการเรียนรู้และสมาธิบำบัด (Mindfulness & Meditation Facilitator), นักเยียวยาจิตใจและผู้ดูแลสุขภาวะทางจิตวิญญาณ (Spiritual Caregiver / Palliative Care) ในโรงพยาบาลและศูนย์ดูแลผู้ป่วยระยะสุดท้าย, นักพัฒนาสังคมและฟื้นฟูจิตใจในองค์กรสาธารณกุศลและ NGOs
๓. สายงานสื่อ เศรษฐกิจสร้างสรรค์ และการท่องเที่ยวเชิงวัฒนธรรม: นักสร้างสรรค์เนื้อหาทางศาสนา ศิลปวัฒนธรรม และมรดกท้องถิ่น (Religious & Cultural Content Creator), นักจัดการและผู้นำเที่ยวเชิงจิตวิญญาณและพุทธศิลป์ (Spiritual & Cultural Tourism Specialist), ภัณฑารักษ์และนักจัดการมรดกทางวัฒนธรรมในแหล่งเรียนรู้หรือพิพิธภัณฑ์ท้องถิ่น
๔. สายงานการบริหารทรัพยากรมนุษย์และส่งเสริมจริยธรรมในองค์กรเอกชน: เจ้าหน้าที่ฝึกอบรมและพัฒนาทรัพยากรมนุษย์ (HRD Officer), เจ้าหน้าที่ดำเนินงานด้านความรับผิดชอบต่อสังคมและสิ่งแวดล้อมขององค์กร (CSR Officer)
๕. สายงานการเผยแผ่และส่งเสริมพระพุทธศาสนา: พระธรรมทูต (ทั้งในประเทศและต่างประเทศ), พระวิปัสสนาจารย์ / วิทยากรบรรยายธรรม, นักวิจัยด้านพุทธศาสน์ศึกษาและท้องถิ่นศึกษา`);
    setCAdmissionReq(`๑. คุณสมบัติของผู้สมัครเข้าศึกษาที่เป็นพระภิกษุ/สามเณร:
- ต้องสำเร็จการศึกษาระดับมัธยมศึกษาตอนปลาย หรือเทียบเท่า / หรือสอบได้เปรียญธรรม ๓ ประโยคขึ้นไป
- ตามข้อบังคับมหาวิทยาลัยมหาจุฬาลงกรณราชวิทยาลัย ว่าด้วยการศึกษาระดับปริญญาตรี พ.ศ. ๒๕๖๖

๒. คุณสมบัติของผู้สมัครเข้าศึกษาที่เป็นคฤหัสถ์:
- ต้องสำเร็จการศึกษาระดับมัธยมศึกษาตอนปลาย (ม.๖) หรือเทียบเท่า / ประกาศนียบัตรวิชาชีพ (ปวช.)
- หรือผ่านการคัดเลือกตามเกณฑ์ของสำนักงานปลัดกระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม (สป.อว.)`);
    setCTuitionFees("ประมาณ ๘,๐๐๐ บาท/ปี (ค่าบำรุงการศึกษาและค่าลงทะเบียน)");
    setCGraduationCriteria(`๑. สอบได้หน่วยกิตสะสมครบตามหลักสูตร ๑๓๒ หน่วยกิต ภายในระยะเวลาไม่เกิน ๘ ปีการศึกษา และมีค่าเฉลี่ยสะสม (GPAX) ไม่ต่ำกว่า ๒.๐๐
๒. ผ่านการฝึกประสบการณ์วิชาชีพ เป็นระยะเวลา ๑ ปี ตามกำหนดของหลักสูตรและมาตรฐานองค์กรวิชาชีพ
๓. ผ่านการฝึกภาคปฏิบัติตามข้อบังคับ มจร ว่าด้วยการฝึกภาคปฏิบัติวิปัสสนากัมมัฏฐาน และการปฏิบัติศาสนกิจหรือบริการสังคม
๔. สอบผ่านเกณฑ์มาตรฐานภาษาอังกฤษ และผ่านเกณฑ์มาตรฐานทักษะการใช้เทคโนโลยีสารสนเทศของนิสิตระดับปริญญาตรี
๕. บรรลุผลลัพธ์การเรียนรู้ตามมาตรฐานคุณวุฒิระดับปริญญาตรี (PLOs) และไม่มีพันธะอื่นใดกับมหาวิทยาลัย`);
    setCPlosText(`PLO 1: มีความรอบรู้ในหลักพระพุทธศาสนาและศาสตร์ที่เกี่ยวข้อง สามารถประยุกต์องค์ความรู้กับศาสตร์สมัยใหม่ได้อย่างเหมาะสม
PLO 2: มีทักษะการถ่ายทอดหลักพุทธธรรมกับศาสตร์สมัยใหม่ เพื่อการเผยแผ่และการแก้ไขปัญหาสังคมในยุคปัจจุบันได้
PLO 3: สามารถปฏิบัติตนตามหลักคุณธรรม จริยธรรม ยึดมั่นในหลักพระพุทธศาสนา มีความรับผิดชอบต่อสังคม และเป็นแบบอย่างที่ดีในการดำเนินชีวิต
PLO 4: มีภาวะผู้นำ สามารถทำงานร่วมกับผู้อื่นและปฏิบัติงานเป็นทีมได้อย่างเหมาะสม พร้อมทั้งมีทักษะการเรียนรู้ตลอดชีวิตและสามารถปรับตัวต่อการเปลี่ยนแปลงของสังคมในศตวรรษที่ ๒๑
PLO 5: สามารถใช้เทคโนโลยีดิจิทัล สารสนเทศ พุทธนวัตกรรม เพื่อการสื่อสาร การเผยแผ่พระพุทธศาสนา การจัดการศึกษา และการบริหารองค์กรได้อย่างเหมาะสม`);
    toast.success("กรอกข้อมูลตัวอย่าง มคอ. 2 เรียบร้อยแล้ว (ตรวจสอบได้ในแต่ละแท็บ)");
  };

  const handleSaveCurriculum = () => {
    if (!cCode.trim() || !cNameTh.trim() || !cNameEn.trim()) {
      toast.error(t("error.validation"));
      return;
    }

    startTransition(async () => {
      const plosArray = cPlosText.split("\n").map((l) => l.trim()).filter(Boolean).map((line, idx) => {
        const parts = line.split(/:\s*/);
        if (parts.length > 1) {
          return { code: parts[0], titleTh: parts.slice(1).join(": ") };
        }
        return { code: `PLO ${idx + 1}`, titleTh: line };
      });

      const payload = {
        departmentId: cDepartmentId.trim() || null,
        code: cCode.trim(),
        nameTh: cNameTh.trim(),
        nameEn: cNameEn.trim(),
        degreeTh: cDegreeTh.trim() || null,
        degreeEn: cDegreeEn.trim() || null,
        faculty: cFaculty.trim() || null,
        totalCredits: Number(cTotalCredits) || 0,
        revisionYear: Number(cRevisionYear) || 2567,
        status: cStatus,
        durationYears: Number(cDurationYears) || 4,
        studyType: cStudyType.trim() || null,
        campusLocation: cCampusLocation.trim() || null,
        philosophy: cPhilosophy.trim() || null,
        objectives: cObjectives.trim() || null,
        careerPaths: cCareerPaths.trim() || null,
        admissionReq: cAdmissionReq.trim() || null,
        tuitionFees: cTuitionFees.trim() || null,
        graduationCriteria: cGraduationCriteria.trim() || null,
        plos: plosArray,
      };

      if (editingCurriculum) {
        const res = await updateCurriculumAction({
          ...payload,
          id: editingCurriculum.id,
        });
        if (res.ok) {
          toast.success(t("curriculums.updateSuccess"));
          setCurriculumModalOpen(false);
          await refreshAll();
        } else {
          toast.error(t("common.error"));
        }
      } else {
        const res = await createCurriculumAction(payload);
        if (res.ok) {
          toast.success(t("curriculums.createSuccess"));
          setCurriculumModalOpen(false);
          await refreshAll();
        } else {
          toast.error(t("common.error"));
        }
      }
    });
  };

  const handleDeleteCurriculum = (item: CurriculumDto) => {
    startTransition(async () => {
      const res = await deleteCurriculumAction(item.id);
      if (res.ok) {
        toast.success(t("curriculums.deleteSuccess"));
        setDeleteCurriculumItem(null);
        await refreshAll();
      } else {
        toast.error(t("common.error"));
      }
    });
  };

  // ----------------------------------------------------
  // Subject Handlers
  // ----------------------------------------------------
  const openCreateSubject = () => {
    setEditingSubject(null);
    setSCode("");
    setSNameTh("");
    setSNameEn("");
    setSCredits(3);
    setSCreditInfo("3(3-0-6)");
    setSDescription("");
    setSStatus("ACTIVE");
    setSubjectModalOpen(true);
  };

  const openEditSubject = (s: SubjectDto) => {
    setEditingSubject(s);
    setSCode(s.code);
    setSNameTh(s.nameTh);
    setSNameEn(s.nameEn);
    setSCredits(s.credits);
    setSCreditInfo(s.creditInfo ?? "");
    setSDescription(s.description ?? "");
    setSStatus(s.status as "ACTIVE" | "INACTIVE");
    setSubjectModalOpen(true);
  };

  const handleSaveSubject = () => {
    if (!sCode.trim() || !sNameTh.trim() || !sNameEn.trim()) {
      toast.error(t("error.validation"));
      return;
    }

    startTransition(async () => {
      const payload = {
        code: sCode.trim(),
        nameTh: sNameTh.trim(),
        nameEn: sNameEn.trim(),
        credits: Number(sCredits) || 3,
        creditInfo: sCreditInfo.trim() || null,
        description: sDescription.trim() || null,
        status: sStatus,
      };

      if (editingSubject) {
        const res = await updateSubjectAction({
          ...payload,
          id: editingSubject.id,
        });
        if (res.ok) {
          toast.success(t("subjects.updateSuccess"));
          setSubjectModalOpen(false);
          await refreshAll();
        } else {
          toast.error(t("common.error"));
        }
      } else {
        const res = await createSubjectAction(payload);
        if (res.ok) {
          toast.success(t("subjects.createSuccess"));
          setSubjectModalOpen(false);
          await refreshAll();
        } else {
          toast.error(t("common.error"));
        }
      }
    });
  };

  const handleDeleteSubject = (item: SubjectDto) => {
    startTransition(async () => {
      const res = await deleteSubjectAction(item.id);
      if (res.ok) {
        toast.success(t("subjects.deleteSuccess"));
        setDeleteSubjectItem(null);
        await refreshAll();
      } else {
        toast.error(t("common.error"));
      }
    });
  };

  // ----------------------------------------------------
  // Department Handlers
  // ----------------------------------------------------
  const openCreateDept = () => {
    setEditingDept(null);
    setDCode("");
    setDNameTh("");
    setDNameEn("");
    setDDescription("");
    setDStatus("ACTIVE");
    setDeptModalOpen(true);
  };

  const openEditDept = (d: DepartmentDto) => {
    setEditingDept(d);
    setDCode(d.code);
    setDNameTh(d.nameTh);
    setDNameEn(d.nameEn);
    setDDescription(d.description ?? "");
    setDStatus(d.status as "ACTIVE" | "INACTIVE");
    setDeptModalOpen(true);
  };

  const handleSaveDept = () => {
    if (!dCode.trim() || !dNameTh.trim() || !dNameEn.trim()) {
      toast.error(t("error.validation"));
      return;
    }

    startTransition(async () => {
      const payload = {
        code: dCode.trim(),
        nameTh: dNameTh.trim(),
        nameEn: dNameEn.trim(),
        description: dDescription.trim() || null,
        status: dStatus,
      };

      if (editingDept) {
        const res = await updateDepartmentAction({
          ...payload,
          id: editingDept.id,
        });
        if (res.ok) {
          toast.success(t("departments.updateSuccess"));
          setDeptModalOpen(false);
          await refreshAll();
        } else {
          toast.error(t("common.error"));
        }
      } else {
        const res = await createDepartmentAction(payload);
        if (res.ok) {
          toast.success(t("departments.createSuccess"));
          setDeptModalOpen(false);
          await refreshAll();
        } else {
          toast.error(t("common.error"));
        }
      }
    });
  };

  const handleDeleteDept = (item: DepartmentDto) => {
    startTransition(async () => {
      const res = await deleteDepartmentAction(item.id);
      if (res.ok) {
        toast.success(t("departments.deleteSuccess"));
        setDeleteDeptItem(null);
        await refreshAll();
      } else {
        toast.error(t("common.error"));
      }
    });
  };

  // ----------------------------------------------------
  // Structure & Assignment Handlers
  // ----------------------------------------------------
  const openStructureModal = async (c: CurriculumDto) => {
    setStructureLoading(true);
    setStructureCurriculum(null);
    setAssignSubjectId("");
    setAssignCategory(DEFAULT_CATEGORIES[0]);
    setCustomCategory("");
    setAssignCompulsory(true);

    const res = await getCurriculumDetailAction(c.id);
    if (res.ok && res.data) {
      setStructureCurriculum(res.data);
    } else {
      toast.error(t("common.error"));
    }
    setStructureLoading(false);
  };

  const reloadStructure = async (curriculumId: string) => {
    const res = await getCurriculumDetailAction(curriculumId);
    if (res.ok && res.data) {
      setStructureCurriculum(res.data);
    }
    await refreshAll();
  };

  const handleAssignSubject = () => {
    if (!structureCurriculum || !assignSubjectId) {
      toast.error(t("error.validation"));
      return;
    }

    const finalCategory = assignCategory === "CUSTOM" ? customCategory.trim() : assignCategory;
    if (!finalCategory) {
      toast.error(t("error.validation"));
      return;
    }

    startTransition(async () => {
      const res = await assignSubjectAction({
        curriculumId: structureCurriculum.id,
        subjectId: assignSubjectId,
        category: finalCategory,
        isCompulsory: assignCompulsory,
      });

      if (res.ok) {
        toast.success(t("curriculums.assignSuccess"));
        setAssignSubjectId("");
        await reloadStructure(structureCurriculum.id);
      } else {
        toast.error(t("common.error"));
      }
    });
  };

  const handleRemoveSubject = (subjectId: string) => {
    if (!structureCurriculum) return;

    startTransition(async () => {
      const res = await removeSubjectAction(structureCurriculum.id, subjectId);
      if (res.ok) {
        toast.success(t("curriculums.removeSuccess"));
        await reloadStructure(structureCurriculum.id);
      } else {
        toast.error(t("common.error"));
      }
    });
  };

  // ----------------------------------------------------
  // Filtered Lists
  // ----------------------------------------------------
  const filteredCurriculums = useMemo(() => {
    return curriculums.filter((c) => {
      const matchSearch =
        curriculumSearch.trim() === "" ||
        c.code.toLowerCase().includes(curriculumSearch.toLowerCase()) ||
        c.nameTh.toLowerCase().includes(curriculumSearch.toLowerCase()) ||
        c.nameEn.toLowerCase().includes(curriculumSearch.toLowerCase()) ||
        (c.department && c.department.nameTh.toLowerCase().includes(curriculumSearch.toLowerCase()));

      const matchStatus = curriculumStatus === "ALL" || c.status === curriculumStatus;

      const matchDept =
        curriculumDeptFilter === "ALL" ||
        (curriculumDeptFilter === "NONE" ? !c.departmentId : c.departmentId === curriculumDeptFilter);

      return matchSearch && matchStatus && matchDept;
    });
  }, [curriculums, curriculumSearch, curriculumStatus, curriculumDeptFilter]);

  const filteredSubjects = useMemo(() => {
    return subjects.filter((s) => {
      const matchSearch =
        subjectSearch.trim() === "" ||
        s.code.toLowerCase().includes(subjectSearch.toLowerCase()) ||
        s.nameTh.toLowerCase().includes(subjectSearch.toLowerCase()) ||
        s.nameEn.toLowerCase().includes(subjectSearch.toLowerCase());
      const matchStatus = subjectStatus === "ALL" || s.status === subjectStatus;
      return matchSearch && matchStatus;
    });
  }, [subjects, subjectSearch, subjectStatus]);

  const filteredDepartments = useMemo(() => {
    return departments.filter((d) => {
      const matchSearch =
        deptSearch.trim() === "" ||
        d.code.toLowerCase().includes(deptSearch.toLowerCase()) ||
        d.nameTh.toLowerCase().includes(deptSearch.toLowerCase()) ||
        d.nameEn.toLowerCase().includes(deptSearch.toLowerCase());
      const matchStatus = deptStatus === "ALL" || d.status === deptStatus;
      return matchSearch && matchStatus;
    });
  }, [departments, deptSearch, deptStatus]);

  // Grouped subjects in structure modal
  const groupedStructureSubjects = useMemo(() => {
    if (!structureCurriculum) return {};
    const map: Record<string, typeof structureCurriculum.subjects> = {};
    for (const item of structureCurriculum.subjects) {
      const cat = item.category || "หมวดวิชาอื่นๆ";
      if (!map[cat]) map[cat] = [];
      map[cat].push(item);
    }
    return map;
  }, [structureCurriculum]);

  const structureTotalCredits = useMemo(() => {
    if (!structureCurriculum) return 0;
    return structureCurriculum.subjects.reduce((sum, item) => sum + item.subject.credits, 0);
  }, [structureCurriculum]);

  // Available subjects to assign (not already in curriculum)
  const availableSubjectsToAssign = useMemo(() => {
    if (!structureCurriculum) return [];
    const assignedIds = new Set(structureCurriculum.subjects.map((cs) => cs.subjectId));
    return subjects.filter((s) => !assignedIds.has(s.id) && s.status === "ACTIVE");
  }, [subjects, structureCurriculum]);

  // ----------------------------------------------------
  // Table Columns
  // ----------------------------------------------------
  const curriculumColumns: DataTableColumn<CurriculumDto>[] = [
    {
      key: "code",
      header: t("curriculums.code"),
      render: (row) => (
        <div>
          <span className="font-semibold text-primary">{row.code}</span>
          <div className="text-xs text-muted-foreground">
            {t("curriculums.revisionYear")}: {row.revisionYear}
          </div>
        </div>
      ),
    },
    {
      key: "nameTh",
      header: t("curriculums.nameTh"),
      render: (row) => (
        <div>
          <div className="font-medium text-foreground">{row.nameTh}</div>
          <div className="text-xs text-muted-foreground">{row.nameEn}</div>
        </div>
      ),
    },
    {
      key: "department",
      header: t("curriculums.department"),
      render: (row) => (
        row.department ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-secondary/80 px-2 py-0.5 text-xs font-medium text-secondary-foreground">
            <Building2 className="h-3 w-3 text-muted-foreground" />
            {locale === "en" ? row.department.nameEn || row.department.nameTh : row.department.nameTh}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )
      ),
    },
    {
      key: "degree",
      header: t("curriculums.degreeTh"),
      render: (row) => (
        <span className="text-sm text-foreground">
          {locale === "en" ? row.degreeEn || row.degreeTh || "—" : row.degreeTh || row.degreeEn || "—"}
        </span>
      ),
    },
    {
      key: "credits",
      header: t("curriculums.totalCredits"),
      className: "text-center",
      render: (row) => (
        <span className="font-medium">{row.totalCredits}</span>
      ),
    },
    {
      key: "subjects",
      header: t("curriculums.subjectCount"),
      className: "text-center",
      render: (row) => (
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          <BookCheck className="h-3 w-3" />
          {row.subjectCount}
        </span>
      ),
    },
    {
      key: "status",
      header: t("curriculums.status"),
      render: (row) => (
        <StatusPill tone={row.status === "ACTIVE" ? "ok" : "off"}>
          {row.status === "ACTIVE" ? t("status.active") : t("status.inactive")}
        </StatusPill>
      ),
    },
  ];

  const subjectColumns: DataTableColumn<SubjectDto>[] = [
    {
      key: "code",
      header: t("subjects.code"),
      render: (row) => (
        <span className="font-semibold text-primary">{row.code}</span>
      ),
    },
    {
      key: "nameTh",
      header: t("subjects.nameTh"),
      render: (row) => (
        <div>
          <div className="font-medium text-foreground">{row.nameTh}</div>
          <div className="text-xs text-muted-foreground">{row.nameEn}</div>
        </div>
      ),
    },
    {
      key: "credits",
      header: t("subjects.credits"),
      render: (row) => (
        <div>
          <span className="font-medium">{row.credits} {t("subjects.credits")}</span>
          {row.creditInfo && (
            <div className="text-xs text-muted-foreground">{row.creditInfo}</div>
          )}
        </div>
      ),
    },
    {
      key: "description",
      header: t("subjects.description"),
      render: (row) => (
        <span className="line-clamp-2 text-xs text-muted-foreground max-w-md">
          {row.description || "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: t("subjects.status"),
      render: (row) => (
        <StatusPill tone={row.status === "ACTIVE" ? "ok" : "off"}>
          {row.status === "ACTIVE" ? t("status.active") : t("status.inactive")}
        </StatusPill>
      ),
    },
  ];

  const departmentColumns: DataTableColumn<DepartmentDto>[] = [
    {
      key: "code",
      header: t("departments.code"),
      render: (row) => (
        <span className="font-semibold text-primary">{row.code}</span>
      ),
    },
    {
      key: "nameTh",
      header: t("departments.nameTh"),
      render: (row) => (
        <div>
          <div className="font-medium text-foreground">{row.nameTh}</div>
          <div className="text-xs text-muted-foreground">{row.nameEn}</div>
        </div>
      ),
    },
    {
      key: "description",
      header: t("departments.description"),
      render: (row) => (
        <span className="line-clamp-2 text-xs text-muted-foreground max-w-md">
          {row.description || "—"}
        </span>
      ),
    },
    {
      key: "curriculumCount",
      header: t("departments.curriculumCount"),
      className: "text-center",
      render: (row) => (
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          <BookOpen className="h-3 w-3" />
          {row.curriculumCount} {t("curriculums.tabCurriculums")}
        </span>
      ),
    },
    {
      key: "status",
      header: t("departments.status"),
      render: (row) => (
        <StatusPill tone={row.status === "ACTIVE" ? "ok" : "off"}>
          {row.status === "ACTIVE" ? t("status.active") : t("status.inactive")}
        </StatusPill>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            {t("curriculums.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t("curriculums.subtitle")}</p>
        </div>
        {canManage && (
          <div className="flex gap-2">
            {activeTab === "curriculums" && (
              <Button onClick={openCreateCurriculum} className="gap-2">
                <Plus className="h-4 w-4" />
                {t("curriculums.create")}
              </Button>
            )}
            {activeTab === "subjects" && (
              <Button onClick={openCreateSubject} className="gap-2">
                <Plus className="h-4 w-4" />
                {t("subjects.create")}
              </Button>
            )}
            {activeTab === "departments" && (
              <Button onClick={openCreateDept} className="gap-2">
                <Plus className="h-4 w-4" />
                {t("departments.create")}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Metrics / Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <LiyonCard className="p-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.totalCurriculums}</div>
            <div className="text-xs text-muted-foreground">{t("curriculums.statTotal")}</div>
          </div>
        </LiyonCard>

        <LiyonCard className="p-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.activeCurriculums}</div>
            <div className="text-xs text-muted-foreground">{t("curriculums.statActive")}</div>
          </div>
        </LiyonCard>

        <LiyonCard className="p-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalDepartments}</div>
            <div className="text-xs text-muted-foreground">{t("curriculums.statDepartments")}</div>
          </div>
        </LiyonCard>

        <LiyonCard className="p-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <BookMarked className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalSubjects}</div>
            <div className="text-xs text-muted-foreground">{t("curriculums.statSubjects")}</div>
          </div>
        </LiyonCard>

        <LiyonCard className="p-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.avgCredits}</div>
            <div className="text-xs text-muted-foreground">{t("curriculums.statCredits")}</div>
          </div>
        </LiyonCard>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("curriculums")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "curriculums"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          {t("curriculums.tabCurriculums")}
          <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
            {curriculums.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("subjects")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "subjects"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookMarked className="h-4 w-4" />
          {t("curriculums.tabSubjects")}
          <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
            {subjects.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("departments")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "departments"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building2 className="h-4 w-4" />
          {t("curriculums.tabDepartments")}
          <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs">
            {departments.length}
          </span>
        </button>
      </div>

      {/* TAB 1: Curriculums */}
      {activeTab === "curriculums" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={`${t("common.search")}...`}
                value={curriculumSearch}
                onChange={(e) => setCurriculumSearch(e.target.value)}
                className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <LiyonSelect
                value={curriculumDeptFilter}
                onChange={(e) => setCurriculumDeptFilter(e.target.value)}
              >
                <option value="ALL">{t("curriculums.filterDepartment")}</option>
                <option value="NONE">{t("curriculums.noDepartment")}</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} - {locale === "en" ? d.nameEn || d.nameTh : d.nameTh}
                  </option>
                ))}
              </LiyonSelect>

              <LiyonSelect
                value={curriculumStatus}
                onChange={(e) => setCurriculumStatus(e.target.value as "ALL" | "ACTIVE" | "INACTIVE")}
              >
                <option value="ALL">{t("common.all")}</option>
                <option value="ACTIVE">{t("status.active")}</option>
                <option value="INACTIVE">{t("status.inactive")}</option>
              </LiyonSelect>
            </div>
          </div>

          <LiyonCard>
            <DataTable<CurriculumDto>
              state={filteredCurriculums.length === 0 ? "empty" : "data"}
              headHeading={t("curriculums.title")}
              rows={filteredCurriculums}
              columns={curriculumColumns}
              getRowId={(row) => row.id}
              renderRowMenu={(row) => (
                <>
                  <RowMenuItem
                    onSelect={() => openStructureModal(row)}
                    icon={<FolderTree className="h-4 w-4 text-primary" />}
                  >
                    {t("curriculums.structure")}
                  </RowMenuItem>
                  {canManage && (
                    <>
                      <RowMenuItem
                        onSelect={() => openEditCurriculum(row)}
                        icon={<Pencil className="h-4 w-4" />}
                      >
                        {t("curriculums.edit")}
                      </RowMenuItem>
                      <RowMenuItem
                        onSelect={() => setDeleteCurriculumItem(row)}
                        danger
                        icon={<Trash2 className="h-4 w-4" />}
                      >
                        {t("curriculums.delete")}
                      </RowMenuItem>
                    </>
                  )}
                </>
              )}
              empty={{
                icon: <Layers className="h-10 w-10 text-muted-foreground/50" />,
                title: t("curriculums.empty"),
                description: t("curriculums.subtitle"),
              }}
              error={{
                icon: <AlertCircle className="h-10 w-10 text-destructive" />,
                title: t("common.error"),
              }}
            />
          </LiyonCard>
        </div>
      )}

      {/* TAB 2: Subjects */}
      {activeTab === "subjects" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={`${t("common.search")}...`}
                value={subjectSearch}
                onChange={(e) => setSubjectSearch(e.target.value)}
                className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <LiyonSelect
                value={subjectStatus}
                onChange={(e) => setSubjectStatus(e.target.value as "ALL" | "ACTIVE" | "INACTIVE")}
              >
                <option value="ALL">{t("common.all")}</option>
                <option value="ACTIVE">{t("status.active")}</option>
                <option value="INACTIVE">{t("status.inactive")}</option>
              </LiyonSelect>
            </div>
          </div>

          <LiyonCard>
            <DataTable<SubjectDto>
              state={filteredSubjects.length === 0 ? "empty" : "data"}
              headHeading={t("subjects.title")}
              rows={filteredSubjects}
              columns={subjectColumns}
              getRowId={(row) => row.id}
              renderRowMenu={
                canManage
                  ? (row) => (
                      <>
                        <RowMenuItem
                          onSelect={() => openEditSubject(row)}
                          icon={<Pencil className="h-4 w-4" />}
                        >
                          {t("subjects.edit")}
                        </RowMenuItem>
                        <RowMenuItem
                          onSelect={() => setDeleteSubjectItem(row)}
                          danger
                          icon={<Trash2 className="h-4 w-4" />}
                        >
                          {t("subjects.delete")}
                        </RowMenuItem>
                      </>
                    )
                  : undefined
              }
              empty={{
                icon: <Layers className="h-10 w-10 text-muted-foreground/50" />,
                title: t("subjects.empty"),
                description: t("subjects.subtitle"),
              }}
              error={{
                icon: <AlertCircle className="h-10 w-10 text-destructive" />,
                title: t("common.error"),
              }}
            />
          </LiyonCard>
        </div>
      )}

      {/* TAB 3: Departments */}
      {activeTab === "departments" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={`${t("common.search")}...`}
                value={deptSearch}
                onChange={(e) => setDeptSearch(e.target.value)}
                className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <LiyonSelect
                value={deptStatus}
                onChange={(e) => setDeptStatus(e.target.value as "ALL" | "ACTIVE" | "INACTIVE")}
              >
                <option value="ALL">{t("common.all")}</option>
                <option value="ACTIVE">{t("status.active")}</option>
                <option value="INACTIVE">{t("status.inactive")}</option>
              </LiyonSelect>
            </div>
          </div>

          <LiyonCard>
            <DataTable<DepartmentDto>
              state={filteredDepartments.length === 0 ? "empty" : "data"}
              headHeading={t("departments.title")}
              rows={filteredDepartments}
              columns={departmentColumns}
              getRowId={(row) => row.id}
              renderRowMenu={
                canManage
                  ? (row) => (
                      <>
                        <RowMenuItem
                          onSelect={() => openEditDept(row)}
                          icon={<Pencil className="h-4 w-4" />}
                        >
                          {t("departments.edit")}
                        </RowMenuItem>
                        <RowMenuItem
                          onSelect={() => setDeleteDeptItem(row)}
                          danger
                          icon={<Trash2 className="h-4 w-4" />}
                        >
                          {t("departments.delete")}
                        </RowMenuItem>
                      </>
                    )
                  : undefined
              }
              empty={{
                icon: <Building2 className="h-10 w-10 text-muted-foreground/50" />,
                title: t("departments.empty"),
                description: t("departments.subtitle"),
              }}
              error={{
                icon: <AlertCircle className="h-10 w-10 text-destructive" />,
                title: t("common.error"),
              }}
            />
          </LiyonCard>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* DIALOG: Create / Edit Curriculum */}
      {/* ---------------------------------------------------- */}
      <LiyonDialog open={curriculumModalOpen} onOpenChange={setCurriculumModalOpen}>
        <LiyonDialogCloseButton label={t("common.close")} />
        <LiyonDialogHeader
          title={editingCurriculum ? t("curriculums.edit") : t("curriculums.create")}
          description={t("curriculums.subtitle")}
        />
        <LiyonDialogBody>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-2 mb-4">
            <div className="flex flex-wrap gap-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setCurriculumFormTab("general")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  curriculumFormTab === "general"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {t("curriculums.tabGeneral")}
              </button>
              <button
                type="button"
                onClick={() => setCurriculumFormTab("philosophy")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  curriculumFormTab === "philosophy"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {t("curriculums.tabPhilosophy")}
              </button>
              <button
                type="button"
                onClick={() => setCurriculumFormTab("careers")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  curriculumFormTab === "careers"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {t("curriculums.tabCareers")}
              </button>
              <button
                type="button"
                onClick={() => setCurriculumFormTab("plos")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  curriculumFormTab === "plos"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {t("curriculums.tabPlos")}
              </button>
            </div>

            {!editingCurriculum && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fillMcuSample}
                className="text-xs gap-1.5 bg-primary/5 hover:bg-primary/10 text-primary border-primary/30"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t("curriculums.fillMcuSample")}</span>
              </Button>
            )}
          </div>

          {/* TAB 1: General Info */}
          {curriculumFormTab === "general" && (
            <div className="space-y-4 py-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LiyonField label={t("curriculums.code")} htmlFor="c-code">
                  <input
                    id="c-code"
                    value={cCode}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCCode(e.target.value)}
                    placeholder="เช่น 25611851100597, BBA-2567"
                    required
                  />
                </LiyonField>

                <LiyonField label={t("curriculums.revisionYear")} htmlFor="c-year">
                  <input
                    id="c-year"
                    type="number"
                    value={cRevisionYear}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCRevisionYear(Number(e.target.value))}
                    placeholder="เช่น 2570"
                    required
                  />
                </LiyonField>
              </div>

              <LiyonField label={t("curriculums.nameTh")} htmlFor="c-nameth">
                <input
                  id="c-nameth"
                  value={cNameTh}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCNameTh(e.target.value)}
                  placeholder="เช่น หลักสูตรพุทธศาสตรบัณฑิต สาขาวิชาพระพุทธศาสนา"
                  required
                />
              </LiyonField>

              <LiyonField label={t("curriculums.nameEn")} htmlFor="c-nameen">
                <input
                  id="c-nameen"
                  value={cNameEn}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCNameEn(e.target.value)}
                  placeholder="เช่น Bachelor of Arts Program in Buddhist Studies"
                  required
                />
              </LiyonField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LiyonField label={t("curriculums.department")} htmlFor="c-department">
                  <LiyonSelect
                    id="c-department"
                    value={cDepartmentId}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setCDepartmentId(e.target.value)}
                  >
                    <option value="">-- {t("curriculums.noDepartment")} --</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.code} - {d.nameTh}
                      </option>
                    ))}
                  </LiyonSelect>
                </LiyonField>

                <LiyonField label={t("curriculums.faculty")} htmlFor="c-faculty">
                  <input
                    id="c-faculty"
                    value={cFaculty}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCFaculty(e.target.value)}
                    placeholder="เช่น วิทยาเขตอุบลราชธานี หรือ คณะพุทธศาสตร์"
                  />
                </LiyonField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LiyonField label={t("curriculums.degreeTh")} htmlFor="c-degreeth">
                  <input
                    id="c-degreeth"
                    value={cDegreeTh}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCDegreeTh(e.target.value)}
                    placeholder="เช่น พุทธศาสตรบัณฑิต (พระพุทธศาสนา) / พธ.บ. (พระพุทธศาสนา)"
                  />
                </LiyonField>

                <LiyonField label={t("curriculums.degreeEn")} htmlFor="c-degreeen">
                  <input
                    id="c-degreeen"
                    value={cDegreeEn}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCDegreeEn(e.target.value)}
                    placeholder="เช่น Bachelor of Arts (Buddhist Studies) / B.A. (Buddhist Studies)"
                  />
                </LiyonField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <LiyonField label={t("curriculums.totalCredits")} htmlFor="c-credits">
                  <input
                    id="c-credits"
                    type="number"
                    value={cTotalCredits}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCTotalCredits(Number(e.target.value))}
                    placeholder="เช่น 132"
                  />
                </LiyonField>

                <LiyonField label={t("curriculums.durationYears")} htmlFor="c-duration">
                  <input
                    id="c-duration"
                    type="number"
                    value={cDurationYears}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCDurationYears(Number(e.target.value))}
                    placeholder="เช่น 4"
                  />
                </LiyonField>

                <LiyonField label={t("curriculums.status")} htmlFor="c-status">
                  <LiyonSelect
                    id="c-status"
                    value={cStatus}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setCStatus(e.target.value as "ACTIVE" | "INACTIVE")}
                  >
                    <option value="ACTIVE">{t("status.active")}</option>
                    <option value="INACTIVE">{t("status.inactive")}</option>
                  </LiyonSelect>
                </LiyonField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LiyonField label={t("curriculums.studyType")} htmlFor="c-studytype">
                  <input
                    id="c-studytype"
                    value={cStudyType}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCStudyType(e.target.value)}
                    placeholder="เช่น หลักสูตรปริญญาตรีทางวิชาการ (หลักสูตร ๔ ปี) ภาษาไทยและภาษาอังกฤษ"
                  />
                </LiyonField>

                <LiyonField label={t("curriculums.campusLocation")} htmlFor="c-location">
                  <input
                    id="c-location"
                    value={cCampusLocation}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCCampusLocation(e.target.value)}
                    placeholder="เช่น วิทยาเขตอุบลราชธานี หมู่ ๑ ต.กระโสบ อ.เมือง จ.อุบลราชธานี"
                  />
                </LiyonField>
              </div>
            </div>
          )}

          {/* TAB 2: Philosophy & Objectives */}
          {curriculumFormTab === "philosophy" && (
            <div className="space-y-4 py-1">
              <LiyonField label={t("curriculums.philosophy")} htmlFor="c-philosophy">
                <textarea
                  id="c-philosophy"
                  rows={4}
                  value={cPhilosophy}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCPhilosophy(e.target.value)}
                  placeholder="เช่น จัดการศึกษาพระพุทธศาสนาบูรณาการกับศาสตร์สมัยใหม่ ผลิตบัณฑิตให้มีความรู้ดี มีศีลธรรม นำสังคมสู่สันติสุข"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                />
              </LiyonField>

              <LiyonField label={t("curriculums.objectives")} htmlFor="c-objectives">
                <textarea
                  id="c-objectives"
                  rows={8}
                  value={cObjectives}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCObjectives(e.target.value)}
                  placeholder="วัตถุประสงค์ของหลักสูตร (แต่ละข้อขึ้นบรรทัดใหม่) เช่น&#10;๑. เพื่อผลิตบัณฑิตมีความรอบรู้ในหลักพระพุทธศาสนาและศาสตร์ที่เกี่ยวข้อง&#10;๒. เพื่อผลิตบัณฑิตให้มีทักษะการถ่ายทอดหลักพุทธธรรมกับศาสตร์สมัยใหม่..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                />
              </LiyonField>
            </div>
          )}

          {/* TAB 3: Careers & Admission (Portal) */}
          {curriculumFormTab === "careers" && (
            <div className="space-y-4 py-1">
              <LiyonField label={t("curriculums.careerPaths")} htmlFor="c-careers">
                <textarea
                  id="c-careers"
                  rows={6}
                  value={cCareerPaths}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCCareerPaths(e.target.value)}
                  placeholder="กลุ่มสายงานและตำแหน่งงานที่ทำได้หลังสำเร็จการศึกษา เช่น&#10;๑. สายงานภาครัฐ: นักวิชาการศาสนา, อนุศาสนาจารย์&#10;๒. สายงานสุขภาพจิตและสังคมสงเคราะห์: นักสมาธิบำบัด, Spiritual Caregiver&#10;๓. สื่อและท่องเที่ยวเชิงพุทธศิลป์: Content Creator, ผู้นำเที่ยวเชิงวัฒนธรรม..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                />
              </LiyonField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LiyonField label={t("curriculums.admissionReq")} htmlFor="c-admission">
                  <textarea
                    id="c-admission"
                    rows={5}
                    value={cAdmissionReq}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCAdmissionReq(e.target.value)}
                    placeholder="คุณสมบัติผู้สมัคร (พระภิกษุสามเณร และคฤหัสถ์) เช่น&#10;- จบ ม.๖ หรือเทียบเท่า / หรือสอบได้เปรียญธรรม ๓ ประโยคขึ้นไป"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                  />
                </LiyonField>

                <div className="space-y-4">
                  <LiyonField label={t("curriculums.tuitionFees")} htmlFor="c-tuition">
                    <input
                      id="c-tuition"
                      value={cTuitionFees}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setCTuitionFees(e.target.value)}
                      placeholder="เช่น ประมาณ ๘,๐๐๐ บาท/ปี (ค่าบำรุงการศึกษาและค่าลงทะเบียน)"
                    />
                  </LiyonField>

                  <LiyonField label={t("curriculums.graduationCriteria")} htmlFor="c-grad">
                    <textarea
                      id="c-grad"
                      rows={3}
                      value={cGraduationCriteria}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCGraduationCriteria(e.target.value)}
                      placeholder="เช่น สอบครบ ๑๓๒ หน่วยกิต, GPAX >= ๒.๐๐, ผ่านการฝึกปฏิบัติวิปัสสนา และผ่านเกณฑ์ภาษาอังกฤษ"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                    />
                  </LiyonField>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Program Learning Outcomes (PLOs) */}
          {curriculumFormTab === "plos" && (
            <div className="space-y-4 py-1">
              <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 text-xs text-primary leading-relaxed">
                <strong>ผลลัพธ์การเรียนรู้ระดับหลักสูตร (Program Learning Outcomes: PLOs)</strong> จะถูกนำไปแสดงบนหน้า Portal เพื่อสร้างความมั่นใจในศักยภาพของบัณฑิต (แนะนำให้พิมพ์แบบ <code>PLO 1: รายละเอียด...</code> ขึ้นบรรทัดใหม่ละข้อ)
              </div>
              <LiyonField label={t("curriculums.plos")} htmlFor="c-plos">
                <textarea
                  id="c-plos"
                  rows={9}
                  value={cPlosText}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCPlosText(e.target.value)}
                  placeholder="PLO 1: มีความรอบรู้ในหลักพระพุทธศาสนาและศาสตร์ที่เกี่ยวข้อง...&#10;PLO 2: มีทักษะการถ่ายทอดหลักพุทธธรรมกับศาสตร์สมัยใหม่...&#10;PLO 3: ปฏิบัติตนตามหลักคุณธรรม จริยธรรม ยึดมั่นในหลักพระพุทธศาสนา...&#10;PLO 4: มีภาวะผู้นำ สามารถทำงานร่วมกับผู้อื่นในศตวรรษที่ ๒๑...&#10;PLO 5: สามารถใช้เทคโนโลยีดิจิทัล สารสนเทศ พุทธนวัตกรรม..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono text-xs focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                />
              </LiyonField>
            </div>
          )}
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setCurriculumModalOpen(false)} disabled={isPending}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSaveCurriculum} disabled={isPending}>
            {t("common.save")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* ---------------------------------------------------- */}
      {/* DIALOG: Delete Curriculum */}
      {/* ---------------------------------------------------- */}
      <LiyonDialog open={!!deleteCurriculumItem} onOpenChange={(open) => !open && setDeleteCurriculumItem(null)} danger>
        <LiyonDialogCloseButton label={t("common.close")} />
        <LiyonDialogHeader
          title={t("curriculums.delete")}
          description={t("curriculums.deleteConfirm")}
        />
        <LiyonDialogBody>
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <span className="font-semibold">{deleteCurriculumItem?.code}</span>: {deleteCurriculumItem?.nameTh}
          </div>
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setDeleteCurriculumItem(null)} disabled={isPending}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteCurriculumItem && handleDeleteCurriculum(deleteCurriculumItem)}
            disabled={isPending}
          >
            {t("curriculums.delete")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* ---------------------------------------------------- */}
      {/* DIALOG: Create / Edit Subject */}
      {/* ---------------------------------------------------- */}
      <LiyonDialog open={subjectModalOpen} onOpenChange={setSubjectModalOpen}>
        <LiyonDialogCloseButton label={t("common.close")} />
        <LiyonDialogHeader
          title={editingSubject ? t("subjects.edit") : t("subjects.create")}
          description={t("subjects.subtitle")}
        />
        <LiyonDialogBody>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <LiyonField label={t("subjects.code")} htmlFor="s-code">
                <input
                  id="s-code"
                  value={sCode}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSCode(e.target.value)}
                  placeholder="เช่น MGT1001"
                  required
                />
              </LiyonField>

              <LiyonField label={t("subjects.credits")} htmlFor="s-credits">
                <input
                  id="s-credits"
                  type="number"
                  value={sCredits}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSCredits(Number(e.target.value))}
                  placeholder="3"
                  required
                />
              </LiyonField>

              <LiyonField label={t("subjects.creditInfo")} htmlFor="s-info">
                <input
                  id="s-info"
                  value={sCreditInfo}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSCreditInfo(e.target.value)}
                  placeholder="3(3-0-6)"
                />
              </LiyonField>
            </div>

            <LiyonField label={t("subjects.nameTh")} htmlFor="s-nameth">
              <input
                id="s-nameth"
                value={sNameTh}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSNameTh(e.target.value)}
                placeholder="เช่น การจัดการองค์การและทรัพยากรมนุษย์"
                required
              />
            </LiyonField>

            <LiyonField label={t("subjects.nameEn")} htmlFor="s-nameen">
              <input
                id="s-nameen"
                value={sNameEn}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSNameEn(e.target.value)}
                placeholder="เช่น Organization and Human Resource Management"
                required
              />
            </LiyonField>

            <LiyonField label={t("subjects.description")} htmlFor="s-desc">
              <textarea
                id="s-desc"
                rows={3}
                value={sDescription}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setSDescription(e.target.value)}
                placeholder="รายละเอียดเนื้อหาวิชา..."
                className="w-full rounded-md border border-input bg-background p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </LiyonField>

            <LiyonField label={t("subjects.status")} htmlFor="s-status">
              <LiyonSelect
                id="s-status"
                value={sStatus}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setSStatus(e.target.value as "ACTIVE" | "INACTIVE")}
              >
                <option value="ACTIVE">{t("status.active")}</option>
                <option value="INACTIVE">{t("status.inactive")}</option>
              </LiyonSelect>
            </LiyonField>
          </div>
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setSubjectModalOpen(false)} disabled={isPending}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSaveSubject} disabled={isPending}>
            {t("common.save")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* ---------------------------------------------------- */}
      {/* DIALOG: Delete Subject */}
      {/* ---------------------------------------------------- */}
      <LiyonDialog open={!!deleteSubjectItem} onOpenChange={(open) => !open && setDeleteSubjectItem(null)} danger>
        <LiyonDialogCloseButton label={t("common.close")} />
        <LiyonDialogHeader
          title={t("subjects.delete")}
          description={t("subjects.deleteConfirm")}
        />
        <LiyonDialogBody>
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <span className="font-semibold">{deleteSubjectItem?.code}</span>: {deleteSubjectItem?.nameTh}
          </div>
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setDeleteSubjectItem(null)} disabled={isPending}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteSubjectItem && handleDeleteSubject(deleteSubjectItem)}
            disabled={isPending}
          >
            {t("subjects.delete")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* ---------------------------------------------------- */}
      {/* DIALOG: Create / Edit Department */}
      {/* ---------------------------------------------------- */}
      <LiyonDialog open={deptModalOpen} onOpenChange={setDeptModalOpen}>
        <LiyonDialogCloseButton label={t("common.close")} />
        <LiyonDialogHeader
          title={editingDept ? t("departments.edit") : t("departments.create")}
          description={t("departments.subtitle")}
        />
        <LiyonDialogBody>
          <div className="space-y-4 py-2">
            <LiyonField label={t("departments.code")} htmlFor="d-code">
              <input
                id="d-code"
                value={dCode}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDCode(e.target.value)}
                placeholder="เช่น D-MGT, D-ACC, D-BIS"
                required
              />
            </LiyonField>

            <LiyonField label={t("departments.nameTh")} htmlFor="d-nameth">
              <input
                id="d-nameth"
                value={dNameTh}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDNameTh(e.target.value)}
                placeholder="เช่น ภาควิชาการจัดการ"
                required
              />
            </LiyonField>

            <LiyonField label={t("departments.nameEn")} htmlFor="d-nameen">
              <input
                id="d-nameen"
                value={dNameEn}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDNameEn(e.target.value)}
                placeholder="เช่น Department of Management"
                required
              />
            </LiyonField>

            <LiyonField label={t("departments.description")} htmlFor="d-desc">
              <textarea
                id="d-desc"
                rows={3}
                value={dDescription}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDDescription(e.target.value)}
                placeholder="พันธกิจหรือรายละเอียดของภาควิชา/ส่วนงาน..."
                className="w-full rounded-md border border-input bg-background p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </LiyonField>

            <LiyonField label={t("departments.status")} htmlFor="d-status">
              <LiyonSelect
                id="d-status"
                value={dStatus}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setDStatus(e.target.value as "ACTIVE" | "INACTIVE")}
              >
                <option value="ACTIVE">{t("status.active")}</option>
                <option value="INACTIVE">{t("status.inactive")}</option>
              </LiyonSelect>
            </LiyonField>
          </div>
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setDeptModalOpen(false)} disabled={isPending}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSaveDept} disabled={isPending}>
            {t("common.save")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* ---------------------------------------------------- */}
      {/* DIALOG: Delete Department */}
      {/* ---------------------------------------------------- */}
      <LiyonDialog open={!!deleteDeptItem} onOpenChange={(open) => !open && setDeleteDeptItem(null)} danger>
        <LiyonDialogCloseButton label={t("common.close")} />
        <LiyonDialogHeader
          title={t("departments.delete")}
          description={t("departments.deleteConfirm")}
        />
        <LiyonDialogBody>
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <span className="font-semibold">{deleteDeptItem?.code}</span>: {deleteDeptItem?.nameTh}
          </div>
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setDeleteDeptItem(null)} disabled={isPending}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteDeptItem && handleDeleteDept(deleteDeptItem)}
            disabled={isPending}
          >
            {t("departments.delete")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>

      {/* ---------------------------------------------------- */}
      {/* MODAL: Curriculum Structure & Subject Management */}
      {/* ---------------------------------------------------- */}
      <LiyonDialog
        open={!!structureCurriculum || structureLoading}
        onOpenChange={(open) => !open && setStructureCurriculum(null)}
      >
        <LiyonDialogCloseButton label={t("common.close")} />
        <LiyonDialogHeader
          title={
            structureCurriculum
              ? `${structureCurriculum.code} — ${t("curriculums.structureTitle")}`
              : t("curriculums.structureTitle")
          }
          description={
            structureCurriculum
              ? `${structureCurriculum.nameTh} (${structureCurriculum.revisionYear})`
              : t("curriculums.structureSubtitle")
          }
        />
        <LiyonDialogBody>
          {structureLoading ? (
            <div className="py-12 text-center text-muted-foreground">{t("common.loading")}</div>
          ) : structureCurriculum ? (
            <div className="space-y-6 py-2">
              {/* Credit summary banner */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-muted/50 p-4 border border-border">
                <div>
                  <div className="text-xs text-muted-foreground">{t("curriculums.degreeTh")}</div>
                  <div className="font-semibold text-foreground">
                    {structureCurriculum.degreeTh || structureCurriculum.degreeEn || "—"}
                  </div>
                  {structureCurriculum.department && (
                    <div className="text-xs text-primary mt-0.5 flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {structureCurriculum.department.nameTh}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">{t("curriculums.subjectCount")}</div>
                    <div className="text-lg font-bold text-primary">
                      {structureCurriculum.subjects.length}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">หน่วยกิตในหลักสูตร / ที่กำหนด</div>
                    <div className="text-lg font-bold">
                      <span className={structureTotalCredits >= structureCurriculum.totalCredits ? "text-emerald-600" : "text-amber-600"}>
                        {structureTotalCredits}
                      </span>
                      {" / "}
                      <span>{structureCurriculum.totalCredits}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add Subject to Curriculum Form (if canManage) */}
              {canManage && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
                  <div className="text-sm font-semibold text-primary flex items-center gap-1.5">
                    <Plus className="h-4 w-4" />
                    {t("curriculums.addSubjectToCurriculum")}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-5">
                      <label className="text-xs font-medium text-muted-foreground block mb-1">
                        {t("curriculums.selectSubject")}
                      </label>
                      <LiyonSelect
                        value={assignSubjectId}
                        onChange={(e) => setAssignSubjectId(e.target.value)}
                      >
                        <option value="">-- {t("curriculums.selectSubject")} --</option>
                        {availableSubjectsToAssign.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.code} - {s.nameTh} ({s.credits} หน่วยกิต)
                          </option>
                        ))}
                      </LiyonSelect>
                    </div>

                    <div className="md:col-span-4">
                      <label className="text-xs font-medium text-muted-foreground block mb-1">
                        {t("curriculums.selectCategory")}
                      </label>
                      <LiyonSelect
                        value={assignCategory}
                        onChange={(e) => setAssignCategory(e.target.value)}
                      >
                        {DEFAULT_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        <option value="CUSTOM">-- ระบุหมวดวิชาเอง --</option>
                      </LiyonSelect>
                    </div>

                    <div className="md:col-span-3 flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <LiyonSwitch
                          id="assign-compulsory"
                          checked={assignCompulsory}
                          onCheckedChange={setAssignCompulsory}
                        />
                        <label htmlFor="assign-compulsory" className="text-xs font-medium cursor-pointer">
                          {assignCompulsory ? t("curriculums.compulsory") : t("curriculums.elective")}
                        </label>
                      </div>
                      <Button
                        size="sm"
                        onClick={handleAssignSubject}
                        disabled={!assignSubjectId || isPending}
                        className="ml-auto"
                      >
                        {t("common.add")}
                      </Button>
                    </div>
                  </div>

                  {assignCategory === "CUSTOM" && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="พิมพ์ชื่อหมวดวิชาที่ต้องการ..."
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Grouped Subjects by Category */}
              {Object.keys(groupedStructureSubjects).length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-sm">ยังไม่มีรายวิชาในหลักสูตรนี้</p>
                  {canManage && <p className="text-xs mt-1">เลือกรายวิชาด้านบนเพื่อเพิ่มเข้าในหลักสูตร</p>}
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedStructureSubjects).map(([category, items]) => {
                    const categoryCredits = items.reduce((sum, it) => sum + it.subject.credits, 0);
                    return (
                      <div key={category} className="rounded-lg border border-border overflow-hidden">
                        <div className="flex items-center justify-between bg-muted/60 px-4 py-2.5 font-semibold text-sm">
                          <span className="flex items-center gap-2">
                            <FolderTree className="h-4 w-4 text-primary" />
                            {category}
                          </span>
                          <span className="text-xs font-normal text-muted-foreground">
                            {items.length} วิชา ({categoryCredits} หน่วยกิต)
                          </span>
                        </div>
                        <div className="divide-y divide-border">
                          {items.map((it) => (
                            <div
                              key={it.id}
                              className="flex items-center justify-between p-3 text-sm hover:bg-muted/30 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-primary min-w-[5rem]">
                                  {it.subject.code}
                                </span>
                                <div>
                                  <div className="font-medium">{it.subject.nameTh}</div>
                                  <div className="text-xs text-muted-foreground">{it.subject.nameEn}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground">
                                  {it.subject.credits} นก. {it.subject.creditInfo ? `(${it.subject.creditInfo})` : ""}
                                </span>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                    it.isCompulsory
                                      ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                                      : "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                                  }`}
                                >
                                  {it.isCompulsory ? t("curriculums.compulsory") : t("curriculums.elective")}
                                </span>
                                {canManage && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveSubject(it.subjectId)}
                                    disabled={isPending}
                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                    title={t("curriculums.removeSubject")}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : null}
        </LiyonDialogBody>
        <LiyonDialogFooter>
          <Button variant="outline" onClick={() => setStructureCurriculum(null)}>
            {t("common.close")}
          </Button>
        </LiyonDialogFooter>
      </LiyonDialog>
    </div>
  );
}
