import { useCurrentColors } from "../contexts/ThemeColorsContext";
import { AIExportButtons } from "./AIExportButtons";

interface TableData {
  title?: string;
  rows: Record<string, any>[];
}

interface AITableRendererProps {
  data: TableData;
}

export function AITableRenderer({ data }: AITableRendererProps) {
  const colors = useCurrentColors();

  if (!data.rows || data.rows.length === 0) {
    return (
      <div className="text-sm opacity-60" style={{ color: colors.textSecondary }}>
        داده‌ای برای نمایش وجود ندارد
      </div>
    );
  }

  // Extract column headers from first row
  const columns = Object.keys(data.rows[0]);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        {data.title && (
          <h3 className="text-sm font-medium" style={{ color: colors.textPrimary }}>
            {data.title}
          </h3>
        )}
        <AIExportButtons
          showPdf
          showExcel
          title={data.title || "جدول"}
          data={data.rows}
          columns={columns}
        />
      </div>
      <div className="w-full overflow-x-auto rounded-lg border" style={{ borderColor: colors.border }}>
        <table className="w-full text-sm" dir="rtl">
          <thead>
            <tr style={{ backgroundColor: colors.backgroundSecondary }}>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-right font-medium border-b"
                  style={{
                    color: colors.textPrimary,
                    borderColor: colors.border,
                  }}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="transition-colors hover:bg-opacity-50"
                style={{
                  backgroundColor: rowIndex % 2 === 0 ? 'transparent' : colors.backgroundSecondary + '40',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.backgroundSecondary + '80';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = rowIndex % 2 === 0 ? 'transparent' : colors.backgroundSecondary + '40';
                }}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-3 border-b"
                    style={{
                      color: colors.textPrimary,
                      borderColor: colors.border,
                    }}
                  >
                    {row[column] !== null && row[column] !== undefined ? String(row[column]) : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
