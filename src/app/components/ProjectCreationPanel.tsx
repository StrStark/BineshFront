import { useState } from "react";
import { X, Folder, FileText, Calendar, Users, Tag } from "lucide-react";
import { useCurrentColors } from "../contexts/ThemeColorsContext";

export interface ProjectData {
  name: string;
  description: string;
  category: string;
  startDate: string;
  team: string[];
  tags: string[];
}

interface ProjectCreationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (projectData: ProjectData) => void;
}

export function ProjectCreationPanel({
  isOpen,
  onClose,
  onCreateProject,
}: ProjectCreationPanelProps) {
  const colors = useCurrentColors();
  const [projectData, setProjectData] = useState<ProjectData>({
    name: "",
    description: "",
    category: "",
    startDate: "",
    team: [],
    tags: [],
  });
  const [currentTag, setCurrentTag] = useState("");
  const [currentTeamMember, setCurrentTeamMember] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectData.name.trim()) {
      onCreateProject(projectData);
      // Reset form
      setProjectData({
        name: "",
        description: "",
        category: "",
        startDate: "",
        team: [],
        tags: [],
      });
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !projectData.tags.includes(currentTag.trim())) {
      setProjectData({
        ...projectData,
        tags: [...projectData.tags, currentTag.trim()],
      });
      setCurrentTag("");
    }
  };

  const removeTag = (tag: string) => {
    setProjectData({
      ...projectData,
      tags: projectData.tags.filter((t) => t !== tag),
    });
  };

  const addTeamMember = () => {
    if (currentTeamMember.trim() && !projectData.team.includes(currentTeamMember.trim())) {
      setProjectData({
        ...projectData,
        team: [...projectData.team, currentTeamMember.trim()],
      });
      setCurrentTeamMember("");
    }
  };

  const removeTeamMember = (member: string) => {
    setProjectData({
      ...projectData,
      team: projectData.team.filter((m) => m !== member),
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn backdrop-blur-sm"
      dir="rtl"
    >
      <div
        className="rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn"
        style={{ backgroundColor: colors.cardBackground }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 p-6 border-b flex items-center justify-between"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.primary + "20" }}
            >
              <Folder className="w-5 h-5" style={{ color: colors.primary }} />
            </div>
            <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
              ایجاد پروژه جدید
            </h2>
          </div>
          <button
            onClick={onClose}
            className="transition-colors p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: colors.textSecondary }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
              <Folder className="w-4 h-4" />
              نام پروژه
            </label>
            <input
              type="text"
              value={projectData.name}
              onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
              placeholder="نام پروژه را وارد کنید..."
              className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors"
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: colors.border,
                color: colors.textPrimary,
              }}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
              <FileText className="w-4 h-4" />
              توضیحات
            </label>
            <textarea
              value={projectData.description}
              onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
              placeholder="توضیحات پروژه را وارد کنید..."
              className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors resize-none"
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: colors.border,
                color: colors.textPrimary,
              }}
              rows={4}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
              <Tag className="w-4 h-4" />
              دسته‌بندی
            </label>
            <select
              value={projectData.category}
              onChange={(e) => setProjectData({ ...projectData, category: e.target.value })}
              className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors"
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: colors.border,
                color: colors.textPrimary,
              }}
            >
              <option value="">انتخاب دسته‌بندی</option>
              <option value="development">توسعه نرم‌افزار</option>
              <option value="marketing">بازاریابی</option>
              <option value="design">طراحی</option>
              <option value="research">تحقیق و توسعه</option>
              <option value="other">سایر</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
              <Calendar className="w-4 h-4" />
              تاریخ شروع
            </label>
            <input
              type="date"
              value={projectData.startDate}
              onChange={(e) => setProjectData({ ...projectData, startDate: e.target.value })}
              className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors"
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: colors.border,
                color: colors.textPrimary,
              }}
            />
          </div>

          {/* Team Members */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
              <Users className="w-4 h-4" />
              اعضای تیم
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentTeamMember}
                onChange={(e) => setCurrentTeamMember(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTeamMember();
                  }
                }}
                placeholder="نام عضو تیم..."
                className="flex-1 rounded-lg px-4 py-2 text-sm outline-none transition-colors"
                style={{
                  backgroundColor: colors.backgroundSecondary,
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: colors.border,
                  color: colors.textPrimary,
                }}
              />
              <button
                type="button"
                onClick={addTeamMember}
                className="px-4 py-2 rounded-lg text-white text-sm hover:opacity-90 transition-opacity"
                style={{ backgroundColor: colors.primary }}
              >
                افزودن
              </button>
            </div>
            {projectData.team.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {projectData.team.map((member, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm"
                    style={{
                      backgroundColor: colors.primary + "20",
                      color: colors.primary,
                    }}
                  >
                    {member}
                    <button
                      type="button"
                      onClick={() => removeTeamMember(member)}
                      className="hover:opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
              <Tag className="w-4 h-4" />
              برچسب‌ها
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="برچسب..."
                className="flex-1 rounded-lg px-4 py-2 text-sm outline-none transition-colors"
                style={{
                  backgroundColor: colors.backgroundSecondary,
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: colors.border,
                  color: colors.textPrimary,
                }}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 rounded-lg text-white text-sm hover:opacity-90 transition-opacity"
                style={{ backgroundColor: colors.primary }}
              >
                افزودن
              </button>
            </div>
            {projectData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {projectData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm"
                    style={{
                      backgroundColor: colors.success + "20",
                      color: colors.success,
                    }}
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:opacity-70">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t" style={{ borderColor: colors.border }}>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{ color: colors.textSecondary }}
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg text-white text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: colors.primary }}
              disabled={!projectData.name.trim()}
            >
              ایجاد پروژه
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
